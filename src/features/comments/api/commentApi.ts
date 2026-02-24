import api from '@/lib/axios';
import type { ApiResponse, CursorPageResponse, CursorPageParams } from '@/types/api';
import type {
  Comment,
  CreateCommentRequest,
  CreateReplyRequest,
  UpdateCommentRequest,
} from '../types/comment';

export const commentApi = {
  getComments: (postId: number, params?: CursorPageParams) =>
    api
      .get<ApiResponse<CursorPageResponse<Comment>>>(`/posts/${postId}/comments`, { params })
      .then((r) => r.data.data),

  createComment: (postId: number, data: CreateCommentRequest) =>
    api
      .post<ApiResponse<{ id: number }>>(`/posts/${postId}/comments`, data)
      .then((r) => r.data.data),

  createReply: (commentId: number, data: CreateReplyRequest) =>
    api
      .post<ApiResponse<{ id: number }>>(`/comments/${commentId}/replies`, data)
      .then((r) => r.data.data),

  updateComment: (commentId: number, data: UpdateCommentRequest) =>
    api.put<ApiResponse<{ id: number }>>(`/comments/${commentId}`, data).then((r) => r.data.data),

  deleteComment: (commentId: number) => api.delete(`/comments/${commentId}`),
};
