// notifications module public API

// Hooks
export { useNotifications } from './hooks/useNotifications';
export { useUnreadCount } from './hooks/useUnreadCount';

// Components
export { NotificationDropdown } from './components/NotificationDropdown';
export { NotificationItem } from './components/NotificationItem';
export { NotificationList } from './components/NotificationList';

// Types
export type {
  NotificationType,
  TargetType,
  NotificationItem as NotificationItemType,
  UnreadCountResponse,
} from './types/notification';
