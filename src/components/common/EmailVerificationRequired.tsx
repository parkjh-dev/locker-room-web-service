import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailWarning, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { authApi } from '@/features/auth/api/authApi';

interface Props {
  /** 차단된 액션명 (예: "글쓰기", "댓글 작성") — 안내 문구에 삽입 */
  action: string;
}

export function EmailVerificationRequired({ action }: Props) {
  const user = useAuthStore((s) => s.user);
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    setResending(true);
    try {
      await authApi.resendVerificationEmail();
      toast.success(`${user?.email}로 인증 메일을 다시 보냈어요.`);
    } catch {
      toast.error('인증 메일 발송에 실패했습니다.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-8 text-center shadow-soft">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-amber-100 text-amber-700">
          <MailWarning className="h-7 w-7" />
        </span>
        <h2 className="mt-4 text-lg font-bold tracking-tight text-amber-900">
          이메일 인증이 필요해요
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-amber-900/80">
          {action} 기능을 이용하려면 이메일 인증을 먼저 완료해 주세요. 가입 시 입력하신{' '}
          <span className="font-semibold">{user?.email}</span>로 보낸 메일의 링크를 클릭하시면
          인증이 완료됩니다.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            type="button"
            variant="brand"
            onClick={handleResend}
            disabled={resending}
            className="h-10 px-4 text-sm font-semibold"
          >
            {resending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
            인증 메일 재발송
          </Button>
          <Button asChild variant="outline" className="h-10 px-4 text-sm font-semibold">
            <Link to="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
