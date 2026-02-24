import { useQuery } from '@tanstack/react-query';
import { noticeApi } from '../api/noticeApi';

export function useNoticeDetail(noticeId: number) {
  return useQuery({
    queryKey: ['notices', noticeId],
    queryFn: () => noticeApi.getNoticeDetail(noticeId),
    enabled: noticeId > 0,
  });
}
