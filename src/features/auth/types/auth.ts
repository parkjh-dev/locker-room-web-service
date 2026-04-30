import type { SportTeamPair } from '@/types/common';

/** 회원가입 요청 (응원팀은 가입 후 온보딩 단계에서 별도 등록) */
export interface SignupRequest {
  email: string;
  password: string;
  phone: string;
  nickname: string;
}

/** 응원팀 등록 요청 (온보딩/마이페이지 공용) */
export interface AddTeamsRequest {
  teams: SportTeamPair[];
}

/** 휴대폰 인증번호 발송 응답 */
export interface PhoneVerificationSendResponse {
  expiresInSec: number;
}

/** 휴대폰 인증번호 검증 응답 */
export interface PhoneVerificationConfirmResponse {
  verified: boolean;
}

/** 이메일 인증 토큰 검증 응답 */
export interface EmailVerifyResponse {
  verified: boolean;
}

/** 가입 수단 — 이메일 자체가입(EMAIL) 또는 소셜 OAuth(KAKAO/GOOGLE/NAVER). */
export type AccountProvider = 'EMAIL' | 'KAKAO' | 'GOOGLE' | 'NAVER';

/** 휴대폰 본인확인으로 가입 이메일 조회 (아이디 찾기) */
export interface FindAccountIdResponse {
  found: boolean;
  /** 일부 마스킹된 이메일 (예: lo***@gmail.com). found=false면 null. */
  maskedEmail: string | null;
  /** 가입 수단 — 소셜 가입자에게는 비밀번호 재설정 대신 해당 SNS로 로그인하라는 안내. */
  provider: AccountProvider | null;
  /** 가입일 — 화면에 가입 시점을 노출해 본인 확인 보강. */
  createdAt: string | null;
}

/** SSO 프로필 보완 요청 (응원팀은 온보딩 단계에서 별도 등록) */
export interface ProfileCompleteRequest {
  nickname: string;
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
