import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { PostForm } from '@/features/posts/components/PostForm';
import { usePostDetail } from '@/features/posts/hooks/usePostDetail';
import { useUpdatePost } from '@/features/posts/hooks/useUpdatePost';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import type { PostFormData } from '@/features/posts/schemas/postSchema';

export default function PostEditPage() {
  const { postId } = useParams<{ postId: string }>();
  const pid = Number(postId);
  const navigate = useNavigate();
  const { data: post, isLoading } = usePostDetail(pid);
  const { mutateAsync } = useUpdatePost(pid, post?.boardId);

  if (isLoading) {
    return <SkeletonLoader type="post-detail" />;
  }

  if (!post) return null;

  const handleSubmit = async (data: PostFormData, attachmentIds: number[]) => {
    await mutateAsync({ title: data.title, content: data.content, attachmentIds });
    toast.success('게시글이 수정되었습니다.');
    navigate(`/posts/${pid}`, { replace: true });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">글 수정</h1>
      <PostForm
        defaultValues={{
          boardId: post.boardId,
          title: post.title,
          content: post.content,
        }}
        defaultFiles={post.attachments}
        onSubmit={handleSubmit}
        submitLabel="수정"
        disableBoardSelect
      />
    </div>
  );
}
