import { z } from 'zod';

export const editProfileSchema = z.object({
  nickname: z
    .string()
    .min(2, '닉네임은 2자 이상이어야 합니다.')
    .max(20, '닉네임은 20자 이하여야 합니다.')
    .regex(/^[가-힣a-zA-Z0-9]+$/, '특수문자는 사용할 수 없습니다.'),
  teams: z
    .array(z.object({ sportId: z.number(), teamId: z.number() }))
    .min(1, '최소 1개 종목의 응원팀을 선택해주세요.'),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요.'),
    newPassword: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다.')
      .max(20, '비밀번호는 20자 이하여야 합니다.')
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/, '영문, 숫자, 특수문자를 포함해야 합니다.'),
    newPasswordConfirm: z.string().min(1, '새 비밀번호 확인을 입력해주세요.'),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: '새 비밀번호가 일치하지 않습니다.',
    path: ['newPasswordConfirm'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const withdrawSchema = z.object({
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

export type WithdrawFormData = z.infer<typeof withdrawSchema>;
