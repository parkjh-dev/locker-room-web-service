/** 알림 유형 */
export type NotificationType = 'COMMENT' | 'REPLY' | 'NOTICE' | 'INQUIRY_REPLY';

/** 알림 아이템 */
export interface NotificationItem {
  id: number;
  type: NotificationType;
  message: string;
  targetId: number;
  isRead: boolean;
  createdAt: string;
}

/** 미읽음 알림 수 */
export interface UnreadCountResponse {
  count: number;
}
