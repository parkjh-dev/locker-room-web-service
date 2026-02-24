import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { EmptyState } from '@/components/common/EmptyState';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { NotificationItem } from './NotificationItem';
import { useNotifications } from '../hooks/useNotifications';
import { useUnreadCount } from '../hooks/useUnreadCount';
import { notificationApi } from '../api/notificationApi';

export function NotificationList() {
  const queryClient = useQueryClient();
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useNotifications();
  const { data: unread } = useUnreadCount();

  const { mutate: markAllAsRead, isPending } = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      toast.success('모든 알림을 읽음 처리했습니다.');
    },
  });

  const scrollRef = useInfiniteScroll(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  });

  if (isLoading) {
    return <SkeletonLoader type="post-list" count={5} />;
  }

  const notifications = data?.pages.flatMap((page) => page.items) ?? [];
  const unreadCount = unread?.count ?? 0;

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="알림이 없습니다"
        description="새로운 알림이 오면 여기에 표시됩니다."
      />
    );
  }

  return (
    <div>
      {unreadCount > 0 && (
        <div className="mb-3 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => markAllAsRead()} disabled={isPending}>
            <CheckCheck className="mr-1.5 h-4 w-4" />
            모두 읽음
          </Button>
        </div>
      )}
      <div className="space-y-1">
        {notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))}
      </div>
      {isFetchingNextPage && <SkeletonLoader type="post-list" count={2} />}
      <div ref={scrollRef} className="h-1" />
    </div>
  );
}
