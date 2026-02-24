import api from '@/lib/axios';
import type { ApiResponse, CursorPageResponse, CursorPageParams } from '@/types/api';
import type { InquiryListItem, InquiryDetail, CreateInquiryRequest } from '../types/inquiry';

export const inquiryApi = {
  getInquiries: (params?: CursorPageParams) =>
    api
      .get<ApiResponse<CursorPageResponse<InquiryListItem>>>('/inquiries', { params })
      .then((r) => r.data.data),

  getInquiryDetail: (inquiryId: number) =>
    api.get<ApiResponse<InquiryDetail>>(`/inquiries/${inquiryId}`).then((r) => r.data.data),

  createInquiry: (data: CreateInquiryRequest) =>
    api.post<ApiResponse<{ id: number }>>('/inquiries', data).then((r) => r.data.data),
};
