import { useInfiniteQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';

export function useAdminReports(params?: { status?: string }) {
  return useInfiniteQuery({
    queryKey: ['admin', 'reports', params],
    queryFn: ({ pageParam }) => adminApi.getReports({ cursor: pageParam, ...params }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasNext ? (last.nextCursor ?? undefined) : undefined),
  });
}
