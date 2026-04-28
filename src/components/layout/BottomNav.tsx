import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Bell, User } from 'lucide-react';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useUnreadCount } from '@/features/notifications/hooks/useUnreadCount';
import { cn } from '@/lib/utils';

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  match: (pathname: string) => boolean;
  badge?: number;
}

export function BottomNav() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const { data: unread } = useUnreadCount();
  const unreadCount = unread?.unreadCount ?? 0;

  if (!isAuthenticated) return null;

  const items: NavItem[] = [
    {
      to: '/',
      label: '홈',
      icon: Home,
      match: (p) => p === '/',
    },
    {
      to: '/boards',
      label: '게시판',
      icon: LayoutGrid,
      match: (p) => p === '/boards' || p.startsWith('/boards/') || p.startsWith('/posts/'),
    },
    {
      to: '/notifications',
      label: '알림',
      icon: Bell,
      match: (p) => p.startsWith('/notifications'),
      badge: unreadCount,
    },
    {
      to: '/mypage',
      label: '내 라커룸',
      icon: User,
      match: (p) => p.startsWith('/mypage'),
    },
  ];

  return (
    <nav
      aria-label="모바일 네비게이션"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-brand-100/70 bg-background/90 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-xl items-stretch justify-around">
        {items.map((item) => {
          const active = item.match(location.pathname);
          const Icon = item.icon;
          return (
            <li key={item.to} className="flex-1">
              <Link
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group relative flex flex-col items-center justify-center gap-0.5 px-2 pb-1.5 pt-2 text-[11px] font-semibold transition-colors',
                  active ? 'text-brand-700' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'relative grid h-9 w-12 place-items-center rounded-full transition-all',
                    active && 'bg-brand-50',
                  )}
                >
                  <Icon
                    className={cn(
                      'h-[18px] w-[18px] transition-transform',
                      active && '-translate-y-0.5',
                    )}
                  />
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute right-1 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  ) : null}
                </span>
                <span className={cn('leading-none', active && 'text-brand-700')}>{item.label}</span>
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-6 top-0 h-0.5 rounded-b-full bg-brand-gradient"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
