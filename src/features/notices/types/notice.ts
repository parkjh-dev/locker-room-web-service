/** 공지사항 목록 아이템 */
export interface NoticeListItem {
  id: number;
  title: string;
  isPinned: boolean;
  viewCount: number;
  createdAt: string;
}

/** 공지사항 상세 */
export interface NoticeDetail {
  id: number;
  title: string;
  content: string;
  isPinned: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}
