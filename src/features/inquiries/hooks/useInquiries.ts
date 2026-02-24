import { useInfiniteQuery } from '@tanstack/react-query';
import { inquiryApi } from '../api/inquiryApi';

export function useInquiries() {
  return useInfiniteQuery({
    queryKey: ['inquiries'],
    queryFn: ({ pageParam }) => inquiryApi.getInquiries({ cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasNext ? (last.nextCursor ?? undefined) : undefined),
  });
}
