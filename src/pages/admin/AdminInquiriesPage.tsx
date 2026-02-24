import { HelpCircle } from 'lucide-react';
import { InquiryManagement } from '@/features/admin/components/InquiryManagement';

export default function AdminInquiriesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-5 w-5" />
        <h1 className="text-lg font-bold">문의 관리</h1>
      </div>
      <InquiryManagement />
    </div>
  );
}
