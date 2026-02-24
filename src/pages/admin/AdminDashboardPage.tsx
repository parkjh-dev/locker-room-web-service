import { LayoutDashboard } from 'lucide-react';
import { Dashboard } from '@/features/admin/components/Dashboard';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="h-5 w-5" />
        <h1 className="text-lg font-bold">대시보드</h1>
      </div>
      <Dashboard />
    </div>
  );
}
