/** 댓글 */
export interface Comment {
  id: number;
  postId: number;
  userId: number;
  nickname: string;
  content: string;
  isAiGenerated: boolean;
  isDeleted: boolean;
  replies: Comment[];
  createdAt: string;
  updatedAt: string;
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
