import { z } from 'zod';

export const commentSchema = z.object({
  content: z.string().min(1, '댓글을 입력해주세요.').max(1000, '댓글은 1,000자 이하여야 합니다.'),
});

export type CommentFormData = z.infer<typeof commentSchema>;
