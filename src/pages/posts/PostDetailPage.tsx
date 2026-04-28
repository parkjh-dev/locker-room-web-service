import { useParams } from 'react-router-dom';
import { PostDetail } from '@/features/posts/components/PostDetail';
import { usePostDetail } from '@/features/posts/hooks/usePostDetail';
import { CommentList } from '@/features/comments/components/CommentList';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const pid = Number(postId);
  const { data: post, isLoading } = usePostDetail(pid);

  if (isLoading) {
    return <SkeletonLoader type="post-detail" />;
  }

  if (!post) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PostDetail post={post} />
      <section className="rounded-2xl border border-brand-100/70 bg-card p-5 shadow-soft sm:p-6">
        <CommentList postId={pid} commentCount={post.commentCount} />
      </section>
    </div>
  );
}
