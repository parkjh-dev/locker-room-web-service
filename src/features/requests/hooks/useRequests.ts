import { useInfiniteQuery } from '@tanstack/react-query';
import { requestApi } from '../api/requestApi';

export function useRequests() {
  return useInfiniteQuery({
    queryKey: ['requests'],
    queryFn: ({ pageParam }) => requestApi.getRequests({ cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasNext ? (last.nextCursor ?? undefined) : undefined),
  });
}
