import { useInfiniteQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';

export function useAdminUsers(params?: { keyword?: string; role?: string }) {
  return useInfiniteQuery({
    queryKey: ['admin', 'users', params],
    queryFn: ({ pageParam }) => adminApi.getUsers({ cursor: pageParam, ...params }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasNext ? (last.nextCursor ?? undefined) : undefined),
  });
}
