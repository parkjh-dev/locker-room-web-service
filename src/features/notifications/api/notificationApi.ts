import api from '@/lib/axios';
import type { ApiResponse, CursorPageResponse, CursorPageParams } from '@/types/api';
import type { NotificationItem, UnreadCountResponse } from '../types/notification';

export const notificationApi = {
  getNotifications: (params?: CursorPageParams) =>
    api
      .get<ApiResponse<CursorPageResponse<NotificationItem>>>('/notifications', { params })
      .then((r) => r.data.data),

  getUnreadCount: () =>
    api
      .get<ApiResponse<UnreadCountResponse>>('/notifications/unread-count')
      .then((r) => r.data.data),

  markAsRead: (id: number) => api.put<ApiResponse<void>>(`/notifications/${id}/read`),

  markAllAsRead: () => api.put<ApiResponse<void>>('/notifications/read-all'),
};
