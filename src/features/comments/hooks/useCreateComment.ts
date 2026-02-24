import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentApi } from '../api/commentApi';
import type { CreateCommentRequest } from '../types/comment';

export function useCreateComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentRequest) => commentApi.createComment(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });
}
