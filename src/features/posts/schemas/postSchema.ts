import { z } from 'zod';

export const POST_CATEGORIES = [
  'GENERAL',
  'REVIEW',
  'PREDICTION',
  'QUESTION',
  'MEME',
  'NEWS',
] as const;

export const POST_CATEGORY_LABELS: Record<(typeof POST_CATEGORIES)[number], string> = {
  GENERAL: '일반',
  REVIEW: '후기',
  PREDICTION: '예측',
  QUESTION: '질문',
  MEME: '짤방',
  NEWS: '뉴스',
};

const pollOptionsSchema = z
  .array(z.string().trim().min(1).max(50))
  .min(2, '투표 옵션은 최소 2개 필요합니다.')
  .max(5, '투표 옵션은 최대 5개까지 가능합니다.')
  .refine((opts) => new Set(opts.map((s) => s.trim())).size === opts.length, {
    message: '중복된 옵션이 있습니다.',
  });

export const pollDraftSchema = z.object({
  question: z.string().trim().max(120, '질문은 120자 이하여야 합니다.').optional(),
  options: pollOptionsSchema,
  /** 마감일 — ISO datetime */
  expiresAt: z.string().min(1, '마감일을 선택해주세요.'),
});

export type PollDraft = z.infer<typeof pollDraftSchema>;

export const postSchema = z.object({
  boardId: z.number({ error: '게시판을 선택해주세요.' }).min(1, '게시판을 선택해주세요.'),
  category: z.enum(POST_CATEGORIES, { error: '말머리를 선택해주세요.' }),
  title: z.string().min(1, '제목을 입력해주세요.').max(200, '제목은 200자 이하여야 합니다.'),
  content: z.string().min(1, '내용을 입력해주세요.').max(10000, '내용은 10,000자 이하여야 합니다.'),
  poll: pollDraftSchema.nullable().optional(),
});

export type PostFormData = z.infer<typeof postSchema>;
