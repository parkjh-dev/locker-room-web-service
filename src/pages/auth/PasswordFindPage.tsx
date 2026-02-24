import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PasswordFindPage() {
  useEffect(() => {
    // Keycloak의 비밀번호 재설정 페이지로 리다이렉트 시도
    const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL;
    const realm = import.meta.env.VITE_KEYCLOAK_REALM;

    if (keycloakUrl && realm) {
      window.location.href = `${keycloakUrl}/realms/${realm}/login-actions/reset-credentials?client_id=${import.meta.env.VITE_KEYCLOAK_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/login')}`;
    }
  }, []);

  // Keycloak 환경 변수가 없는 경우 (개발 환경) 안내 메시지 표시
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col items-center justify-center px-4">
      <KeyRound className="mb-4 h-16 w-16 text-muted-foreground" />
      <h1 className="mb-2 text-2xl font-bold">비밀번호 찾기</h1>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        비밀번호 재설정 페이지로 이동 중입니다.
        <br />
        자동으로 이동하지 않으면 아래 버튼을 클릭해주세요.
      </p>
      <Button
        variant="outline"
        onClick={() => {
          const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL;
          const realm = import.meta.env.VITE_KEYCLOAK_REALM;
          if (keycloakUrl && realm) {
            window.location.href = `${keycloakUrl}/realms/${realm}/login-actions/reset-credentials?client_id=${import.meta.env.VITE_KEYCLOAK_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/login')}`;
          }
        }}
      >
        비밀번호 재설정 페이지로 이동
      </Button>
      <Link
        to="/auth/login"
        className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        로그인으로 돌아가기
      </Link>
    </div>
  );
}
