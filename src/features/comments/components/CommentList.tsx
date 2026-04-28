import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
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
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-700">
          <MessageSquare className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-base font-bold tracking-tight">
            댓글 <span className="text-brand-700">{commentCount}</span>개
          </h2>
          <p className="text-xs text-muted-foreground">
            라커룸 멤버들과 자유롭게 의견을 나눠보세요.
          </p>
        </div>
      </div>

      {/* 댓글 입력 */}
      {isAuthenticated ? (
        <CommentForm onSubmit={handleCreateComment} />
      ) : (
        <div className="rounded-xl border border-dashed border-brand-200 bg-brand-50/40 px-4 py-3 text-center text-sm text-muted-foreground">
          댓글을 남기려면{' '}
          <a href="/auth/login" className="font-semibold text-brand-700 hover:underline">
            로그인
          </a>
          이 필요해요.
        </div>
      )}

      {/* 댓글 목록 */}
      {isLoading ? (
        <SkeletonLoader type="list" count={3} />
      ) : comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-brand-200 bg-brand-50/30 py-10 text-center">
          <MessageSquare className="h-8 w-8 text-brand-400" />
          <p className="text-sm font-semibold">첫 댓글의 주인공이 되어보세요</p>
          <p className="text-xs text-muted-foreground">의견 하나가 라커룸을 살아 숨쉬게 합니다.</p>
        </div>
      ) : (
        <ul className="space-y-1">
          {comments.map((comment) => (
            <li key={comment.id}>
              <CommentItem comment={comment} postId={postId} />
            </li>
          ))}
        </ul>
      )}

      {isFetchingNextPage && <SkeletonLoader type="list" count={2} />}
      <div ref={scrollRef} className="h-1" />
    </div>
  );
}
