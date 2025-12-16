import { getQuestionById, updateQuestion } from "@/app/actions";
import QuestionForm from "@/components/QuestionForm";

export default async function EditPage(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params; // 👈 MUST AWAIT
    const numericId = Number(id);

    const q = await getQuestionById(numericId);

    if (!q) {
        return (
            <div className="p-10 text-center text-red-600">
                Không tìm thấy câu hỏi
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Chỉnh sửa câu hỏi #{numericId}</h1>

            <QuestionForm
                mode="edit"
                initialData={{
                    id: q.id,
                    question: q.question,
                    answer: q.correctAnswer,
                    categoryId: q.category,
                    options: q.options,
                }}
                onSubmit={updateQuestion}
            />
        </div>
    );
}