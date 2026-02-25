import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { PostForm } from '@/features/posts/components/PostForm';
import { useCreatePost } from '@/features/posts/hooks/useCreatePost';
import type { PostFormData } from '@/features/posts/schemas/postSchema';

export default function PostCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultBoardId = Number(searchParams.get('boardId')) || 0;
  const { mutateAsync } = useCreatePost();

  const handleSubmit = async (data: PostFormData, fileIds: number[]) => {
    const result = await mutateAsync({ ...data, fileIds });
    toast.success('게시글이 작성되었습니다.');
    navigate(`/posts/${result.id}`, { replace: true });
  };

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
