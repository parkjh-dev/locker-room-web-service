import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '../api/postApi';

export function useDeletePost(postId: number, boardId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postApi.delete(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', boardId] });
      queryClient.invalidateQueries({ queryKey: ['users', 'me', 'posts'] });
    },
  });
}
