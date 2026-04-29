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

    phone: z
      .string()
      .min(1, '휴대폰 번호를 입력해주세요.')
      .regex(/^01[0-9]{8,9}$/, '올바른 휴대폰 번호를 입력해주세요. (- 없이 숫자만)'),

    phoneVerified: z.boolean().refine((v) => v === true, {
      message: '휴대폰 인증을 완료해주세요.',
    }),

    nickname: z
      .string()
      .min(2, '닉네임은 2자 이상이어야 합니다.')
      .max(20, '닉네임은 20자 이하여야 합니다.')
      .regex(/^[가-힣a-zA-Z0-9]+$/, '특수문자는 사용할 수 없습니다.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
