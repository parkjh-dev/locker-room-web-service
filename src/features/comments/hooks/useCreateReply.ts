import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentApi } from '../api/commentApi';
import type { CreateReplyRequest } from '../types/comment';

export function useCreateReply(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: number; data: CreateReplyRequest }) =>
      commentApi.createReply(commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });
}
