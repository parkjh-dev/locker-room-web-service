import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { commentSchema, type CommentFormData } from '../schemas/commentSchema';

interface CommentFormProps {
  onSubmit: (data: CommentFormData) => Promise<void>;
  placeholder?: string;
}

export function CommentForm({ onSubmit, placeholder = '댓글을 입력하세요' }: CommentFormProps) {
  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: '' },
  });

  const handleSubmit = async (data: CommentFormData) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder={placeholder} rows={3} maxLength={1000} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            등록
          </Button>
        </div>
      </form>
    </Form>
  );
}
