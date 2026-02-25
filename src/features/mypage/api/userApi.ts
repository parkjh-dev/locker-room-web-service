import api from '@/lib/axios';
import type { ApiResponse, CursorPageResponse, CursorPageParams } from '@/types/api';
import type {
  UserProfile,
  UpdateProfileRequest,
  WithdrawRequest,
  MyPostItem,
  MyCommentItem,
  MyLikeItem,
} from '../types/user';

export const userApi = {
  getMe: () => api.get<ApiResponse<UserProfile>>('/users/me').then((r) => r.data.data),

  updateMe: (data: UpdateProfileRequest) =>
    api
      .put<ApiResponse<{ id: number; nickname: string }>>('/users/me', data)
      .then((r) => r.data.data),

  deleteMe: (data: WithdrawRequest) => api.delete('/users/me', { data }),

  getMyPosts: (params?: CursorPageParams) =>
    api
      .get<ApiResponse<CursorPageResponse<MyPostItem>>>('/users/me/posts', { params })
      .then((r) => r.data.data),

  getMyComments: (params?: CursorPageParams) =>
    api
      .get<ApiResponse<CursorPageResponse<MyCommentItem>>>('/users/me/comments', { params })
      .then((r) => r.data.data),

  getMyLikes: (params?: CursorPageParams) =>
    api
      .get<ApiResponse<CursorPageResponse<MyLikeItem>>>('/users/me/likes', { params })
      .then((r) => r.data.data),
};
