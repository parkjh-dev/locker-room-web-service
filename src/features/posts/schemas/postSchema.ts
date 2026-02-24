import { z } from 'zod';

export const postSchema = z.object({
  boardId: z.number({ error: '게시판을 선택해주세요.' }).min(1, '게시판을 선택해주세요.'),
  title: z.string().min(1, '제목을 입력해주세요.').max(200, '제목은 200자 이하여야 합니다.'),
  content: z.string().min(1, '내용을 입력해주세요.').max(10000, '내용은 10,000자 이하여야 합니다.'),
});

export type PostFormData = z.infer<typeof postSchema>;
