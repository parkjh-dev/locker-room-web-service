import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '../api/postApi';
import type { CreatePostRequest } from '../types/post';

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => postApi.create(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts', variables.boardId] });
    },
  });
}
