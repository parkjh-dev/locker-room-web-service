import { Link } from 'react-router-dom';
import { HelpCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InquiryList } from '@/features/inquiries/components/InquiryList';

export default function InquiryListPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          <h1 className="text-lg font-bold">고객센터</h1>
        </div>
        <Button size="sm" asChild>
          <Link to="/inquiries/new">
            <Plus className="mr-1 h-4 w-4" />
            문의하기
          </Link>
        </Button>
      </div>
      <InquiryList />
    </div>
  );
}
