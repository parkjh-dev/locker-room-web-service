import { Megaphone } from 'lucide-react';
import { NoticeManagement } from '@/features/admin/components/NoticeManagement';

export default function AdminNoticesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Megaphone className="h-5 w-5" />
        <h1 className="text-lg font-bold">공지 관리</h1>
      </div>
      <NoticeManagement />
    </div>
  );
}
