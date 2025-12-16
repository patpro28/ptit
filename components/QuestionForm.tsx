'use client';

import { useRef, useState } from 'react';
import AceEditor from 'react-ace';
import { CATEGORIES } from '@/lib/categories';

import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/ext-language_tools';

interface Props {
    mode: 'create' | 'edit';
    initialData?: {
        id: number;
        question: string;
        answer: string;
        categoryId: string;
        options: string[];
    };
    onSubmit: (fd: FormData) => Promise<{ success: boolean; message: string }>;
}

export default function QuestionForm({ mode, initialData, onSubmit }: Props) {
    const formRef = useRef<HTMLFormElement>(null);

    const [questionContent, setQuestionContent] = useState(initialData?.question ?? "");
    const [answerContent, setAnswerContent] = useState(initialData?.answer ?? "");
    const [selectedCat, setSelectedCat] = useState(initialData?.categoryId ?? "");

    const editorTheme = "dracula";

    const handleSubmit = async () => {
        const fd = new FormData(formRef.current!);
        fd.set("question", questionContent);
        fd.set("answer", answerContent);
        fd.set("categoryId", selectedCat);

        if (initialData?.id) fd.set("id", String(initialData.id));

        const result = await onSubmit(fd);

        if (result.success) {
            alert(result.message);

            if (mode === "create") {
                formRef.current?.reset();
                setQuestionContent("");
                setAnswerContent("");
                setSelectedCat("");
            }
        } else {
            alert("Lỗi: " + result.message);
        }
    };

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-neutral-800">
            <form
                ref={formRef}
                action={handleSubmit}
                className="flex flex-col gap-7"
            >

                {/* TITLE */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {mode === "create" ? "📝 Thêm câu hỏi mới" : "✏️ Chỉnh sửa câu hỏi"}
                </h2>

                {/* CATEGORY */}
                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700 dark:text-gray-300">
                        Chọn chủ đề
                    </label>

                    <select
                        name="categoryId"
                        value={selectedCat}
                        onChange={(e) => setSelectedCat(e.target.value)}
                        required
                        className="p-3 rounded-lg bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="" disabled>-- Chọn một chủ đề --</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* QUESTION EDITOR */}
                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700 dark:text-gray-300">
                        Nội dung câu hỏi
                    </label>

                    <div className="rounded-lg border border-gray-300 dark:border-neutral-700 overflow-hidden shadow-inner bg-neutral-50 dark:bg-neutral-800">
                        <AceEditor
                            mode="markdown"
                            theme={editorTheme}
                            value={questionContent}
                            onChange={setQuestionContent}
                            minLines={12}
                            maxLines={Infinity}
                            width="100%"
                            fontSize={14}
                            showPrintMargin={false}
                        />
                    </div>

                    <input type="hidden" name="question" value={questionContent} />
                </div>

                {/* ANSWER EDITOR */}
                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700 dark:text-gray-300">
                        Đáp án đúng
                    </label>

                    <div className="rounded-lg border border-gray-300 dark:border-neutral-700 overflow-hidden shadow-inner bg-neutral-50 dark:bg-neutral-800">
                        <AceEditor
                            mode="markdown"
                            theme={editorTheme}
                            value={answerContent}
                            onChange={setAnswerContent}
                            minLines={10}
                            maxLines={Infinity}
                            width="100%"
                            fontSize={14}
                            showPrintMargin={false}
                        />
                    </div>

                    <input type="hidden" name="answer" value={answerContent} />
                </div>

                {/* SUBMIT BUTTON */}
                <button
                    type="submit"
                    className="w-full py-3 font-semibold text-white rounded-lg bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 transition-all"
                >
                    {mode === 'create' ? "📌 Lưu câu hỏi" : "💾 Cập nhật câu hỏi"}
                </button>
            </form>
        </div>
    );
}