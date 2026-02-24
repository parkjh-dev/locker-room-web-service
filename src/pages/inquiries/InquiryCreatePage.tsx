import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InquiryForm } from '@/features/inquiries/components/InquiryForm';

export default function InquiryCreatePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/inquiries">
            <ArrowLeft className="mr-1 h-4 w-4" />
            목록
          </Link>
        </Button>
        <h1 className="text-lg font-bold">문의하기</h1>
      </div>
      <InquiryForm />
    </div>
  );
}
