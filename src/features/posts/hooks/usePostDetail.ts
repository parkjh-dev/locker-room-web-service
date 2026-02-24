import { useQuery } from '@tanstack/react-query';
import { postApi } from '../api/postApi';

export function usePostDetail(postId: number) {
  return useQuery({
    queryKey: ['posts', postId],
    queryFn: () => postApi.getDetail(postId),
    enabled: postId > 0,
  });
}
