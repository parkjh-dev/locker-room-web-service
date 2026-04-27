import keycloak from '@/lib/keycloak';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const { setTokens, setUser, clear } = useAuthStore();

  const login = (idpHint?: 'google' | 'kakao' | 'naver', returnUrl?: string) => {
    const callbackUrl = new URL('/auth/oauth/callback', window.location.origin);
    if (returnUrl) {
      callbackUrl.searchParams.set('returnUrl', returnUrl);
    }
    keycloak.login({
      redirectUri: callbackUrl.toString(),
      ...(idpHint && { idpHint }),
    });
  };

  const logout = () => {
    // Keycloak이 초기화/인증된 상태일 때만 SSO 로그아웃 호출.
    // (개발 환경에서 KeycloakProvider 미초기화 시에도 안전하게 로컬 세션만 비움)
    if (keycloak.authenticated) {
      keycloak.logout({
        redirectUri: window.location.origin + '/auth/login',
      });
    }
    clear();
  };

  return { login, logout, setTokens, setUser, clear };
}
