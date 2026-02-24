import api from '@/lib/axios';
import type { ApiResponse, CursorPageResponse, CursorPageParams } from '@/types/api';
import type { PostListItem } from '@/features/posts/types/post';
import type {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  WithdrawRequest,
  MyCommentItem,
} from '../types/user';

export const userApi = {
  getMe: () => api.get<ApiResponse<UserProfile>>('/users/me').then((r) => r.data.data),

  updateMe: (data: UpdateProfileRequest) =>
    api.put<ApiResponse<{ id: number }>>('/users/me', data).then((r) => r.data.data),

  changePassword: (data: ChangePasswordRequest) =>
    api.put<ApiResponse<void>>('/users/me/password', data),

  deleteMe: (data: WithdrawRequest) => api.delete('/users/me', { data }),

  getMyPosts: (params?: CursorPageParams) =>
    api
      .get<ApiResponse<CursorPageResponse<PostListItem>>>('/users/me/posts', { params })
      .then((r) => r.data.data),

  getMyComments: (params?: CursorPageParams) =>
    api
      .get<ApiResponse<CursorPageResponse<MyCommentItem>>>('/users/me/comments', { params })
      .then((r) => r.data.data),

  getMyLikes: (params?: CursorPageParams) =>
    api
      .get<ApiResponse<CursorPageResponse<PostListItem>>>('/users/me/likes', { params })
      .then((r) => r.data.data),
};
