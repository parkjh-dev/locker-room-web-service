import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '../api/postApi';
import type { UpdatePostRequest } from '../types/post';

export function useUpdatePost(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePostRequest) => postApi.update(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });
}
