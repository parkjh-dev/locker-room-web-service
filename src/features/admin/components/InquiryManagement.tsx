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
import { useAdminInquiries } from '../hooks/useAdminInquiries';
import { adminApi } from '../api/adminApi';
import { answerInquirySchema, type AnswerInquiryFormData } from '../schemas/adminSchema';

const typeLabels = { GENERAL: '일반', BUG: '버그', SUGGESTION: '건의' } as const;
const statusConfig = {
  PENDING: { label: '대기중', variant: 'secondary' as const },
  ANSWERED: { label: '답변완료', variant: 'default' as const },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR');
}

export function InquiryManagement() {
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [answerId, setAnswerId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useAdminInquiries({
    status: status || undefined,
    type: type || undefined,
  });

  const form = useForm<AnswerInquiryFormData>({
    resolver: zodResolver(answerInquirySchema),
    defaultValues: { content: '' },
  });

  const { mutateAsync: answer, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AnswerInquiryFormData }) =>
      adminApi.answerInquiry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      toast.success('답변이 등록되었습니다.');
      setAnswerId(null);
      form.reset();
    },
  });

  const scrollRef = useInfiniteScroll(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  });

  const inquiries = data?.pages.flatMap((page) => page.items) ?? [];

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
            <SelectItem value="ANSWERED">답변완료</SelectItem>
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="유형" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="GENERAL">일반</SelectItem>
            <SelectItem value="BUG">버그</SelectItem>
            <SelectItem value="SUGGESTION">건의</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 목록 */}
      {isLoading ? (
        <SkeletonLoader type="post-list" count={5} />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-[60px_1fr_80px_80px_80px_80px] gap-2 border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
              <span>유형</span>
              <span>제목</span>
              <span>작성자</span>
              <span>상태</span>
              <span>날짜</span>
              <span>관리</span>
            </div>
            {inquiries.map((inquiry) => {
              const cfg = statusConfig[inquiry.status];
              return (
                <div
                  key={inquiry.id}
                  className="grid grid-cols-[60px_1fr_80px_80px_80px_80px] items-center gap-2 border-b px-4 py-2 text-sm last:border-b-0"
                >
                  <Badge variant="outline" className="w-fit">
                    {typeLabels[inquiry.type]}
                  </Badge>
                  <span className="truncate">{inquiry.title}</span>
                  <span className="truncate text-muted-foreground">{inquiry.nickname}</span>
                  <Badge variant={cfg.variant} className="w-fit">
                    {cfg.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(inquiry.createdAt)}
                  </span>
                  <div>
                    {inquiry.status === 'PENDING' && (
                      <Button size="sm" onClick={() => setAnswerId(inquiry.id)}>
                        답변
                      </Button>
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

      {/* 답변 다이얼로그 */}
      <Dialog open={!!answerId} onOpenChange={(open) => !open && setAnswerId(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>답변 작성</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) =>
                answerId ? answer({ id: answerId, data }) : undefined,
              )}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>답변 내용</FormLabel>
                    <FormControl>
                      <Textarea placeholder="답변을 입력해주세요" rows={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAnswerId(null)}>
                  취소
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? '처리 중...' : '등록'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
