import { Link } from 'react-router-dom';
import { ListPlus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RequestList } from '@/features/requests/components/RequestList';

export default function RequestListPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListPlus className="h-5 w-5" />
          <h1 className="text-lg font-bold">종목/구단 추가 요청</h1>
        </div>
        <Button size="sm" asChild>
          <Link to="/requests/new">
            <Plus className="mr-1 h-4 w-4" />
            요청하기
          </Link>
        </Button>
      </div>
      <RequestList />
    </div>
  );
}
