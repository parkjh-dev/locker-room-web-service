import api from '@/lib/axios';
import type { ApiResponse, CursorPageResponse, CursorPageParams } from '@/types/api';
import type { NoticeListItem, NoticeDetail } from '../types/notice';

export const noticeApi = {
  getNotices: (params?: CursorPageParams) =>
    api
      .get<ApiResponse<CursorPageResponse<NoticeListItem>>>('/notices', { params })
      .then((r) => r.data.data),

  getNoticeDetail: (noticeId: number) =>
    api.get<ApiResponse<NoticeDetail>>(`/notices/${noticeId}`).then((r) => r.data.data),
};
