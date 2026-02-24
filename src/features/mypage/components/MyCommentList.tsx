import { Link } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MessageSquare } from 'lucide-react';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { EmptyState } from '@/components/common/EmptyState';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { userApi } from '../api/userApi';

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);

  if (diffMin < 1) return '방금';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  return date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
}

export function MyCommentList() {
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['users', 'me', 'comments'],
    queryFn: ({ pageParam }) => userApi.getMyComments({ cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasNext ? (last.nextCursor ?? undefined) : undefined),
  });

  const scrollRef = useInfiniteScroll(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  });

  if (isLoading) {
    return <SkeletonLoader type="post-list" count={5} />;
  }

  const comments = data?.pages.flatMap((page) => page.items) ?? [];

  if (comments.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="작성한 댓글이 없습니다"
        description="게시글에 댓글을 남겨보세요!"
      />
    );
  }

  return (
    <div>
      {comments.map((comment) => (
        <Link
          key={comment.id}
          to={`/posts/${comment.postId}`}
          className="flex flex-col gap-1 border-b px-1 py-3 transition-colors hover:bg-accent/50"
        >
          <p className="truncate text-sm">{comment.content}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="truncate">{comment.postTitle}</span>
            <span className="shrink-0">{formatDate(comment.createdAt)}</span>
          </div>
        </Link>
      ))}
      {isFetchingNextPage && <SkeletonLoader type="post-list" count={2} />}
      <div ref={scrollRef} className="h-1" />
    </div>
  );
}
