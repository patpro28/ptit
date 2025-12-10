// src/app/actions.ts
"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

// Định nghĩa kiểu dữ liệu
export interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    categoryName?: string;
}

// Map danh mục sang tên file (Dùng chung)
const FILE_MAP: Record<string, string> = {
    "lap-trinh": "lap-trinh.json",
    "khoa-hoc": "khoa-hoc.json",
    "toan-hoc": "toan-hoc.json",
    "ktct": "ktct.json"
};

// --- HÀM 1: LẤY CÂU HỎI (Đã có) ---
export async function getQuestionsByCategory(categoryId: string): Promise<Question[]> {
    try {
        const dataDirectory = path.join(process.cwd(), "data");
        const fileName = FILE_MAP[categoryId];

        if (!fileName) return [];

        const filePath = path.join(dataDirectory, fileName);

        // Kiểm tra file có tồn tại không trước khi đọc để tránh lỗi crash
        try {
            await fs.access(filePath);
        } catch {
            return []; // File chưa tồn tại trả về rỗng
        }

        const fileContents = await fs.readFile(filePath, "utf8");
        const data = JSON.parse(fileContents);
        return data;

    } catch (error) {
        console.error("Lỗi đọc file:", error);
        return [];
    }
}

// --- HÀM 2: THÊM CÂU HỎI MỚI (Mới thêm) ---
export async function addQuestion(formData: FormData) {
    const categoryId = formData.get('categoryId') as string;
    const questionText = formData.get('question') as string;

    // Lấy 4 đáp án từ form
    const option = formData.get('answer') as string;

    // Lấy đáp án đúng (Là text của 1 trong 4 option, hoặc là index A/B/C/D tùy logic bạn muốn)
    // Ở đây mình giả sử form gửi lên text của đáp án đúng
    const correctAnswer = formData.get('answer') as string;

    if (!categoryId || !FILE_MAP[categoryId]) {
        return { success: false, message: 'Chủ đề không hợp lệ' };
    }

    const fileName = FILE_MAP[categoryId];
    const filePath = path.join(process.cwd(), "data", fileName);

    try {
        let questions: Question[] = [];

        // 1. Đọc dữ liệu cũ
        try {
            const fileContents = await fs.readFile(filePath, "utf8");
            questions = JSON.parse(fileContents);
        } catch (error: unknown) {
            if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
            // Nếu file chưa có thì mảng questions vẫn là []
        }

        // 2. Tạo object câu hỏi mới
        const newQuestion: Question = {
            id: Date.now(), // Dùng timestamp làm ID (số)
            question: questionText,
            options: [option], // Gom thành mảng
            correctAnswer: correctAnswer,
            categoryName: categoryId // Lưu tạm slug vào đây hoặc tên hiển thị
        };

        // 3. Push và Ghi file
        questions.push(newQuestion);
        await fs.writeFile(filePath, JSON.stringify(questions, null, 2));

        // 4. Update cache
        revalidatePath('/');

        return { success: true, message: 'Thêm câu hỏi thành công!' };

    } catch (error) {
        console.error("Lỗi ghi file:", error);
        return { success: false, message: 'Lỗi server khi lưu dữ liệu' };
    }
}