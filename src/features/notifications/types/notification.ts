/** 알림 유형 */
export type NotificationType = 'COMMENT' | 'REPLY' | 'NOTICE' | 'INQUIRY_REPLY';

/** 알림 대상 유형 */
export type TargetType = 'POST' | 'COMMENT' | 'NOTICE' | 'INQUIRY';

/** 알림 아이템 (백엔드 NotificationResponse 매칭) */
export interface NotificationItem {
  id: number;
  type: NotificationType;
  targetType: TargetType;
  targetId: number;
  message: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

/** 미읽음 알림 수 (백엔드 UnreadCountResponse 매칭) */
export interface UnreadCountResponse {
  unreadCount: number;
}
