'use client'

import { useRef, useState } from 'react';
import { addQuestion } from '@/app/actions';
import { CATEGORIES } from '@/lib/categories';

// IMPORT ACE EDITOR VÀ CÁC THÀNH PHẦN CẦN THIẾT
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-dracula'; // Theme tối
import 'ace-builds/src-noconflict/theme-github';   // Theme sáng
import 'ace-builds/src-noconflict/ext-language_tools';

export default function AddQuestionForm() {
    const formRef = useRef<HTMLFormElement>(null);

    // THAY ĐỔI: Thêm state cho nội dung câu hỏi
    const [questionContent, setQuestionContent] = useState("");

    // State quản lý nội dung câu trả lời
    const [answerContent, setAnswerContent] = useState("");

    const editorTheme = 'dracula'; // Dùng tạm theme tối

    const handleFormSubmit = async () => {
        // Tạo FormData mới để chèn nội dung từ cả hai Ace Editor
        const newFormData = new FormData(formRef.current!);

        // QUAN TRỌNG: Ghi đè nội dung của cả Question và Answer
        newFormData.set('content', questionContent);
        newFormData.set('answer', answerContent);

        const result = await addQuestion(newFormData);

        if (result?.success) {
            alert(result.message);
            formRef.current?.reset();
            setQuestionContent(""); // Reset cả hai editor
            setAnswerContent("");
        } else {
            alert(result?.message);
        }
    };

    return (
        <div className="p-6 border rounded-lg shadow-sm bg-white dark:bg-neutral-900 dark:border-neutral-800">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Thêm câu hỏi mới ✨</h2>

            <form
                ref={formRef}
                action={handleFormSubmit}
                className="flex flex-col gap-5"
            >

                {/* SELECT FIELD CHỌN CHỦ ĐỀ */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="categoryId" className="font-medium text-gray-700 dark:text-gray-300">Chọn chủ đề</label>
                    <div className="relative">
                        <select
                            name="categoryId"
                            id="categoryId"
                            required
                            defaultValue=""
                            className="block w-full p-3 border rounded-lg bg-transparent dark:border-neutral-700 focus:ring-2 focus:ring-blue-500 appearance-none pr-10 cursor-pointer text-gray-700 dark:text-gray-200"
                        >
                            <option value="" disabled>-- Chọn một chủ đề --</option>
                            {CATEGORIES.map((topic) => (
                                <option key={topic.value} value={topic.value}>
                                    {topic.label}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>

                {/* --- 1. ACE EDITOR CHO CÂU HỎI (MỚI) --- */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="content_editor" className="font-medium text-gray-700 dark:text-gray-300">Nội dung câu hỏi (Markdown/Code)</label>
                    <AceEditor
                        mode="markdown"
                        theme={editorTheme}
                        value={questionContent}
                        onChange={setQuestionContent}
                        name="content_editor"
                        minLines={10} // Cấu hình tối thiểu 10 dòng
                        maxLines={Infinity}
                        style={{ width: '100%', height: '250px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        className="shadow-inner"
                    />
                    {/* Input ẩn để gửi dữ liệu */}
                    <input type="hidden" name="question" value={questionContent} />
                </div>

                {/* --- 2. ACE EDITOR CHO CÂU TRẢ LỜI --- */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="answer_editor" className="font-medium text-gray-700 dark:text-gray-300">Câu trả lời (Markdown/Code)</label>
                    <AceEditor
                        mode="markdown"
                        theme={editorTheme}
                        value={answerContent}
                        onChange={setAnswerContent}
                        name="answer_editor"
                        minLines={10} // Cấu hình tối thiểu 10 dòng
                        maxLines={Infinity}
                        style={{ width: '100%', height: '250px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        className="shadow-inner"
                    />
                    {/* Input ẩn để gửi dữ liệu */}
                    <input type="hidden" name="answer" value={answerContent} />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md mt-2"
                >
                    Lưu câu hỏi
                </button>
            </form>
        </div>
    );
}