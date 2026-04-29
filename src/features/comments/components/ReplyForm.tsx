import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { EmailVerificationInline } from '@/components/common/EmailVerificationInline';
import { commentSchema, type CommentFormData } from '../schemas/commentSchema';

interface ReplyFormProps {
  onSubmit: (data: CommentFormData) => Promise<void>;
  onCancel: () => void;
  replyToNickname?: string;
}

export function ReplyForm({ onSubmit, onCancel, replyToNickname }: ReplyFormProps) {
  const user = useAuthStore((s) => s.user);
  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: replyToNickname ? `@${replyToNickname} ` : '' },
    mode: 'onTouched',
  });

  const content = form.watch('content');

  const handleSubmit = async (data: CommentFormData) => {
    await onSubmit(data);
    form.reset({ content: replyToNickname ? `@${replyToNickname} ` : '' });
  };

  if (user && !user.emailVerified) {
    return (
      <div className="space-y-2">
        <EmailVerificationInline action="답글" variant="reply" />
        <div className="flex justify-end">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            취소
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="rounded-xl border border-brand-100/70 bg-card p-3 shadow-xs"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder={
                    replyToNickname
                      ? `@${replyToNickname}님에게 답글 남기기...`
                      : '답글을 입력하세요'
                  }
                  rows={2}
                  maxLength={1000}
                  autoFocus
                  className="min-h-[60px] resize-none border-0 px-0 shadow-none focus-visible:ring-0 focus-visible:bg-transparent"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">{content.length}/1000</span>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              취소
            </Button>
            <Button
              type="submit"
              variant="brand"
              size="sm"
              disabled={form.formState.isSubmitting || !content.trim()}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-1 h-3.5 w-3.5" />
              )}
              답글
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
