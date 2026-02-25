/** 공지 노출 범위 */
export type NoticeScope = 'ALL' | 'TEAM';

/** 공지사항 목록 아이템 (백엔드 NoticeListResponse 매칭) */
export interface NoticeListItem {
  id: number;
  title: string;
  isPinned: boolean;
  scope: NoticeScope;
  teamName: string | null;
  createdAt: string;
}

/** 공지사항 상세 (백엔드 NoticeDetailResponse 매칭) */
export interface NoticeDetail {
  id: number;
  title: string;
  content: string;
  isPinned: boolean;
  scope: NoticeScope;
  teamId: number | null;
  teamName: string | null;
  adminNickname: string;
  createdAt: string;
  updatedAt: string;
}
