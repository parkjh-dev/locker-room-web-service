import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Send } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { commentSchema, type CommentFormData } from '../schemas/commentSchema';

interface CommentFormProps {
  onSubmit: (data: CommentFormData) => Promise<void>;
  placeholder?: string;
}

const MAX_LEN = 1000;

export function CommentForm({
  onSubmit,
  placeholder = '라커룸에 의견을 남겨보세요',
}: CommentFormProps) {
  const { user } = useAuthStore();
  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: '' },
    mode: 'onTouched',
  });

  const content = form.watch('content');

  const handleSubmit = async (data: CommentFormData) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="rounded-2xl border border-brand-100/70 bg-card p-3 shadow-soft transition-shadow focus-within:shadow-elev sm:p-4"
      >
        <div className="flex gap-3">
          <Avatar className="hidden h-9 w-9 shrink-0 ring-1 ring-brand-100 sm:flex">
            <AvatarFallback className="text-xs font-bold">
              {user?.nickname?.charAt(0) ?? '?'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder={placeholder}
                      rows={3}
                      maxLength={MAX_LEN}
                      className="min-h-[72px] resize-none border-0 px-0 shadow-none focus-visible:ring-0 focus-visible:bg-transparent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                {content.length}/{MAX_LEN}
              </span>
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
                등록
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
