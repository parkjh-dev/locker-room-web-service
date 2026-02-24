import { z } from 'zod';

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, '이메일을 입력해주세요.')
      .email('올바른 이메일 형식이 아닙니다.')
      .max(255, '이메일은 255자 이하여야 합니다.'),

    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다.')
      .max(20, '비밀번호는 20자 이하여야 합니다.')
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/, '영문, 숫자, 특수문자를 포함해야 합니다.'),

    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요.'),

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
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
