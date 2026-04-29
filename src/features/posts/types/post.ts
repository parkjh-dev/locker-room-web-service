/** 작성자 정보 (백엔드 AuthorInfo 매칭) */
export interface AuthorInfo {
  id: number;
  nickname: string;
  teamName?: string;
  profileImageUrl?: string | null;
}

/** 파일 정보 (백엔드 FileResponse 매칭) */
export interface FileInfo {
  id: number;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
}

/** 게시글 말머리 (카테고리) */
export type PostCategory = 'GENERAL' | 'REVIEW' | 'PREDICTION' | 'QUESTION' | 'MEME' | 'NEWS';

/** 투표 옵션 */
export interface PollOption {
  id: number;
  text: string;
  voteCount: number;
}

/** 투표 정보 */
export interface Poll {
  /** 투표 질문 (선택). null이면 본문 자체가 질문 */
  question: string | null;
  options: PollOption[];
  /** ISO datetime — 만료 시 결과 공개 */
  expiresAt: string;
  totalVotes: number;
  /** 내가 선택한 옵션 id (null이면 미투표) */
  myVoteOptionId: number | null;
}

/** 게시글 목록 아이템 (백엔드 PostListResponse 매칭) */
export interface PostListItem {
  id: number;
  title: string;
  authorNickname: string;
  category: PostCategory;
  /** 투표 포함 여부만 노출 (목록에선 상세 데이터 불필요) */
  hasPoll: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isAiGenerated: boolean;
  createdAt: string;
}

/** 게시글 상세 (백엔드 PostDetailResponse 매칭) */
export interface PostDetail {
  id: number;
  boardId: number;
  boardName: string;
  author: AuthorInfo;
  title: string;
  content: string;
  category: PostCategory;
  poll: Poll | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isAiGenerated: boolean;
  isLiked: boolean;
  files: FileInfo[];
  createdAt: string;
  updatedAt: string;
}

/** 작성·수정 시 함께 보내는 투표 페이로드 */
export interface PollPayload {
  question: string | null;
  options: string[];
  /** 만료 시점 (ISO) */
  expiresAt: string;
}

/** 게시글 작성 요청 (백엔드 PostCreateRequest 매칭) */
export interface CreatePostRequest {
  boardId: number;
  title: string;
  content: string;
  category: PostCategory;
  poll?: PollPayload | null;
  fileIds?: number[];
}

/** 게시글 수정 요청 (백엔드 PostUpdateRequest 매칭) */
export interface UpdatePostRequest {
  title: string;
  content: string;
  category: PostCategory;
  /** 수정 시 투표는 변경 불가 (참여자 기존 표 보호) */
  fileIds?: number[];
}
