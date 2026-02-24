import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { userApi } from '@/features/mypage/api/userApi';
import keycloak from '@/lib/keycloak';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  const { setTokens, setUser } = useAuthStore();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Keycloak이 이미 초기화되어 있으면 토큰이 자동으로 설정됨
        if (keycloak.token && keycloak.refreshToken) {
          setTokens(keycloak.token, keycloak.refreshToken);
        }

        // 유저 정보 조회
        const res = await userApi.getMe();
        setUser(res.data as ReturnType<typeof useAuthStore.getState>['user'] & object);
        navigate(returnUrl, { replace: true });
      } catch (error: unknown) {
        const err = error as { response?: { status?: number } };
        if (err.response?.status === 404) {
          // 프로필 미완성 → 프로필 보완 페이지로
          navigate('/auth/profile/complete', { replace: true });
        } else {
          // 기타 에러 → 로그인 페이지로
          navigate('/auth/login', { replace: true });
        }
      }
    };

    processCallback();
  }, [navigate, returnUrl, setTokens, setUser]);

  return <FullScreenLoader message="로그인 처리 중..." />;
}
