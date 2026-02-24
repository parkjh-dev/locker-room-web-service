import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { EmptyState } from '@/components/common/EmptyState';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useInquiries } from '../hooks/useInquiries';
import type { InquiryType, InquiryStatus } from '../types/inquiry';

const typeLabels: Record<InquiryType, string> = {
  GENERAL: '일반',
  BUG: '버그',
  SUGGESTION: '건의',
};

const statusConfig: Record<InquiryStatus, { label: string; variant: 'secondary' | 'default' }> = {
  PENDING: { label: '대기중', variant: 'secondary' },
  ANSWERED: { label: '답변완료', variant: 'default' },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function InquiryList() {
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useInquiries();

  const scrollRef = useInfiniteScroll(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  });

  if (isLoading) {
    return <SkeletonLoader type="post-list" count={5} />;
  }

  const inquiries = data?.pages.flatMap((page) => page.items) ?? [];

  if (inquiries.length === 0) {
    return (
      <EmptyState
        icon={HelpCircle}
        title="문의 내역이 없습니다"
        description="궁금한 점이 있으면 문의해주세요!"
      />
    );
  }

  return (
    <div>
      {inquiries.map((inquiry) => {
        const status = statusConfig[inquiry.status];
        return (
          <Link
            key={inquiry.id}
            to={`/inquiries/${inquiry.id}`}
            className="flex items-center gap-3 border-b px-1 py-3 transition-colors hover:bg-accent/50"
          >
            <Badge variant="outline" className="shrink-0">
              {typeLabels[inquiry.type]}
            </Badge>
            <span className="min-w-0 flex-1 truncate text-sm">{inquiry.title}</span>
            <Badge variant={status.variant} className="shrink-0">
              {status.label}
            </Badge>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatDate(inquiry.createdAt)}
            </span>
          </Link>
        );
      })}
      {isFetchingNextPage && <SkeletonLoader type="post-list" count={2} />}
      <div ref={scrollRef} className="h-1" />
    </div>
  );
}
