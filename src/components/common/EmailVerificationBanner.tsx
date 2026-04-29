import { useEffect, useState } from 'react';
import { Mail, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { authApi } from '@/features/auth/api/authApi';

const SESSION_KEY = 'lr.email_verification_banner.dismissed';

export function EmailVerificationBanner() {
  const user = useAuthStore((s) => s.user);
  const [dismissed, setDismissed] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    setDismissed(window.sessionStorage.getItem(SESSION_KEY) === '1');
  }, []);

  if (!user || user.emailVerified || dismissed) return null;

  const handleResend = async () => {
    setResending(true);
    try {
      await authApi.resendVerificationEmail();
      toast.success(`${user.email}로 인증 메일을 다시 보냈어요.`);
    } catch {
      toast.error('인증 메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setResending(false);
    }
  };

  const handleDismiss = () => {
    window.sessionStorage.setItem(SESSION_KEY, '1');
    setDismissed(true);
  };

  return (
    <div role="status" className="border-b border-amber-200 bg-amber-50/80">
      <div className="mx-auto flex w-full max-w-[1240px] items-center gap-3 px-4 py-2.5 text-sm text-amber-900">
        <Mail className="h-4 w-4 shrink-0 text-amber-600" />
        <p className="min-w-0 flex-1 truncate">
          <span className="font-semibold">이메일 인증을 완료해주세요.</span>{' '}
          <span className="hidden text-amber-800 sm:inline">
            {user.email}로 보낸 메일의 링크를 클릭하면 글쓰기·댓글이 활성화됩니다.
          </span>
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleResend}
          disabled={resending}
          className="h-7 shrink-0 border-amber-300 bg-card px-2.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
        >
          {resending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : '메일 재발송'}
        </Button>
        <button
          type="button"
          aria-label="닫기"
          onClick={handleDismiss}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-amber-700 transition-colors hover:bg-amber-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
