import type { UserTeam } from '@/types/common';

/** 유저 프로필 */
export interface UserProfile {
  userId: number;
  email: string;
  nickname: string;
  role: 'USER' | 'ADMIN';
  teams: UserTeam[];
  createdAt: string;
}

/** 프로필 수정 요청 */
export interface UpdateProfileRequest {
  nickname: string;
}

/** 비밀번호 변경 요청 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/** 회원 탈퇴 요청 */
export interface WithdrawRequest {
  password: string;
  reason?: string;
}

/** 내가 쓴 댓글 아이템 */
export interface MyCommentItem {
  id: number;
  postId: number;
  postTitle: string;
  content: string;
  createdAt: string;
}
