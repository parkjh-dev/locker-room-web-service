import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type {
  SignupRequest,
  ProfileCompleteRequest,
  AddTeamsRequest,
  PhoneVerificationSendResponse,
  PhoneVerificationConfirmResponse,
  EmailVerifyResponse,
  FindAccountIdResponse,
  Sport,
  Country,
  League,
  Team,
} from '../types/auth';
import type { UserProfile } from '@/features/mypage/types/user';

export const authApi = {
  signup: (data: SignupRequest) => api.post<ApiResponse<{ id: number }>>('/auth/signup', data),

  profileComplete: (data: ProfileCompleteRequest) =>
    api.post<ApiResponse<{ id: number }>>('/auth/profile/complete', data),

  /** 휴대폰 인증번호 발송 */
  requestPhoneVerification: (phone: string) =>
    api
      .post<ApiResponse<PhoneVerificationSendResponse>>('/auth/phone/verification', { phone })
      .then((r) => r.data.data),

  /** 휴대폰 인증번호 검증 */
  confirmPhoneVerification: (phone: string, code: string) =>
    api
      .post<
        ApiResponse<PhoneVerificationConfirmResponse>
      >('/auth/phone/verification/confirm', { phone, code })
      .then((r) => r.data.data),

  /**
   * 이메일 인증 메일 재발송.
   * - 로그인 사용자: 인자 없이 호출 (백엔드가 토큰에서 식별)
   * - 가입 직후 미로그인: 가입한 이메일을 인자로 전달
   */
  resendVerificationEmail: (email?: string) =>
    api
      .post<ApiResponse<null>>('/auth/email/verification/resend', email ? { email } : {})
      .then((r) => r.data),

  /** 이메일 인증 토큰 검증 */
  verifyEmail: (token: string) =>
    api
      .post<ApiResponse<EmailVerifyResponse>>('/auth/email/verification/confirm', { token })
      .then((r) => r.data.data),

  /**
   * 아이디(가입 이메일) 찾기 — 휴대폰 본인확인 후 마스킹 이메일 반환.
   * 호출 전 휴대폰 인증을 완료해야 한다 (백엔드에서 같은 phone에 대한 verified state 확인).
   */
  findAccountIdByPhone: (phone: string) =>
    api
      .post<ApiResponse<FindAccountIdResponse>>('/auth/account/find/id', { phone })
      .then((r) => r.data.data),

  /**
   * 응원팀 등록 (온보딩/마이페이지 공용).
   * - 등록한 종목의 팀은 이후 변경 불가, 미등록 종목은 추가 가능.
   * - 호출 성공 시 백엔드가 onboardingCompletedAt을 자동으로 셋한다.
   */
  addUserTeams: (data: AddTeamsRequest) =>
    api.post<ApiResponse<UserProfile>>('/users/me/teams', data).then((r) => r.data.data),

  /** 온보딩 건너뛰기 — onboardingCompletedAt만 셋, 팀은 빈 상태 유지 */
  skipOnboarding: () =>
    api.post<ApiResponse<UserProfile>>('/users/me/onboarding/skip').then((r) => r.data.data),

  getSports: () => api.get<ApiResponse<Sport[]>>('/sports').then((r) => r.data.data),

  /**
   * 종목별 활성화된 국가 목록.
   * 백엔드 contract: GET /sports/{sportId}/countries
   */
  getCountriesBySport: (sportId: number) =>
    api.get<ApiResponse<Country[]>>(`/sports/${sportId}/countries`).then((r) => r.data.data),

  /**
   * 종목·국가 조합으로 운영되는 리그 목록.
   * 백엔드 contract: GET /sports/{sportId}/countries/{countryId}/leagues
   */
  getLeaguesByCountry: (sportId: number, countryId: number) =>
    api
      .get<ApiResponse<League[]>>(`/sports/${sportId}/countries/${countryId}/leagues`)
      .then((r) => r.data.data),

  /**
   * 리그별 팀 목록.
   * 백엔드 contract: GET /leagues/{leagueId}/teams
   */
  getTeamsByLeague: (leagueId: number) =>
    api.get<ApiResponse<Team[]>>(`/leagues/${leagueId}/teams`).then((r) => r.data.data),
};
