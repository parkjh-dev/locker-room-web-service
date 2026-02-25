import type { SportTeamPair } from '@/types/common';

/** 회원가입 요청 */
export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  teams: SportTeamPair[];
}

/** SSO 프로필 보완 요청 */
export interface ProfileCompleteRequest {
  nickname: string;
  teams: SportTeamPair[];
}

/** 종목 (백엔드 SportResponse 매칭) */
export interface Sport {
  id: number;
  name: string;
  isActive: boolean;
}

/** 팀 (백엔드 TeamResponse 매칭) */
export interface Team {
  id: number;
  name: string;
  logoUrl: string | null;
  isActive: boolean;
}
