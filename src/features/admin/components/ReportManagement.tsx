import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useAdminReports } from '../hooks/useAdminReports';
import { adminApi } from '../api/adminApi';
import type { ProcessReportRequest } from '../types/admin';

const statusConfig = {
  PENDING: { label: '대기중', variant: 'secondary' as const },
  APPROVED: { label: '승인', variant: 'default' as const },
  REJECTED: { label: '반려', variant: 'destructive' as const },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR');
}

export function ReportManagement() {
  const [status, setStatus] = useState<string>('');
  const [confirmAction, setConfirmAction] = useState<{
    reportId: number;
    action: ProcessReportRequest['action'];
  } | null>(null);
  const queryClient = useQueryClient();
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useAdminReports({
    status: status || undefined,
  });

  const { mutate: processReport, isPending: processing } = useMutation({
    mutationFn: ({ reportId, data }: { reportId: number; data: ProcessReportRequest }) =>
      adminApi.processReport(reportId, data),
    onSuccess: () => {
      setConfirmAction(null);
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      toast.success('신고가 처리되었습니다.');
    },
  });

  const handleAction = (reportId: number, action: ProcessReportRequest['action']) => {
    if (action === 'DELETE_POST' || action === 'SUSPEND_USER') {
      setConfirmAction({ reportId, action });
    } else {
      processReport({ reportId, data: { action } });
    }
  };

  const confirmLabels: Record<string, { title: string; description: string }> = {
    DELETE_POST: { title: '게시글 삭제', description: '해당 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.' },
    SUSPEND_USER: { title: '사용자 정지', description: '해당 사용자를 정지하시겠습니까?' },
  };

  const scrollRef = useInfiniteScroll(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  });

  const reports = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="space-y-4">
      {/* 필터 */}
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="상태" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="PENDING">대기중</SelectItem>
          <SelectItem value="APPROVED">승인</SelectItem>
          <SelectItem value="REJECTED">반려</SelectItem>
        </SelectContent>
      </Select>

      {/* 목록 */}
      {isLoading ? (
        <SkeletonLoader type="post-list" count={5} />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-[60px_60px_1fr_80px_80px_80px_160px] gap-2 border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
              <span>유형</span>
              <span>ID</span>
              <span>사유</span>
              <span>신고자</span>
              <span>상태</span>
              <span>날짜</span>
              <span>처리</span>
            </div>
            {reports.map((report) => {
              const cfg = statusConfig[report.status];
              return (
                <div
                  key={report.id}
                  className="grid grid-cols-[60px_60px_1fr_80px_80px_80px_160px] items-center gap-2 border-b px-4 py-2 text-sm last:border-b-0"
                >
                  <Badge variant="outline" className="w-fit">
                    {report.targetType === 'POST' ? '게시글' : '댓글'}
                  </Badge>
                  <span className="text-muted-foreground">#{report.targetId}</span>
                  <span className="truncate">{report.reason}</span>
                  <span className="truncate text-muted-foreground">{report.reporterNickname}</span>
                  <Badge variant={cfg.variant} className="w-fit">
                    {cfg.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(report.createdAt)}
                  </span>
                  <div className="flex gap-1">
                    {report.status === 'PENDING' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(report.id, 'DELETE_POST')}
                        >
                          삭제
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAction(report.id, 'SUSPEND_USER')}
                        >
                          정지
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAction(report.id, 'REJECT')}
                        >
                          반려
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {isFetchingNextPage && <SkeletonLoader type="post-list" count={2} />}
      <div ref={scrollRef} className="h-1" />

      {/* 파괴적 액션 확인 다이얼로그 */}
      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={(open) => { if (!open) setConfirmAction(null); }}
        title={confirmAction ? confirmLabels[confirmAction.action]?.title ?? '확인' : '확인'}
        description={confirmAction ? confirmLabels[confirmAction.action]?.description ?? '' : ''}
        confirmLabel="확인"
        variant="destructive"
        loading={processing}
        onConfirm={() => {
          if (confirmAction) {
            processReport({ reportId: confirmAction.reportId, data: { action: confirmAction.action } });
          }
        }}
      />
    </div>
  );
}
