import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentApi } from '../api/commentApi';

export function useDeleteComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => commentApi.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });
}
