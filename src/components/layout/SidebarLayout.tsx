import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export function SidebarLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto flex w-full max-w-[1140px] flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 py-6 lg:px-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
