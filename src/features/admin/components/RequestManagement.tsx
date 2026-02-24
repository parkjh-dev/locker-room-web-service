import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useAdminRequests } from '../hooks/useAdminRequests';
import { adminApi } from '../api/adminApi';
import { rejectRequestSchema, type RejectRequestFormData } from '../schemas/adminSchema';

const typeLabels = { SPORT: '종목', TEAM: '구단' } as const;
const statusConfig = {
  PENDING: { label: '대기중', variant: 'secondary' as const },
  APPROVED: { label: '승인', variant: 'default' as const },
  REJECTED: { label: '반려', variant: 'destructive' as const },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR');
}

export function RequestManagement() {
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [rejectId, setRejectId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useAdminRequests({
    status: status || undefined,
    type: type || undefined,
  });

  const form = useForm<RejectRequestFormData>({
    resolver: zodResolver(rejectRequestSchema),
    defaultValues: { rejectReason: '' },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'requests'] });
    queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
  };

  const { mutate: approve } = useMutation({
    mutationFn: (requestId: number) => adminApi.processRequest(requestId, { action: 'APPROVE' }),
    onSuccess: () => {
      invalidate();
      toast.success('요청이 승인되었습니다.');
    },
  });

  const { mutateAsync: reject, isPending: isRejecting } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: RejectRequestFormData }) =>
      adminApi.processRequest(id, { action: 'REJECT', rejectReason: data.rejectReason }),
    onSuccess: () => {
      invalidate();
      toast.success('요청이 반려되었습니다.');
      setRejectId(null);
      form.reset();
    },
  });

  const scrollRef = useInfiniteScroll(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  });

  const requests = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="space-y-4">
      {/* 필터 */}
      <div className="flex gap-2">
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
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="유형" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="SPORT">종목</SelectItem>
            <SelectItem value="TEAM">구단</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 목록 */}
      {isLoading ? (
        <SkeletonLoader type="post-list" count={5} />
      ) : (
        <div className="rounded-lg border">
          <div className="grid grid-cols-[60px_1fr_80px_80px_80px_140px] gap-2 border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
            <span>유형</span>
            <span>이름</span>
            <span>요청자</span>
            <span>상태</span>
            <span>날짜</span>
            <span>처리</span>
          </div>
          {requests.map((req) => {
            const cfg = statusConfig[req.status];
            return (
              <div
                key={req.id}
                className="grid grid-cols-[60px_1fr_80px_80px_80px_140px] items-center gap-2 border-b px-4 py-2 text-sm last:border-b-0"
              >
                <Badge variant="outline" className="w-fit">
                  {typeLabels[req.type]}
                </Badge>
                <span className="truncate">{req.name}</span>
                <span className="truncate text-muted-foreground">{req.nickname}</span>
                <Badge variant={cfg.variant} className="w-fit">
                  {cfg.label}
                </Badge>
                <span className="text-xs text-muted-foreground">{formatDate(req.createdAt)}</span>
                <div className="flex gap-1">
                  {req.status === 'PENDING' && (
                    <>
                      <Button size="sm" onClick={() => approve(req.id)}>
                        승인
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setRejectId(req.id)}>
                        반려
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {isFetchingNextPage && <SkeletonLoader type="post-list" count={2} />}
      <div ref={scrollRef} className="h-1" />

      {/* 반려 사유 다이얼로그 */}
      <Dialog open={!!rejectId} onOpenChange={(open) => !open && setRejectId(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>반려 사유</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) =>
                rejectId ? reject({ id: rejectId, data }) : undefined,
              )}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="rejectReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>사유</FormLabel>
                    <FormControl>
                      <Textarea placeholder="반려 사유를 입력해주세요" rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setRejectId(null)}>
                  취소
                </Button>
                <Button type="submit" variant="destructive" disabled={isRejecting}>
                  {isRejecting ? '처리 중...' : '반려'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
