import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useWithdraw } from '../hooks/useWithdraw';
import { withdrawSchema, type WithdrawFormData } from '../schemas/profileSchema';

export function WithdrawForm() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutateAsync, isPending } = useWithdraw();

  const form = useForm<WithdrawFormData>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: { password: '', reason: '' },
  });

  const onSubmit = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    try {
      const reason = form.getValues('reason');
      await mutateAsync({
        password: form.getValues('password'),
        ...(reason && { reason }),
      });
    } catch (error: unknown) {
      setConfirmOpen(false);
      const err = error as { response?: { data?: { code?: string } } };
      if (err.response?.data?.code === 'USER_PASSWORD_MISMATCH') {
        form.setError('password', { message: '비밀번호가 일치하지 않습니다.' });
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">
              회원 탈퇴 시 작성한 게시글과 댓글은 삭제되지 않으며, 탈퇴 후 복구할 수 없습니다.
            </p>
          </div>

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>탈퇴 사유 (선택)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="탈퇴 사유를 알려주시면 서비스 개선에 참고하겠습니다."
                    rows={3}
                    maxLength={500}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호 확인</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="현재 비밀번호를 입력해주세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" variant="destructive" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            회원 탈퇴
          </Button>
        </form>
      </Form>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="정말 탈퇴하시겠습니까?"
        description="탈퇴 후에는 계정을 복구할 수 없습니다."
        confirmLabel="탈퇴"
        variant="destructive"
        loading={isPending}
        onConfirm={handleConfirm}
      />
    </>
  );
}
