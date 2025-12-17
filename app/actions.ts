// src/app/actions.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    categoryName?: string;
}

/**
 * LẤY DANH SÁCH CÂU HỎI THEO CHỦ ĐỀ
 */
export async function getQuestionsByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 5
): Promise<Question[]> {
    if (!categoryId) return [];

    const offset = (page - 1) * limit;

    try {
        const rows = await db.query<any[]>(
            `
            SELECT
                id,
                question,
                options,
                correct_answer AS correctAnswer,
                category AS categoryName
            FROM questions
            WHERE category = ?
            ORDER BY id DESC
            LIMIT ? OFFSET ?
            `,
            [categoryId, limit, offset]
        );

        return rows.map((row: any) => {
            let options: string[];

            try {
                options = JSON.parse(row.options);
                if (!Array.isArray(options)) throw new Error();
            } catch {
                options = [row.options]; // dữ liệu cũ
            }

            return {
                ...row,
                options,
            };
        });
    } catch (error) {
        console.error("Lỗi DB (getQuestionsByCategory):", error);
        return [];
    }
}

/**
 * THÊM CÂU HỎI MỚI
 */
export async function addQuestion(formData: FormData) {
    const categoryId = formData.get("categoryId") as string;
    const questionText = formData.get("question") as string;
    const answer = formData.get("answer") as string;

    if (!categoryId || !questionText || !answer) {
        return { success: false, message: "Thiếu dữ liệu" };
    }

    const newQuestion: Question = {
        id: Date.now(), // demo OK
        question: questionText,
        options: [answer],
        correctAnswer: answer,
        categoryName: categoryId,
    };

    try {
        await db.query(
            `
      INSERT INTO questions (category, question, options, correct_answer)
      VALUES (?, ?, ?, ?)
      `,
            [
                newQuestion.categoryName,
                newQuestion.question,
                JSON.stringify(newQuestion.options),
                newQuestion.correctAnswer,
            ]
        );

        revalidatePath("/");
        return { success: true, message: "Thêm câu hỏi thành công!" };
    } catch (error) {
        console.error("Lỗi DB (addQuestion):", error);
        return { success: false, message: "Lỗi server khi lưu dữ liệu" };
    }
}

export async function getQuestionById(id: number) {
    try {
        const rows = await db.query<any[]>(
            `
            SELECT
                id,
                question,
                options,
                correct_answer AS correctAnswer,
                category
            FROM questions
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (!rows || rows.length === 0) return null;

        let options: string[];

        try {
            options = JSON.parse(rows[0].options);
            if (!Array.isArray(options)) throw new Error();
        } catch {
            options = [rows[0].options]; // dữ liệu cũ
        }

        return {
            ...rows[0],
            options,
        };
    } catch (error) {
        console.error("Lỗi DB (getQuestionById):", error);
        return null;
    }
}

export async function updateQuestion(formData: FormData) {
    const id = Number(formData.get("id"));
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;
    const categoryId = formData.get("categoryId") as string;

    const options = [answer]; // hiện đang dùng 1 đáp án duy nhất

    if (!id || !question || !answer || !categoryId) {
        return { success: false, message: "Thiếu dữ liệu cập nhật" };
    }

    try {
        await db.query(
            `
            UPDATE questions
            SET 
                question = ?,
                options = ?,
                correct_answer = ?,
                category = ?
            WHERE id = ?
            `,
            [
                question,
                JSON.stringify(options),
                answer,
                categoryId,
                id,
            ]
        );

        revalidatePath("/");
        return { success: true, message: "Cập nhật thành công!" };
    } catch (error) {
        console.error("Lỗi DB (updateQuestion):", error);
        return { success: false, message: "Không thể cập nhật dữ liệu" };
    }
}
