import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RequestDetail } from '@/features/requests/components/RequestDetail';

export default function RequestDetailPage() {
  const { requestId } = useParams<{ requestId: string }>();

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/requests">
          <ArrowLeft className="mr-1 h-4 w-4" />
          목록
        </Link>
      </Button>
      <RequestDetail requestId={Number(requestId)} />
    </div>
  );
}
