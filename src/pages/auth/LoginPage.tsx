import { Link, useSearchParams } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { SsoButtons } from '@/features/auth/components/SsoButtons';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

  const signupHref = `/auth/signup${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`;

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="라커룸으로 돌아오신 걸 환영해요"
      subtitle="계정 정보로 로그인하고 응원팀의 새 소식을 확인하세요."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          아직 계정이 없으신가요?{' '}
          <Link to={signupHref} className="font-semibold text-brand-700 hover:underline">
            회원가입
          </Link>
        </p>
      }
    >
      <div className="space-y-5">
        <Button
          size="lg"
          className="group h-11 w-full text-sm font-semibold shadow-glow"
          onClick={() => login(undefined, returnUrl || undefined)}
        >
          <Mail className="mr-1 h-4 w-4" />
          이메일로 로그인
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>

        <Divider label="또는 SNS 계정으로" />

        <SsoButtons returnUrl={returnUrl || undefined} />

        <div className="flex items-center justify-end pt-1">
          <Link
            to="/auth/find"
            className="text-xs text-muted-foreground transition-colors hover:text-brand-700"
          >
            아이디 또는 비밀번호를 잊으셨나요?
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="relative my-2 flex items-center">
      <span className="h-px flex-1 bg-border" />
      <span className="px-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
