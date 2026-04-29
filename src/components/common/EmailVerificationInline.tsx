import { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { authApi } from '@/features/auth/api/authApi';

interface Props {
  /** 차단된 액션명 (예: "댓글", "답글") */
  action: string;
  /** 외곽 스타일 톤 — comment(둥글고 부드럽게) | reply(작게) */
  variant?: 'comment' | 'reply';
}

export function EmailVerificationInline({ action, variant = 'comment' }: Props) {
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

  const isReply = variant === 'reply';

  return (
    <div
      className={
        isReply
          ? 'flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900'
          : 'flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-900 shadow-soft sm:items-center'
      }
    >
      <Mail
        className={
          isReply
            ? 'mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600'
            : 'mt-0.5 h-4 w-4 shrink-0 text-amber-600'
        }
      />
      <p className="min-w-0 flex-1 leading-relaxed">
        이메일 인증을 완료하면 {action}을 남길 수 있어요.
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleResend}
        disabled={resending}
        className={
          isReply
            ? 'h-7 shrink-0 border-amber-300 bg-card px-2 text-[11px] font-semibold text-amber-900 hover:bg-amber-100'
            : 'h-8 shrink-0 border-amber-300 bg-card text-xs font-semibold text-amber-900 hover:bg-amber-100'
        }
      >
        {resending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : '메일 재발송'}
      </Button>
    </div>
  );
}
