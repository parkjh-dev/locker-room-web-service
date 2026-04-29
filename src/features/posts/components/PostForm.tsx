import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { RichEditor } from '@/components/common/RichEditor';
import { PollEditor } from './PollEditor';
import { applyFieldErrors } from '@/lib/formError';
import { useBoards } from '@/features/boards/hooks/useBoards';
import {
  postSchema,
  POST_CATEGORIES,
  POST_CATEGORY_LABELS,
  type PostFormData,
} from '../schemas/postSchema';

interface PostFormProps {
  defaultValues?: Partial<PostFormData>;
  onSubmit: (data: PostFormData, fileIds: number[]) => Promise<void>;
  submitLabel: string;
  /** 수정 모드에서 게시판/말머리/투표 변경 불가 */
  disableBoardSelect?: boolean;
  /** 수정 모드에서 투표 편집 영역 숨김 (참여자 표 보호) */
  isEdit?: boolean;
}

export function PostForm({
  defaultValues,
  onSubmit,
  submitLabel,
  disableBoardSelect = false,
  isEdit = false,
}: PostFormProps) {
  const { data: boards } = useBoards();
  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      boardId: 0,
      category: 'GENERAL',
      title: '',
      content: '',
      poll: null,
      ...defaultValues,
    },
  });

  const handleSubmit = async (data: PostFormData) => {
    try {
      // 인라인 이미지는 본문 HTML 안에 들어가므로 별도 fileIds는 빈 배열
      await onSubmit(data, []);
    } catch (error) {
      applyFieldErrors(error, form.setError);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* 게시판 + 말머리 (한 줄) */}
        <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
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

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>말머리</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="말머리" />
                    </SelectTrigger>
                    <SelectContent>
                      {POST_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {POST_CATEGORY_LABELS[c]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                <RichEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="내용을 입력하세요. 이미지는 도구바·드래그·붙여넣기로 추가할 수 있어요."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 투표 (수정 모드에선 숨김) */}
        {!isEdit && (
          <FormField
            control={form.control}
            name="poll"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <PollEditor
                    value={field.value ?? null}
                    onChange={field.onChange}
                    errorMessage={fieldState.error?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

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
