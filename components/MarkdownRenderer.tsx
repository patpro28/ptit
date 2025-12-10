// components/MarkdownRenderer.tsx

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { ComponentPropsWithoutRef } from "react";

// Định nghĩa props để nhận nội dung Markdown
interface MarkdownRendererProps {
    content: string;
    className?: string; // Cho phép truyền className tùy chỉnh
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    return (
        <div className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    // Custom render cho thẻ code (Code Highlighting)
                    code({ inline, className, children, ...props }: ComponentPropsWithoutRef<'code'> & { inline?: boolean }) {
                        const match = /language-(\w+)/.exec(className || "");

                        return !inline && match ? (
                            <SyntaxHighlighter
                                // FIX TYPING: Sử dụng 'as any' cho theme để tránh lỗi TypeScript
                                // do sự không tương thích giữa thư viện và môi trường TS strict
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                style={oneDark as any}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-lg text-sm shadow-sm border border-gray-700 my-0!"
                                {...props}
                            >
                                {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                        ) : (
                            // Code inline
                            <code className={`${className} bg-gray-100 text-pink-600 px-1 py-0.5 rounded font-mono text-sm`} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}