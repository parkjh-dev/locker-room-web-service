import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { PostForm } from '@/features/posts/components/PostForm';
import { useCreatePost } from '@/features/posts/hooks/useCreatePost';
import { EmailVerificationRequired } from '@/components/common/EmailVerificationRequired';
import { useAuthStore } from '@/features/auth/stores/authStore';
import type { PostFormData } from '@/features/posts/schemas/postSchema';

export default function PostCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultBoardId = Number(searchParams.get('boardId')) || 0;
  const { mutateAsync } = useCreatePost();
  const user = useAuthStore((s) => s.user);

  const handleSubmit = async (data: PostFormData, fileIds: number[]) => {
    const result = await mutateAsync({
      boardId: data.boardId,
      title: data.title,
      content: data.content,
      category: data.category,
      fileIds,
      poll: data.poll
        ? {
            question: data.poll.question?.trim() || null,
            options: data.poll.options.map((s) => s.trim()),
            expiresAt: data.poll.expiresAt,
          }
        : null,
    });
    toast.success('게시글이 작성되었습니다.');
    navigate(`/posts/${result.id}`, { replace: true });
  };

  if (user && !user.emailVerified) {
    return <EmailVerificationRequired action="글쓰기" />;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">글쓰기</h1>
      <PostForm
        defaultValues={defaultBoardId ? { boardId: defaultBoardId } : undefined}
        onSubmit={handleSubmit}
        submitLabel="작성"
      />
    </div>
  );
}
