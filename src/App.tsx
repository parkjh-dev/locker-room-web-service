import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { Button } from '@/components/ui/button';
import { Toaster } from 'sonner';

// ─── 확인용 임시 페이지 (Phase 5 라우터 완성 후 삭제) ───

function DemoSwitcher() {
  const { isAuthenticated, setTokens, clear } = useAuthStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2 rounded-lg border bg-background p-3 shadow-lg">
      <span className="self-center text-xs text-muted-foreground">
        {isAuthenticated ? '🟢 로그인' : '⚪ 비로그인'}
      </span>
      <Button
        size="sm"
        variant={isAuthenticated ? 'destructive' : 'default'}
        onClick={() => (isAuthenticated ? clear() : setTokens('fake-token', 'fake-refresh'))}
      >
        {isAuthenticated ? '로그아웃' : '로그인 시뮬'}
      </Button>
    </div>
  );
}

function SampleContent({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">레이아웃 확인용 샘플 콘텐츠입니다.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-lg border p-4">
            <h3 className="font-medium">카드 {i}</h3>
            <p className="text-sm text-muted-foreground">샘플 카드 콘텐츠</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <DemoSwitcher />
        <Routes>
          {/* Public 레이아웃 */}
          <Route element={<PublicLayout />}>
            <Route index element={<SampleContent title="홈 (PublicLayout)" />} />
            <Route path="/auth/login" element={<SampleContent title="로그인 페이지" />} />
            <Route path="/notices" element={<SampleContent title="공지사항" />} />
          </Route>

          {/* Sidebar 레이아웃 */}
          <Route element={<SidebarLayout />}>
            <Route path="/boards" element={<SampleContent title="전체 게시판 (SidebarLayout)" />} />
            <Route path="/boards/:id" element={<SampleContent title="게시판 상세" />} />
            <Route path="/mypage" element={<SampleContent title="마이페이지" />} />
          </Route>

          {/* Admin 레이아웃 */}
          <Route element={<AdminLayout />}>
            <Route
              path="/admin"
              element={<SampleContent title="관리자 대시보드 (AdminLayout)" />}
            />
            <Route path="/admin/users" element={<SampleContent title="회원 관리" />} />
            <Route path="/admin/reports" element={<SampleContent title="신고 관리" />} />
          </Route>
        </Routes>
        <Toaster position="top-right" richColors closeButton />
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
