import { useEffect, useState, type ReactNode } from 'react';
import keycloak from '@/lib/keycloak';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';

export function KeycloakProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const { setTokens, clear } = useAuthStore();

  useEffect(() => {
    keycloak
      .init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        pkceMethod: 'S256',
      })
      .then((authenticated) => {
        if (authenticated && keycloak.token && keycloak.refreshToken) {
          setTokens(keycloak.token, keycloak.refreshToken);
        }
        setInitialized(true);
      });

    keycloak.onTokenExpired = () => {
      keycloak
        .updateToken(30)
        .then(() => {
          if (keycloak.token && keycloak.refreshToken) {
            setTokens(keycloak.token, keycloak.refreshToken);
          }
        })
        .catch(() => {
          clear();
        });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!initialized) {
    return <FullScreenLoader />;
  }

  return <>{children}</>;
}
