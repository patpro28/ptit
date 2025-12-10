import AddQuestionForm from '@/components/AddQuestionForm'; // Đảm bảo đúng đường dẫn

// Đây là Server Component mặc định (khác với AddQuestionForm là Client Component)
export default function AddQuestionPage() {
    return (
        <div className="py-12">
            <h1 className="text-3xl font-bold text-center mb-6">Quản lý thêm câu hỏi</h1>
            <AddQuestionForm />
        </div>
    );
}