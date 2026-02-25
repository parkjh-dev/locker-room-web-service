import { useState } from 'react';
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
import { FileUpload } from '@/components/common/FileUpload';
import { applyFieldErrors } from '@/lib/formError';
import { useCreateInquiry } from '../hooks/useCreateInquiry';
import { inquirySchema, type InquiryFormData } from '../schemas/inquirySchema';

const typeLabels = {
  GENERAL: '일반 문의',
  BUG: '버그 신고',
  SUGGESTION: '건의사항',
} as const;

interface UploadedFile {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

export function InquiryForm() {
  const navigate = useNavigate();
  const { mutateAsync } = useCreateInquiry();
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const form = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { type: undefined, title: '', content: '' },
  });

  const onSubmit = async (data: InquiryFormData) => {
    try {
      await mutateAsync({
        ...data,
        attachmentIds: files.map((f) => f.id),
      });
      toast.success('문의가 등록되었습니다.');
      navigate('/inquiries');
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
              <FormLabel>문의 유형</FormLabel>
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>제목</FormLabel>
              <FormControl>
                <Input placeholder="제목을 입력해주세요 (최대 200자)" {...field} />
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
                <Textarea
                  placeholder="문의 내용을 자세히 작성해주세요 (최대 5000자)"
                  rows={8}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <p className="text-sm font-medium">첨부파일</p>
          <FileUpload value={files} onChange={setFiles} />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            등록
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/inquiries')}>
            취소
          </Button>
        </div>
      </form>
    </Form>
  );
}
