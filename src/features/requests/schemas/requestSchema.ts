import { z } from 'zod';

export const requestSchema = z.object({
  type: z.enum(['SPORT', 'TEAM'], {
    error: '요청 유형을 선택해주세요.',
  }),
  name: z.string().min(1, '이름을 입력해주세요.').max(100, '이름은 100자 이하여야 합니다.'),
  reason: z.string().min(1, '사유를 입력해주세요.').max(1000, '사유는 1000자 이하여야 합니다.'),
});

export type RequestFormData = z.infer<typeof requestSchema>;
