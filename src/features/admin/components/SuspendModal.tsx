import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { adminApi } from '../api/adminApi';
import { suspendUserSchema, type SuspendUserFormData } from '../schemas/adminSchema';

interface SuspendModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
  nickname: string;
}

export function SuspendModal({ open, onOpenChange, userId, nickname }: SuspendModalProps) {
  const queryClient = useQueryClient();
  const form = useForm<SuspendUserFormData>({
    resolver: zodResolver(suspendUserSchema),
    defaultValues: { reason: '', days: 7 },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: SuspendUserFormData) => {
      const until = new Date();
      until.setDate(until.getDate() + data.days);
      return adminApi.suspendUser(userId, {
        reason: data.reason,
        suspendedUntil: until.toISOString().replace('Z', ''),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success(`${nickname} 회원이 정지되었습니다.`);
      onOpenChange(false);
      form.reset();
    },
  });

  const onSubmit = async (data: SuspendUserFormData) => {
    await mutateAsync(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>회원 정지 - {nickname}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>정지 기간 (일)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={365}
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>정지 사유</FormLabel>
                  <FormControl>
                    <Textarea placeholder="정지 사유를 입력해주세요" rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                취소
              </Button>
              <Button type="submit" variant="destructive" disabled={isPending}>
                {isPending ? '처리 중...' : '정지'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
