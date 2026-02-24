import api from '@/lib/axios';
import type { ApiResponse, CursorPageResponse, CursorPageParams } from '@/types/api';
import type { RequestListItem, RequestDetail, CreateRequestRequest } from '../types/request';

export const requestApi = {
  getRequests: (params?: CursorPageParams) =>
    api
      .get<ApiResponse<CursorPageResponse<RequestListItem>>>('/requests', { params })
      .then((r) => r.data.data),

  getRequestDetail: (requestId: number) =>
    api.get<ApiResponse<RequestDetail>>(`/requests/${requestId}`).then((r) => r.data.data),

  createRequest: (data: CreateRequestRequest) =>
    api.post<ApiResponse<{ id: number }>>('/requests', data).then((r) => r.data.data),
};
