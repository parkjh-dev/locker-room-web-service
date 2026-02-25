import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Flag,
  Megaphone,
  HelpCircle,
  GitPullRequestArrow,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ADMIN_NAV = [
  { to: '/admin', label: '대시보드', icon: LayoutDashboard, exact: true },
  { to: '/admin/users', label: '회원 관리', icon: Users },
  { to: '/admin/reports', label: '신고 관리', icon: Flag },
  { to: '/admin/notices', label: '공지 관리', icon: Megaphone },
  { to: '/admin/inquiries', label: '문의 관리', icon: HelpCircle },
  { to: '/admin/requests', label: '요청 관리', icon: GitPullRequestArrow },
];

function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center gap-4 px-6">
        <Link to="/admin" className="flex items-center gap-2 font-bold text-lg">
          <img src="/logo.png" alt="Locker Room" className="h-8 w-8" loading="lazy" />
          <span className="text-primary">Admin</span>
        </Link>
        <div className="flex-1" />
        <Link
          to="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          사이트로 돌아가기
        </Link>
      </div>
    </header>
  );
}

function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-[240px] shrink-0 border-r bg-background">
      <nav className="flex flex-col gap-1 py-4">
        {ADMIN_NAV.map(({ to, label, icon: Icon, exact }) => {
          const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'mx-2 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent',
                isActive && 'bg-accent font-medium',
              )}
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="min-w-0 flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
