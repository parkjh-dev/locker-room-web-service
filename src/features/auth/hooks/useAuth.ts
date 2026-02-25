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
    keycloak.logout({
      redirectUri: window.location.origin + '/auth/login',
    });
    clear();
  };

  return { login, logout, setTokens, setUser, clear };
}
