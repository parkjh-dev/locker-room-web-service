import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useBoards } from '@/features/boards/hooks/useBoards';
import { postSchema, type PostFormData } from '../schemas/postSchema';

interface UploadedFile {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

interface PostFormProps {
  defaultValues?: Partial<PostFormData>;
  defaultFiles?: UploadedFile[];
  onSubmit: (data: PostFormData, attachmentIds: number[]) => Promise<void>;
  submitLabel: string;
  /** 수정 모드에서 게시판 변경 불가 */
  disableBoardSelect?: boolean;
}

export function PostForm({
  defaultValues,
  defaultFiles = [],
  onSubmit,
  submitLabel,
  disableBoardSelect = false,
}: PostFormProps) {
  const { data: boards } = useBoards();
  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      boardId: 0,
      title: '',
      content: '',
      ...defaultValues,
    },
  });

  const [files, setFiles] = useState<UploadedFile[]>(defaultFiles);

  const handleSubmit = async (data: PostFormData) => {
    await onSubmit(
      data,
      files.map((f) => f.id),
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* 게시판 선택 */}
        <FormField
          control={form.control}
          name="boardId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>게시판</FormLabel>
              <FormControl>
                <Select
                  value={field.value ? field.value.toString() : ''}
                  onValueChange={(v) => field.onChange(Number(v))}
                  disabled={disableBoardSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="게시판을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {boards?.map((board) => (
                      <SelectItem key={board.id} value={board.id.toString()}>
                        {board.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 제목 */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>제목</FormLabel>
              <FormControl>
                <Input placeholder="제목을 입력하세요" maxLength={200} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 내용 */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>내용</FormLabel>
              <FormControl>
                <Textarea placeholder="내용을 입력하세요" rows={12} maxLength={10000} {...field} />
              </FormControl>
              <div className="flex justify-between">
                <FormMessage />
                <span className="text-xs text-muted-foreground">{field.value.length}/10,000</span>
              </div>
            </FormItem>
          )}
        />

        {/* 파일 첨부 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">파일 첨부</label>
          <FileUpload value={files} onChange={setFiles} />
        </div>

        {/* 제출 */}
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
