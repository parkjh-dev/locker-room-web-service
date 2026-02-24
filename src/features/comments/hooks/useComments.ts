import { useInfiniteQuery } from '@tanstack/react-query';
import { commentApi } from '../api/commentApi';

export function useComments(postId: number) {
  return useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam }) => commentApi.getComments(postId, { cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    enabled: postId > 0,
  });
}
