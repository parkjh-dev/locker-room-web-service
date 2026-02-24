import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';

// Phase 10에서 전체 타입 및 API 확장 예정
export const userApi = {
  getMe: () => api.get<ApiResponse<unknown>>('/users/me').then((r) => r.data),
};
