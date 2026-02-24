import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { SignupRequest, ProfileCompleteRequest, Sport, Team } from '../types/auth';

export const authApi = {
  signup: (data: SignupRequest) => api.post<ApiResponse<{ id: number }>>('/auth/signup', data),

  profileComplete: (data: ProfileCompleteRequest) =>
    api.post<ApiResponse<{ id: number }>>('/auth/profile/complete', data),

  getSports: () => api.get<ApiResponse<Sport[]>>('/sports').then((r) => r.data.data),

  getTeams: (sportId: number) =>
    api.get<ApiResponse<Team[]>>(`/sports/${sportId}/teams`).then((r) => r.data.data),
};
