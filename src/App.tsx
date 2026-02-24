import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { Button } from '@/components/ui/button';
import { Toaster } from 'sonner';
import { router } from '@/app/router';

// ─── 개발용 시뮬레이터 (테스트 후 원복 예정) ───

function DevSimulator() {
  const { isAuthenticated, user, setTokens, setUser, clear } = useAuthStore();

  const loginAsUser = () => {
    setTokens('dev-token', 'dev-refresh');
    setUser({ userId: 1, email: 'user@test.com', nickname: '테스트유저', role: 'USER', teams: [] });
  };

  const loginAsAdmin = () => {
    setTokens('dev-token', 'dev-refresh');
    setUser({
      userId: 99,
      email: 'admin@test.com',
      nickname: '관리자',
      role: 'ADMIN',
      teams: [],
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 rounded-lg border bg-background p-3 shadow-lg">
      <span className="text-xs font-medium text-muted-foreground">
        {!isAuthenticated ? '⚪ 비로그인' : user?.role === 'ADMIN' ? '🔴 관리자' : '🟢 일반유저'}
      </span>
      {!isAuthenticated ? (
        <div className="flex gap-2">
          <Button size="sm" onClick={loginAsUser}>
            유저 로그인
          </Button>
          <Button size="sm" variant="destructive" onClick={loginAsAdmin}>
            관리자 로그인
          </Button>
        </div>
      ) : (
        <Button size="sm" variant="outline" onClick={clear}>
          로그아웃
        </Button>
      )}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <RouterProvider router={router} />
        <DevSimulator />
        <Toaster position="top-right" richColors closeButton />
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
