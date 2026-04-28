import { Link } from 'react-router-dom';
import { Pin, Megaphone } from 'lucide-react';
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
    <div className="rounded-2xl border border-brand-100/70 bg-card px-2 shadow-soft sm:px-4">
      {notices.map((notice) => (
        <Link
          key={notice.id}
          to={`/notices/${notice.id}`}
          className="group flex items-center gap-3 border-b border-brand-100/60 px-2 py-3.5 transition-colors hover:bg-brand-50/40"
        >
          {notice.isPinned && (
            <Badge variant="brand" className="shrink-0">
              <Pin className="h-3 w-3" />
              고정
            </Badge>
          )}
          <h3 className="min-w-0 flex-1 truncate text-[15px] font-semibold tracking-tight transition-colors group-hover:text-brand-700">
            {notice.title}
          </h3>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatDate(notice.createdAt)}
          </span>
        </Link>
      ))}
      {isFetchingNextPage && (
        <div className="px-2 py-3">
          <SkeletonLoader type="post-list" count={2} />
        </div>
      )}
      <div ref={scrollRef} className="h-1" />
    </div>
  );
}
