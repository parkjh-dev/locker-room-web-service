import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Pin, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useAdminNotices } from '../hooks/useAdminNotices';
import { adminApi } from '../api/adminApi';
import { adminNoticeSchema, type AdminNoticeFormData } from '../schemas/adminSchema';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR');
}

export function NoticeManagement() {
  const queryClient = useQueryClient();
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useAdminNotices();
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const form = useForm<AdminNoticeFormData>({
    resolver: zodResolver(adminNoticeSchema),
    defaultValues: { title: '', content: '', isPinned: false, boardIds: [] },
  });

  const { mutateAsync: createNotice, isPending: isCreating } = useMutation({
    mutationFn: (data: AdminNoticeFormData) => adminApi.createNotice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notices'] });
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      toast.success('공지가 등록되었습니다.');
      closeForm();
    },
  });

  const { mutateAsync: updateNotice, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AdminNoticeFormData }) =>
      adminApi.updateNotice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notices'] });
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      toast.success('공지가 수정되었습니다.');
      closeForm();
    },
  });

  const { mutate: deleteNotice, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => adminApi.deleteNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notices'] });
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      toast.success('공지가 삭제되었습니다.');
      setDeleteId(null);
    },
  });

  const closeForm = () => {
    setFormOpen(false);
    setEditId(null);
    form.reset();
  };

  const openCreate = () => {
    form.reset({ title: '', content: '', isPinned: false, boardIds: [] });
    setEditId(null);
    setFormOpen(true);
  };

  const onSubmit = async (data: AdminNoticeFormData) => {
    if (editId) {
      await updateNotice({ id: editId, data });
    } else {
      await createNotice(data);
    }
  };

  const scrollRef = useInfiniteScroll(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  });

  const notices = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" />
          공지 작성
        </Button>
      </div>

      {isLoading ? (
        <SkeletonLoader type="post-list" count={5} />
      ) : (
        <div className="rounded-lg border">
          <div className="grid grid-cols-[1fr_60px_80px_80px_100px] gap-2 border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
            <span>제목</span>
            <span>고정</span>
            <span>조회</span>
            <span>날짜</span>
            <span>관리</span>
          </div>
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="grid grid-cols-[1fr_60px_80px_80px_100px] items-center gap-2 border-b px-4 py-2 text-sm last:border-b-0"
            >
              <span className="truncate">{notice.title}</span>
              <span>
                {notice.isPinned && (
                  <Badge variant="secondary" className="gap-1">
                    <Pin className="h-3 w-3" />
                    고정
                  </Badge>
                )}
              </span>
              <span className="text-muted-foreground">{notice.viewCount}</span>
              <span className="text-xs text-muted-foreground">{formatDate(notice.createdAt)}</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => {
                    setEditId(notice.id);
                    form.reset({
                      title: notice.title,
                      content: '',
                      isPinned: notice.isPinned,
                      boardIds: [],
                    });
                    setFormOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={() => setDeleteId(notice.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {isFetchingNextPage && <SkeletonLoader type="post-list" count={2} />}
      <div ref={scrollRef} className="h-1" />

      {/* 작성/수정 다이얼로그 */}
      <Dialog open={formOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editId ? '공지 수정' : '공지 작성'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>제목</FormLabel>
                    <FormControl>
                      <Input placeholder="공지 제목" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>내용</FormLabel>
                    <FormControl>
                      <Textarea placeholder="공지 내용" rows={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPinned"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">상단 고정</FormLabel>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeForm}>
                  취소
                </Button>
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {isCreating || isUpdating ? '처리 중...' : editId ? '수정' : '등록'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="공지를 삭제하시겠습니까?"
        description="삭제된 공지는 복구할 수 없습니다."
        confirmLabel="삭제"
        variant="destructive"
        loading={isDeleting}
        onConfirm={() => deleteId && deleteNotice(deleteId)}
      />
    </div>
  );
}
