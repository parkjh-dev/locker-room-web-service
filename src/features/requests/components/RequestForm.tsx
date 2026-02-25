import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { applyFieldErrors } from '@/lib/formError';
import { useCreateRequest } from '../hooks/useCreateRequest';
import { requestSchema, type RequestFormData } from '../schemas/requestSchema';

const typeLabels = {
  SPORT: '종목 추가',
  TEAM: '구단 추가',
} as const;

export function RequestForm() {
  const navigate = useNavigate();
  const { mutateAsync } = useCreateRequest();

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: { type: undefined, name: '', reason: '' },
  });

  const onSubmit = async (data: RequestFormData) => {
    try {
      await mutateAsync(data);
      toast.success('요청이 등록되었습니다.');
      navigate('/requests');
    } catch (error) {
      applyFieldErrors(error, form.setError);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>요청 유형</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="유형을 선택해주세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(Object.entries(typeLabels) as [string, string][]).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>종목/구단 이름</FormLabel>
              <FormControl>
                <Input placeholder="추가를 원하는 종목 또는 구단 이름 (최대 100자)" {...field} />
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
              <FormLabel>요청 사유</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="요청 사유를 작성해주세요 (최대 1000자)"
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            등록
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/requests')}>
            취소
          </Button>
        </div>
      </form>
    </Form>
  );
}
