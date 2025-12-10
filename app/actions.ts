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
    categoryId: string
): Promise<Question[]> {
    if (!categoryId) return [];

    try {
        const [rows] = await db.query<any[]>(
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
      `,
            [categoryId]
        );

        return rows.map((row: any) => ({
            ...row,
            options: JSON.parse(row.options),
        }));
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
      INSERT INTO questions (id, category, question, options, correct_answer)
      VALUES (?, ?, ?, ?, ?)
      `,
            [
                newQuestion.id,
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
