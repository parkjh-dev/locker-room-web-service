import { z } from 'zod';

export const suspendUserSchema = z.object({
  reason: z.string().min(1, '정지 사유를 입력해주세요.').max(500, '500자 이하여야 합니다.'),
  days: z
    .number({ error: '정지 기간을 입력해주세요.' })
    .min(1, '최소 1일 이상이어야 합니다.')
    .max(365, '최대 365일까지 가능합니다.'),
});

export type SuspendUserFormData = z.infer<typeof suspendUserSchema>;

export const adminNoticeSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.').max(200, '200자 이하여야 합니다.'),
  content: z.string().min(1, '내용을 입력해주세요.').max(10000, '10000자 이하여야 합니다.'),
  isPinned: z.boolean(),
  boardIds: z.array(z.number()),
});

export type AdminNoticeFormData = z.infer<typeof adminNoticeSchema>;

export const answerInquirySchema = z.object({
  content: z.string().min(1, '답변 내용을 입력해주세요.').max(5000, '5000자 이하여야 합니다.'),
});

export type AnswerInquiryFormData = z.infer<typeof answerInquirySchema>;

export const rejectRequestSchema = z.object({
  rejectReason: z.string().min(1, '반려 사유를 입력해주세요.').max(500, '500자 이하여야 합니다.'),
});

export type RejectRequestFormData = z.infer<typeof rejectRequestSchema>;
