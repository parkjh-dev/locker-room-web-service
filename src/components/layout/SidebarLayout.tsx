import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { EmailVerificationBanner } from '@/components/common/EmailVerificationBanner';

export function SidebarLayout() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header />
      <EmailVerificationBanner />
      <div className="mx-auto flex w-full max-w-[1240px] flex-1 px-0 sm:px-4">
        <Sidebar />
        <main
          key={location.pathname}
          className="min-w-0 flex-1 animate-fade-up px-4 pb-24 pt-6 lg:px-8 lg:pb-6"
        >
          <Outlet />
        </main>
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
}
