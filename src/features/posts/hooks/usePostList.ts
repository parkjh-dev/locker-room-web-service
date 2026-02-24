import { useInfiniteQuery } from '@tanstack/react-query';
import { postApi } from '../api/postApi';
import type { SearchParams } from '@/types/api';

export function usePostList(boardId: number, params: Omit<SearchParams, 'cursor'>) {
  return useInfiniteQuery({
    queryKey: ['posts', boardId, params],
    queryFn: ({ pageParam }) => postApi.getList(boardId, { ...params, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
  });
}
