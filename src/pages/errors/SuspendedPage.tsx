import { Link, useSearchParams } from 'react-router-dom';
import { Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function SuspendedPage() {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason');
  const until = searchParams.get('until');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <Ban className="h-16 w-16 text-destructive" />
      <h1 className="text-3xl font-bold">계정 정지</h1>
      <p className="text-center text-muted-foreground">
        회원님의 계정이 정지되었습니다.
      </p>

      {(reason || until) && (
        <div className="w-full max-w-sm space-y-2 rounded-lg border p-4">
          {reason && (
            <div>
              <p className="text-sm font-medium">정지 사유</p>
              <p className="text-sm text-muted-foreground">{reason}</p>
            </div>
          )}
          {until && (
            <div>
              <p className="text-sm font-medium">해제 예정일</p>
              <p className="text-sm text-muted-foreground">{formatDate(until)}</p>
            </div>
          )}
        </div>
      )}

      <p className="text-center text-sm text-muted-foreground">
        자세한 내용은 고객센터로 문의해주세요.
      </p>
      <Button variant="outline" asChild>
        <Link to="/inquiries">고객센터</Link>
      </Button>
    </div>
  );
}
