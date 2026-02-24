import { GitPullRequestArrow } from 'lucide-react';
import { RequestManagement } from '@/features/admin/components/RequestManagement';

export default function AdminRequestsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <GitPullRequestArrow className="h-5 w-5" />
        <h1 className="text-lg font-bold">요청 관리</h1>
      </div>
      <RequestManagement />
    </div>
  );
}
