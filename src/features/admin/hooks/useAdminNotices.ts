import { useInfiniteQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';

export function useAdminNotices() {
  return useInfiniteQuery({
    queryKey: ['admin', 'notices'],
    queryFn: ({ pageParam }) => adminApi.getNotices({ cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasNext ? (last.nextCursor ?? undefined) : undefined),
  });
}
