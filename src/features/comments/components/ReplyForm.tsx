import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { commentSchema, type CommentFormData } from '../schemas/commentSchema';

interface ReplyFormProps {
  onSubmit: (data: CommentFormData) => Promise<void>;
  onCancel: () => void;
  replyToNickname?: string;
}

export function ReplyForm({ onSubmit, onCancel, replyToNickname }: ReplyFormProps) {
  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: replyToNickname ? `@${replyToNickname} ` : '' },
  });

  const handleSubmit = async (data: CommentFormData) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-2 space-y-2">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder={
                    replyToNickname ? `@${replyToNickname}님에게 답글` : '답글을 입력하세요'
                  }
                  rows={2}
                  maxLength={1000}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            답글
          </Button>
        </div>
      </form>
    </Form>
  );
}
