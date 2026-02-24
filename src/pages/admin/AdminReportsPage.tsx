import { Flag } from 'lucide-react';
import { ReportManagement } from '@/features/admin/components/ReportManagement';

export default function AdminReportsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Flag className="h-5 w-5" />
        <h1 className="text-lg font-bold">신고 관리</h1>
      </div>
      <ReportManagement />
    </div>
  );
}
