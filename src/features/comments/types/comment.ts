import type { AuthorInfo } from '@/features/posts/types/post';

/** 댓글 (백엔드 CommentResponse 매칭) */
export interface Comment {
  id: number;
  author: AuthorInfo;
  content: string;
  isAiGenerated: boolean;
  createdAt: string;
  replies: Comment[];
}

/** 댓글 작성 요청 */
export interface CreateCommentRequest {
  content: string;
}

/** 대댓글 작성 요청 */
export interface CreateReplyRequest {
  content: string;
}

/** 댓글 수정 요청 */
export interface UpdateCommentRequest {
  content: string;
}
