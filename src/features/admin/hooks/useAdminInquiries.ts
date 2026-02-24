import { useInfiniteQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';

export function useAdminInquiries(params?: { status?: string; type?: string }) {
  return useInfiniteQuery({
    queryKey: ['admin', 'inquiries', params],
    queryFn: ({ pageParam }) => adminApi.getInquiries({ cursor: pageParam, ...params }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasNext ? (last.nextCursor ?? undefined) : undefined),
  });
}
