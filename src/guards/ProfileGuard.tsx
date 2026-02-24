import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/features/mypage/api/userApi';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { useAuthStore } from '@/features/auth/stores/authStore';

// TODO: 백엔드 연동 후 DEV_MODE 제거
const DEV_MODE = !import.meta.env.VITE_API_BASE_URL;

export function ProfileGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  const { isLoading, error } = useQuery({
    queryKey: ['users', 'me'],
    queryFn: () => userApi.getMe(),
    enabled: isAuthenticated && !DEV_MODE,
    retry: false,
  });

  if (!isAuthenticated) return <>{children}</>;
  if (DEV_MODE) return <>{children}</>;
  if (isLoading) return <FullScreenLoader />;

  if (error && (error as { response?: { status?: number } }).response?.status === 404) {
    return <Navigate to="/auth/profile/complete" replace />;
  }

  return <>{children}</>;
}
