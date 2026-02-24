/** 게시글 목록 아이템 */
export interface PostListItem {
  id: number;
  boardId: number;
  boardName: string;
  title: string;
  nickname: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isAiGenerated: boolean;
  createdAt: string;
}

/** 게시글 상세 */
export interface PostDetail {
  id: number;
  boardId: number;
  boardName: string;
  title: string;
  content: string;
  nickname: string;
  userId: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isAiGenerated: boolean;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

/** 첨부파일 */
export interface Attachment {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

/** 게시글 작성 요청 */
export interface CreatePostRequest {
  boardId: number;
  title: string;
  content: string;
  attachmentIds?: number[];
}

/** 게시글 수정 요청 */
export interface UpdatePostRequest {
  title: string;
  content: string;
  attachmentIds?: number[];
}
