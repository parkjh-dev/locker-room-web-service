import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Reply, Megaphone, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { notificationApi } from '../api/notificationApi';
import type { NotificationItem as NotificationItemType } from '../types/notification';

const typeConfig = {
  COMMENT: { icon: MessageSquare, label: '댓글', getPath: (id: number) => `/posts/${id}` },
  REPLY: { icon: Reply, label: '답글', getPath: (id: number) => `/posts/${id}` },
  NOTICE: { icon: Megaphone, label: '공지', getPath: (id: number) => `/notices/${id}` },
  INQUIRY_REPLY: {
    icon: HelpCircle,
    label: '문의 답변',
    getPath: (id: number) => `/inquiries/${id}`,
  },
} as const;

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);

  if (diffMin < 1) return '방금';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  return date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
}

interface NotificationItemProps {
  notification: NotificationItemType;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  const { mutate: markAsRead } = useMutation({
    mutationFn: () => notificationApi.markAsRead(notification.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead();
    }
    navigate(config.getPath(notification.targetId));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-accent',
        !notification.isRead && 'bg-primary/5',
      )}
    >
      <div
        className={cn(
          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          notification.isRead ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary',
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn('text-sm', !notification.isRead && 'font-medium')}>
          {notification.message}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{config.label}</span>
          <span>{formatDate(notification.createdAt)}</span>
        </div>
      </div>
      {!notification.isRead && <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
    </button>
  );
}
