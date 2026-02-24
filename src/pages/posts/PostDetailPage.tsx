import { useParams } from 'react-router-dom';
import { PostDetail } from '@/features/posts/components/PostDetail';
import { usePostDetail } from '@/features/posts/hooks/usePostDetail';
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

      {/* Phase 8에서 CommentList 통합 예정 */}
      <div className="text-sm text-muted-foreground">댓글 영역 (Phase 8에서 구현 예정)</div>
    </div>
  );
}
