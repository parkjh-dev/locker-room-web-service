import { z } from 'zod';

export const profileCompleteSchema = z.object({
  nickname: z
    .string()
    .min(2, '닉네임은 2자 이상이어야 합니다.')
    .max(20, '닉네임은 20자 이하여야 합니다.')
    .regex(/^[가-힣a-zA-Z0-9]+$/, '특수문자는 사용할 수 없습니다.'),

  teams: z
    .array(
      z.object({
        sportId: z.number(),
        teamId: z.number(),
      }),
    )
    .min(1, '최소 1개 종목의 응원팀을 선택해주세요.'),
});

export type ProfileCompleteFormData = z.infer<typeof profileCompleteSchema>;
