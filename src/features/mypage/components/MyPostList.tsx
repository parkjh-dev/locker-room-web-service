import { Link } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Eye, Heart, FileText } from 'lucide-react';
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

export function MyPostList() {
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['users', 'me', 'posts'],
    queryFn: ({ pageParam }) => userApi.getMyPosts({ cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasNext ? (last.nextCursor ?? undefined) : undefined),
  });

  const scrollRef = useInfiniteScroll(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  });

  if (isLoading) {
    return <SkeletonLoader type="post-list" count={5} />;
  }

  const posts = data?.pages.flatMap((page) => page.items) ?? [];

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="작성한 글이 없습니다"
        description="첫 번째 글을 작성해보세요!"
      />
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <Link
          key={post.id}
          to={`/posts/${post.id}`}
          className="flex flex-col gap-1.5 border-b px-1 py-3 transition-colors hover:bg-accent/50"
        >
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-xs text-muted-foreground">{post.boardName}</span>
            <h3 className="min-w-0 flex-1 truncate text-sm font-medium">{post.title}</h3>
            {post.commentCount > 0 && (
              <span className="shrink-0 text-xs font-medium text-primary">
                [{post.commentCount}]
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{formatDate(post.createdAt)}</span>
            <span className="flex items-center gap-0.5">
              <Eye className="h-3 w-3" />
              {post.viewCount}
            </span>
            <span className="flex items-center gap-0.5">
              <Heart className="h-3 w-3" />
              {post.likeCount}
            </span>
          </div>
        </Link>
      ))}
      {isFetchingNextPage && <SkeletonLoader type="post-list" count={2} />}
      <div ref={scrollRef} className="h-1" />
    </div>
  );
}
