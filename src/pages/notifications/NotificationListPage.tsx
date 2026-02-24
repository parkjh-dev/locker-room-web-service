import { Bell } from 'lucide-react';
import { NotificationList } from '@/features/notifications/components/NotificationList';

export default function NotificationListPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5" />
        <h1 className="text-lg font-bold">알림</h1>
      </div>
      <NotificationList />
    </div>
  );
}
