import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '../api/postApi';
import type { PostDetail } from '../types/post';

export function useToggleLike(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postApi.toggleLike(postId),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['posts', postId] });
      const previous = queryClient.getQueryData<PostDetail>(['posts', postId]);

      if (previous) {
        queryClient.setQueryData<PostDetail>(['posts', postId], {
          ...previous,
          isLiked: !previous.isLiked,
          likeCount: previous.isLiked ? previous.likeCount - 1 : previous.likeCount + 1,
        });
      }

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['posts', postId], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });
}
