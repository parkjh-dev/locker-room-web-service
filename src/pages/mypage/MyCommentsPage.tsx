import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MyCommentList } from '@/features/mypage/components/MyCommentList';

export default function MyCommentsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/mypage">
            <ArrowLeft className="mr-1 h-4 w-4" />
            마이페이지
          </Link>
        </Button>
        <h1 className="text-lg font-bold">내가 쓴 댓글</h1>
      </div>
      <MyCommentList />
    </div>
  );
}
