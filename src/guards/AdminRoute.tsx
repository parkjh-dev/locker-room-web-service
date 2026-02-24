import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/authStore';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/403" replace />;

  return <>{children}</>;
}
