import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';

export function PublicLayout() {
  const location = useLocation();
  // 풀블리드(랜딩/Auth) 페이지에서는 main의 max-width/padding을 풀어 자연스럽게 표시
  const isAuthRoute =
    location.pathname.startsWith('/auth/login') ||
    location.pathname.startsWith('/auth/signup') ||
    location.pathname.startsWith('/auth/password') ||
    location.pathname.startsWith('/auth/profile/complete');
  const isFullBleed = location.pathname === '/' || isAuthRoute;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header />
      <main
        key={location.pathname}
        className={
          isFullBleed
            ? 'flex-1 animate-fade-in pb-20 lg:pb-0'
            : 'mx-auto w-full max-w-[1140px] flex-1 animate-fade-up px-4 pb-24 pt-6 lg:pb-6'
        }
      >
        <Outlet />
      </main>
      {!isAuthRoute && <Footer />}
      {!isAuthRoute && <BottomNav />}
    </div>
  );
}
