import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { requestApi } from '../api/requestApi';
import type { RequestType, RequestStatus } from '../types/request';

const typeLabels: Record<RequestType, string> = {
  SPORT: '종목 추가',
  TEAM: '구단 추가',
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
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface RequestDetailProps {
  requestId: number;
}

export function RequestDetail({ requestId }: RequestDetailProps) {
  const { data: request, isLoading } = useQuery({
    queryKey: ['requests', requestId],
    queryFn: () => requestApi.getRequestDetail(requestId),
  });

  if (isLoading) {
    return <SkeletonLoader type="post-list" count={3} />;
  }

  if (!request) return null;

  const status = statusConfig[request.status];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{typeLabels[request.type]}</Badge>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        <h2 className="text-lg font-bold">{request.name}</h2>
        <p className="text-sm text-muted-foreground">{formatDate(request.createdAt)}</p>
      </div>

      <Separator />

      {/* 요청 사유 */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold">요청 사유</h3>
        <div className="whitespace-pre-wrap text-sm leading-relaxed">{request.reason}</div>
      </div>

      {/* 반려 사유 (REJECTED 시) */}
      {request.status === 'REJECTED' && request.rejectReason && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-destructive">반려 사유</h3>
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{request.rejectReason}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
