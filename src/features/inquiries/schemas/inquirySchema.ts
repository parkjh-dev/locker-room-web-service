import { z } from 'zod';

export const inquirySchema = z.object({
  type: z.enum(['GENERAL', 'BUG', 'SUGGESTION'], {
    error: '문의 유형을 선택해주세요.',
  }),
  title: z.string().min(1, '제목을 입력해주세요.').max(200, '제목은 200자 이하여야 합니다.'),
  content: z.string().min(1, '내용을 입력해주세요.').max(5000, '내용은 5000자 이하여야 합니다.'),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;
