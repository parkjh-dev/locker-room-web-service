import { Link } from 'react-router-dom';
import { Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SuspendedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <Ban className="h-16 w-16 text-destructive" />
      <h1 className="text-3xl font-bold">계정 정지</h1>
      <p className="text-center text-muted-foreground">
        회원님의 계정이 정지되었습니다.
        <br />
        자세한 내용은 고객센터로 문의해주세요.
      </p>
      <Button variant="outline" asChild>
        <Link to="/inquiries">고객센터</Link>
      </Button>
    </div>
  );
}
