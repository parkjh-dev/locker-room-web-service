import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MyPostList } from '@/features/mypage/components/MyPostList';

export default function MyPostsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/mypage">
            <ArrowLeft className="mr-1 h-4 w-4" />
            마이페이지
          </Link>
        </Button>
        <h1 className="text-lg font-bold">내가 쓴 글</h1>
      </div>
      <MyPostList />
    </div>
  );
}
