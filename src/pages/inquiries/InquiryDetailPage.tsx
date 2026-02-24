import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InquiryDetail } from '@/features/inquiries/components/InquiryDetail';

export default function InquiryDetailPage() {
  const { inquiryId } = useParams<{ inquiryId: string }>();

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/inquiries">
          <ArrowLeft className="mr-1 h-4 w-4" />
          목록
        </Link>
      </Button>
      <InquiryDetail inquiryId={Number(inquiryId)} />
    </div>
  );
}
