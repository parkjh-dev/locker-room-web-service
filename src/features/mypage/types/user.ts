import type { UserTeam } from '@/types/common';

/** 유저 프로필 (백엔드 UserResponse 매칭) */
export interface UserProfile {
  id: number;
  email: string;
  nickname: string;
  role: 'USER' | 'ADMIN';
  provider: string | null;
  profileImageUrl?: string | null;
  teams: UserTeam[];
  createdAt: string;
}

/** 프로필 수정 요청 (백엔드 UserUpdateRequest 매칭 - 닉네임+비밀번호 통합) */
export interface UpdateProfileRequest {
  nickname?: string;
  currentPassword?: string;
  newPassword?: string;
}

/** 회원 탈퇴 요청 (백엔드 WithdrawRequest 매칭) */
export interface WithdrawRequest {
  password: string;
  reason?: string;
}

/** 내가 쓴 글 아이템 (백엔드 UserPostListResponse 매칭) */
export interface MyPostItem {
  id: number;
  boardId: number;
  boardName: string;
  title: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

/** 내가 쓴 댓글 아이템 (백엔드 UserCommentListResponse 매칭) */
export interface MyCommentItem {
  id: number;
  postId: number;
  postTitle: string;
  content: string;
  createdAt: string;
}

/** 좋아요한 글 아이템 (백엔드 UserLikeListResponse 매칭) */
export interface MyLikeItem {
  id: number;
  boardId: number;
  boardName: string;
  title: string;
  authorNickname: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
}
