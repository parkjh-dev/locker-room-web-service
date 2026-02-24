import { useInfiniteQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';

export function useAdminRequests(params?: { status?: string; type?: string }) {
  return useInfiniteQuery({
    queryKey: ['admin', 'requests', params],
    queryFn: ({ pageParam }) => adminApi.getRequests({ cursor: pageParam, ...params }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasNext ? (last.nextCursor ?? undefined) : undefined),
  });
}
