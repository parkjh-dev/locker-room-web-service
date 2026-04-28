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

/** 대륙 (백엔드 Continent 매칭) */
export interface Continent {
  id: number;
  nameKo: string;
  code: string;
}

/** 국가 (백엔드 Country 매칭) */
export interface Country {
  id: number;
  nameKo: string;
  code: string;
  continentId: number;
}

/** 리그 (Football/Baseball 등 종목별 리그를 추상화) */
export interface League {
  id: number;
  nameKo: string;
  sportId: number;
  countryId: number;
  tier?: number;
  logoUrl?: string | null;
}

/** 팀 (백엔드 TeamResponse 매칭) */
export interface Team {
  id: number;
  name: string;
  logoUrl: string | null;
  isActive: boolean;
  /** 어느 리그 소속인지 (leagueId 기반 응답에 포함) */
  leagueId?: number;
}
