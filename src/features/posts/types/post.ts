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

/** 게시글 목록 아이템 (백엔드 PostListResponse 매칭) */
export interface PostListItem {
  id: number;
  title: string;
  authorNickname: string;
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
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isAiGenerated: boolean;
  isLiked: boolean;
  files: FileInfo[];
  createdAt: string;
  updatedAt: string;
}

/** 게시글 작성 요청 (백엔드 PostCreateRequest 매칭) */
export interface CreatePostRequest {
  boardId: number;
  title: string;
  content: string;
  fileIds?: number[];
}

/** 게시글 수정 요청 (백엔드 PostUpdateRequest 매칭) */
export interface UpdatePostRequest {
  title: string;
  content: string;
  fileIds?: number[];
}
