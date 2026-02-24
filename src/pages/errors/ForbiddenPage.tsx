import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <ShieldX className="h-16 w-16 text-destructive" />
      <h1 className="text-3xl font-bold">403</h1>
      <p className="text-muted-foreground">접근 권한이 없습니다.</p>
      <Button asChild>
        <Link to="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  );
}
