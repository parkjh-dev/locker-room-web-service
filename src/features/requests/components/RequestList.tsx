import { Link } from 'react-router-dom';
import { ListPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { EmptyState } from '@/components/common/EmptyState';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useRequests } from '../hooks/useRequests';
import type { RequestType, RequestStatus } from '../types/request';

const typeLabels: Record<RequestType, string> = {
  SPORT: '종목',
  TEAM: '구단',
};

const statusConfig: Record<
  RequestStatus,
  { label: string; variant: 'secondary' | 'default' | 'destructive' }
> = {
  PENDING: { label: '대기중', variant: 'secondary' },
  APPROVED: { label: '승인', variant: 'default' },
  REJECTED: { label: '반려', variant: 'destructive' },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function RequestList() {
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useRequests();

  const scrollRef = useInfiniteScroll(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  });

  if (isLoading) {
    return <SkeletonLoader type="post-list" count={5} />;
  }

  const requests = data?.pages.flatMap((page) => page.items) ?? [];

  if (requests.length === 0) {
    return (
      <EmptyState
        icon={ListPlus}
        title="요청 내역이 없습니다"
        description="종목이나 구단 추가를 요청해보세요!"
      />
    );
  }

  return (
    <div>
      {requests.map((req) => {
        const status = statusConfig[req.status];
        return (
          <Link
            key={req.id}
            to={`/requests/${req.id}`}
            className="flex items-center gap-3 border-b px-1 py-3 transition-colors hover:bg-accent/50"
          >
            <Badge variant="outline" className="shrink-0">
              {typeLabels[req.type]}
            </Badge>
            <span className="min-w-0 flex-1 truncate text-sm">{req.name}</span>
            <Badge variant={status.variant} className="shrink-0">
              {status.label}
            </Badge>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatDate(req.createdAt)}
            </span>
          </Link>
        );
      })}
      {isFetchingNextPage && <SkeletonLoader type="post-list" count={2} />}
      <div ref={scrollRef} className="h-1" />
    </div>
  );
}
