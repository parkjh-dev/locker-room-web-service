import { useParams } from 'react-router-dom';
import { PostDetail } from '@/features/posts/components/PostDetail';
import { usePostDetail } from '@/features/posts/hooks/usePostDetail';
import { CommentList } from '@/features/comments/components/CommentList';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { Separator } from '@/components/ui/separator';

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const pid = Number(postId);
  const { data: post, isLoading } = usePostDetail(pid);

  if (isLoading) {
    return <SkeletonLoader type="post-detail" />;
  }

  if (!post) return null;

  return (
    <div className="space-y-6">
      <PostDetail post={post} />
      <Separator />
      <CommentList postId={pid} commentCount={post.commentCount} />
    </div>
  );
}
