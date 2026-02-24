import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { Board } from '../types/board';

export const boardApi = {
  getBoards: () => api.get<ApiResponse<Board[]>>('/boards').then((r) => r.data.data),
};
