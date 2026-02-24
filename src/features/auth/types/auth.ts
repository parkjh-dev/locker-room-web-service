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

/** 종목 */
export interface Sport {
  id: number;
  name: string;
}

/** 팀 */
export interface Team {
  id: number;
  name: string;
  logo: string | null;
}
