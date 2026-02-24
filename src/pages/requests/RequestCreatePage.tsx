import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RequestForm } from '@/features/requests/components/RequestForm';

export default function RequestCreatePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/requests">
            <ArrowLeft className="mr-1 h-4 w-4" />
            목록
          </Link>
        </Button>
        <h1 className="text-lg font-bold">요청하기</h1>
      </div>
      <RequestForm />
    </div>
  );
}
