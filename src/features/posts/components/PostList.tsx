import { FileText } from 'lucide-react';
import { PostListItem } from './PostListItem';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { EmptyState } from '@/components/common/EmptyState';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { PostListItem as PostListItemType } from '../types/post';
import type { CursorPageResponse } from '@/types/api';
import type { InfiniteData } from '@tanstack/react-query';

interface PostListProps {
  data: InfiniteData<CursorPageResponse<PostListItemType>> | undefined;
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function PostList({
  data,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: PostListProps) {
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
        title="게시글이 없습니다"
        description="첫 번째 글을 작성해보세요!"
      />
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostListItem key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <SkeletonLoader type="post-list" count={2} />}
      <div ref={scrollRef} className="h-1" />
    </div>
  );
}
