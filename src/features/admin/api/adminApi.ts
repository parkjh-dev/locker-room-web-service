import api from '@/lib/axios';
import type { ApiResponse, CursorPageResponse, CursorPageParams } from '@/types/api';
import type {
  AdminDashboardSummary,
  AdminUser,
  SuspendUserRequest,
  AdminReport,
  ProcessReportRequest,
  AdminNotice,
  AdminNoticeRequest,
  AdminInquiry,
  AnswerInquiryRequest,
  AdminRequest,
  ProcessRequestRequest,
} from '../types/admin';

export const adminApi = {
  getDashboard: () =>
    api.get<ApiResponse<AdminDashboardSummary>>('/admin/dashboard').then((r) => r.data.data),

  getUsers: (params?: CursorPageParams & { keyword?: string; role?: string }) =>
    api
      .get<ApiResponse<CursorPageResponse<AdminUser>>>('/admin/users', { params })
      .then((r) => r.data.data),

  suspendUser: (userId: number, data: SuspendUserRequest) =>
    api.put<ApiResponse<void>>(`/admin/users/${userId}/suspend`, data),

  unsuspendUser: (userId: number) => api.put<ApiResponse<void>>(`/admin/users/${userId}/unsuspend`),

  getReports: (params?: CursorPageParams & { status?: string }) =>
    api
      .get<ApiResponse<CursorPageResponse<AdminReport>>>('/admin/reports', { params })
      .then((r) => r.data.data),

  processReport: (reportId: number, data: ProcessReportRequest) =>
    api.put<ApiResponse<void>>(`/admin/reports/${reportId}`, data),

  getNotices: (params?: CursorPageParams) =>
    api
      .get<ApiResponse<CursorPageResponse<AdminNotice>>>('/admin/notices', { params })
      .then((r) => r.data.data),

  createNotice: (data: AdminNoticeRequest) =>
    api.post<ApiResponse<{ id: number }>>('/admin/notices', data).then((r) => r.data.data),

  updateNotice: (noticeId: number, data: AdminNoticeRequest) =>
    api.put<ApiResponse<void>>(`/admin/notices/${noticeId}`, data),

  deleteNotice: (noticeId: number) => api.delete(`/admin/notices/${noticeId}`),

  getInquiries: (params?: CursorPageParams & { status?: string; type?: string }) =>
    api
      .get<ApiResponse<CursorPageResponse<AdminInquiry>>>('/admin/inquiries', { params })
      .then((r) => r.data.data),

  answerInquiry: (inquiryId: number, data: AnswerInquiryRequest) =>
    api.post<ApiResponse<void>>(`/admin/inquiries/${inquiryId}/reply`, data),

  getRequests: (params?: CursorPageParams & { status?: string; type?: string }) =>
    api
      .get<ApiResponse<CursorPageResponse<AdminRequest>>>('/admin/requests', { params })
      .then((r) => r.data.data),

  processRequest: (requestId: number, data: ProcessRequestRequest) =>
    api.put<ApiResponse<void>>(`/admin/requests/${requestId}`, data),
};
