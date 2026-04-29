import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '../api/postApi';
import type { PostDetail } from '../types/post';

export function useVotePoll(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (optionId: number) => postApi.vote(postId, optionId),
    onSuccess: (poll) => {
      // 상세 캐시에 투표 결과 즉시 반영 (optimistic-after-success)
      queryClient.setQueryData<PostDetail | undefined>(['posts', postId], (prev) =>
        prev ? { ...prev, poll } : prev,
      );
    },
  });
}
