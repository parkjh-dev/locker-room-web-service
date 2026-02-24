import { Link } from 'react-router-dom';
import { Pin, Eye, Megaphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { EmptyState } from '@/components/common/EmptyState';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { NoticeListItem } from '../types/notice';
import type { CursorPageResponse } from '@/types/api';
import type { InfiniteData } from '@tanstack/react-query';

interface NoticeListProps {
  data: InfiniteData<CursorPageResponse<NoticeListItem>> | undefined;
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function NoticeList({
  data,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: NoticeListProps) {
  const scrollRef = useInfiniteScroll(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  });

  if (isLoading) {
    return <SkeletonLoader type="post-list" count={5} />;
  }

  const notices = data?.pages.flatMap((page) => page.items) ?? [];

  if (notices.length === 0) {
    return <EmptyState icon={Megaphone} title="공지사항이 없습니다" />;
  }

  return (
    <div>
      {notices.map((notice) => (
        <Link
          key={notice.id}
          to={`/notices/${notice.id}`}
          className="flex items-center gap-3 border-b px-1 py-3 transition-colors hover:bg-accent/50"
        >
          {notice.isPinned && (
            <Badge variant="destructive" className="shrink-0 gap-1 text-xs">
              <Pin className="h-3 w-3" />
              고정
            </Badge>
          )}
          <h3 className="min-w-0 flex-1 truncate text-sm font-medium">{notice.title}</h3>
          <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Eye className="h-3 w-3" />
              {notice.viewCount}
            </span>
            <span>{formatDate(notice.createdAt)}</span>
          </div>
        </Link>
      ))}
      {isFetchingNextPage && <SkeletonLoader type="post-list" count={2} />}
      <div ref={scrollRef} className="h-1" />
    </div>
  );
}
