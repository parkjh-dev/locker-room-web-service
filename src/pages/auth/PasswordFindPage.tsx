import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { Button } from '@/components/ui/button';

function buildResetUrl() {
  const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL;
  const realm = import.meta.env.VITE_KEYCLOAK_REALM;
  const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;
  if (!keycloakUrl || !realm) return null;
  const redirect = encodeURIComponent(window.location.origin + '/auth/login');
  return `${keycloakUrl}/realms/${realm}/login-actions/reset-credentials?client_id=${clientId}&redirect_uri=${redirect}`;
}

export default function PasswordFindPage() {
  useEffect(() => {
    const url = buildResetUrl();
    if (url) window.location.href = url;
  }, []);

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="비밀번호 재설정"
      subtitle="안전한 외부 페이지로 이동해 비밀번호를 새로 설정합니다."
      brandHeadline="잠시만요, 안전한 곳으로 이동 중"
      brandLines={[
        '비밀번호는 SSO 인증 서버에서 직접 재설정',
        '입력한 비밀번호는 라커룸 서버에 저장되지 않음',
        '재설정 완료 후 자동으로 로그인 화면으로 복귀',
      ]}
    >
      <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-white p-6 text-center shadow-soft">
        <span className="grid mx-auto h-14 w-14 place-items-center rounded-2xl bg-brand-500 text-white shadow-glow">
          <KeyRound className="h-6 w-6" />
        </span>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          자동으로 이동하지 않으면 아래 버튼을 눌러주세요.
        </p>
        <Button
          size="lg"
          className="mt-5 h-11 w-full text-sm font-semibold"
          onClick={() => {
            const url = buildResetUrl();
            if (url) window.location.href = url;
          }}
        >
          비밀번호 재설정 페이지로 이동
        </Button>
      </div>

      <Link
        to="/auth/login"
        className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" />
        로그인으로 돌아가기
      </Link>
    </AuthLayout>
  );
}
