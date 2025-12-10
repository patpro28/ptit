"use client";

import { useState } from "react";
import { CATEGORIES as categoriesList } from "@/lib/categories";
import { getQuestionsByCategory } from "./actions";

// IMPORT COMPONENT MỚI
import MarkdownRenderer from "@/components/MarkdownRenderer";

// 2. IMPORT CSS CHO MATH (KATEX) - Vẫn cần giữ
import "katex/dist/katex.min.css";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  categoryName?: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectCategory = async (catId: string) => {
    setSelectedCategoryId(catId);
    if (catId === 'all') {
      setQuestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await getQuestionsByCategory(catId);
      const catName = categoriesList.find(c => c.value === catId)?.label;
      const enrichedData = data.map(q => ({ ...q, categoryName: catName }));
      setQuestions(enrichedData);
    } catch (error) {
      console.error("Lỗi fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredQuestions = questions.filter(q =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Tra Cứu: Code & Toán Học 🧮
        </h1>

        {/* --- KHU VỰC ĐIỀU KHIỂN --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 space-y-6">
          <div>
            <p className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
              Chọn chủ đề:
            </p>
            <div className="flex flex-wrap gap-2">
              {categoriesList.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleSelectCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${selectedCategoryId === cat.value
                    ? "bg-blue-700 text-white border-blue-700 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {questions.length > 0 && (
            <input
              type="text"
              className="block w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium placeholder:text-gray-400"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
        </div>

        {/* --- HIỂN THỊ --- */}
        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            <p className="mt-2 text-gray-700 font-medium">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredQuestions.map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center rounded-xl">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-1 rounded">
                    {item.categoryName}
                  </span>
                  <span className="text-gray-500 font-mono text-xs font-bold">#{item.id}</span>
                </div>

                <div className="p-6">
                  {/* --- SỬ DỤNG MARKDOWN RENDERER CHO CÂU HỎI --- */}
                  <div className="mb-4 text-gray-900">
                    <MarkdownRenderer
                      content={item.question}
                      className="prose prose-sm max-w-none prose-p:font-semibold prose-pre:bg-transparent prose-pre:p-0"
                    />
                  </div>

                  <div className="space-y-2">
                    {item.options.map((opt, i) => {
                      const isCorrect = opt === item.correctAnswer;
                      return (
                        <div
                          key={i}
                          className={`p-3 rounded-lg border text-sm font-medium flex items-start ${isCorrect
                            ? 'bg-green-50 border-green-300 text-green-900'
                            : 'bg-white border-gray-200 text-gray-700'
                            }`}
                        >
                          {isCorrect ? (
                            <span className="mr-2 text-green-700 text-base mt-0.5 w-4">✓</span>
                          ) : (
                            <span className="mr-2 text-gray-400 text-base mt-0.5 w-4">•</span>
                          )}
                          {/* --- SỬ DỤNG MARKDOWN RENDERER CHO ĐÁP ÁN --- */}
                          <div className='flex-1'>
                            <MarkdownRenderer
                              content={opt}
                              // Áp dụng class để tránh xung đột với các thẻ p, pre mặc định
                              className="prose prose-sm max-w-none prose-p:m-0 prose-pre:m-0 prose-pre:p-0"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}