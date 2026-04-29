import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/authStore';

export const ONBOARDING_REDIRECT_SESSION_KEY = 'lr.onboarding_redirect_shown';

/**
 * 온보딩(응원팀 등록 또는 명시적 skip) 미완료 사용자를 /onboarding/teams로 안내한다.
 * - 같은 세션에서 한 번만 안내. 사용자가 그 페이지를 떠나면 마이페이지 등 다른 곳을 자유롭게 둘러볼 수 있어야 함
 * - 응원팀의 추가 등록은 마이페이지의 응원팀 섹션에서 수행
 * - 비인증 사용자는 통과 (ProtectedRoute에서 처리)
 * - admin은 통과 (관리자는 응원팀 의미 없음)
 * - onboardingCompletedAt !== null이면 통과
 * - 자기 자신(/onboarding/*)은 무한 루프 방지를 위해 통과
 */
export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) return <>{children}</>;
  if (user.role === 'ADMIN') return <>{children}</>;
  if (user.onboardingCompletedAt !== null) return <>{children}</>;
  if (location.pathname.startsWith('/onboarding')) return <>{children}</>;

  // 같은 세션에서 이미 한 번 안내했다면 redirect 하지 않음
  const alreadyShown =
    typeof window !== 'undefined' &&
    window.sessionStorage.getItem(ONBOARDING_REDIRECT_SESSION_KEY) === '1';
  if (alreadyShown) return <>{children}</>;

  return <Navigate to="/onboarding/teams" replace />;
}
