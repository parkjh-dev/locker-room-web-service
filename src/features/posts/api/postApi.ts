import api from '@/lib/axios';
import type { ApiResponse, CursorPageResponse, SearchParams } from '@/types/api';
import type { PostListItem, PostDetail, CreatePostRequest, UpdatePostRequest } from '../types/post';

export const postApi = {
  getList: (boardId: number, params: SearchParams) =>
    api
      .get<ApiResponse<CursorPageResponse<PostListItem>>>(`/boards/${boardId}/posts`, { params })
      .then((r) => r.data.data),

  getDetail: (postId: number) =>
    api.get<ApiResponse<PostDetail>>(`/posts/${postId}`).then((r) => r.data.data),

  create: (data: CreatePostRequest) =>
    api.post<ApiResponse<{ id: number }>>('/posts', data).then((r) => r.data.data),

  update: (postId: number, data: UpdatePostRequest) =>
    api.put<ApiResponse<{ id: number }>>(`/posts/${postId}`, data).then((r) => r.data.data),

  delete: (postId: number) => api.delete(`/posts/${postId}`),

  toggleLike: (postId: number) =>
    api
      .post<
        ApiResponse<{ postId: number; isLiked: boolean; likeCount: number }>
      >(`/posts/${postId}/like`)
      .then((r) => r.data.data),

  report: (postId: number, reason: string) => api.post(`/posts/${postId}/report`, { reason }),
};
