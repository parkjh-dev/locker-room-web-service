import { Link, useSearchParams } from 'react-router-dom';
import { SsoButtons } from '@/features/auth/components/SsoButtons';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col items-center justify-center px-4">
      {/* 로고 + 타이틀 */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <img src="/logo.png" alt="Locker Room" className="h-16 w-16" />
        <h1 className="text-2xl font-bold">Locker Room</h1>
        <p className="text-sm text-muted-foreground">스포츠 팬 커뮤니티</p>
      </div>

      {/* Keycloak 기본 로그인 */}
      <Button className="mb-4 w-full" onClick={() => login(undefined, returnUrl || undefined)}>
        이메일로 로그인
      </Button>

      {/* 구분선 */}
      <div className="relative my-4 w-full">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
          또는
        </span>
      </div>

      {/* SSO 버튼 */}
      <SsoButtons returnUrl={returnUrl || undefined} />

      {/* 하단 링크 */}
      <div className="mt-6 flex flex-col items-center gap-2 text-sm">
        <Link
          to="/auth/password/find"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          비밀번호를 잊으셨나요?
        </Link>
        <div className="text-muted-foreground">
          계정이 없으신가요?{' '}
          <Link
            to={`/auth/signup${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}
            className="font-medium text-primary hover:underline"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
