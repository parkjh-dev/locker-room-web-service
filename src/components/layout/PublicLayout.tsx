import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-[1140px] flex-1 px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
