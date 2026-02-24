import keycloak from '@/lib/keycloak';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const { setTokens, setUser, clear } = useAuthStore();

  const login = (idpHint?: 'google' | 'kakao' | 'naver') => {
    keycloak.login({
      redirectUri: window.location.origin + '/auth/oauth/callback',
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
