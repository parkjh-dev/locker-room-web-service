import { useInfiniteQuery } from '@tanstack/react-query';
import { noticeApi } from '../api/noticeApi';

export function useNotices() {
  return useInfiniteQuery({
    queryKey: ['notices'],
    queryFn: ({ pageParam }) => noticeApi.getNotices({ cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
  });
}
