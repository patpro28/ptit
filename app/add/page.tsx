import QuestionForm from "@/components/QuestionForm";
import { addQuestion } from "@/app/actions";

export default function AddPage() {
    return (
        <div className="max-w-3xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Thêm câu hỏi mới</h1>

            <QuestionForm
                mode="create"
                onSubmit={addQuestion}
            />
        </div>
    );
}