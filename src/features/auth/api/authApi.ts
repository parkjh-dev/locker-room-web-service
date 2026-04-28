import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type {
  SignupRequest,
  ProfileCompleteRequest,
  Sport,
  Country,
  League,
  Team,
} from '../types/auth';

export const authApi = {
  signup: (data: SignupRequest) => api.post<ApiResponse<{ id: number }>>('/auth/signup', data),

  profileComplete: (data: ProfileCompleteRequest) =>
    api.post<ApiResponse<{ id: number }>>('/auth/profile/complete', data),

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
