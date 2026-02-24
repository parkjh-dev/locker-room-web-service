import { Users } from 'lucide-react';
import { UserManagement } from '@/features/admin/components/UserManagement';

export default function AdminUsersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        <h1 className="text-lg font-bold">회원 관리</h1>
      </div>
      <UserManagement />
    </div>
  );
}
