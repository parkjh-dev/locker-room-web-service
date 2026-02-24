import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';
import { useComments } from '../hooks/useComments';
import { useCreateComment } from '../hooks/useCreateComment';
import type { CommentFormData } from '../schemas/commentSchema';

interface CommentListProps {
  postId: number;
  commentCount: number;
}

export function CommentList({ postId, commentCount }: CommentListProps) {
  const { isAuthenticated } = useAuthStore();
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useComments(postId);
  const { mutateAsync: createComment } = useCreateComment(postId);

  const scrollRef = useInfiniteScroll(fetchNextPage, {
    enabled: (hasNextPage ?? false) && !isFetchingNextPage,
  });

  const handleCreateComment = async (formData: CommentFormData) => {
    await createComment(formData);
    toast.success('댓글이 등록되었습니다.');
  };

  const comments = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h2 className="font-bold">댓글 {commentCount}개</h2>
      </div>

      {/* 댓글 입력 */}
      {isAuthenticated && <CommentForm onSubmit={handleCreateComment} />}

      <Separator />

      {/* 댓글 목록 */}
      {isLoading ? (
        <SkeletonLoader type="list" count={3} />
      ) : (
        <div className="divide-y">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} />
          ))}
        </div>
      )}

      {isFetchingNextPage && <SkeletonLoader type="list" count={2} />}
      <div ref={scrollRef} className="h-1" />
    </div>
  );
}
