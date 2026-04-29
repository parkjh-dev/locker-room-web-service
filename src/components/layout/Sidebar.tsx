import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, HelpCircle, Hash } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useUiStore } from '@/stores/uiStore';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useBoards } from '@/features/boards/hooks/useBoards';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { to: '/boards', label: '전체 게시판', icon: LayoutDashboard },
  { to: '/support', label: '고객센터', icon: HelpCircle },
];

function SidebarContent() {
  const location = useLocation();
  const { data: boards, isLoading } = useBoards();

  return (
    <nav className="flex flex-col gap-1 px-3 py-5">
      {/* 메인 네비게이션 */}
      <div className="space-y-0.5">
        {NAV_LINKS.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-brand-50 font-semibold text-brand-700'
                  : 'text-foreground hover:bg-brand-50/60',
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 transition-colors',
                  isActive ? 'text-brand-700' : 'text-muted-foreground group-hover:text-brand-600',
                )}
              />
              {label}
            </Link>
          );
        })}
      </div>

      <div className="my-4 h-px bg-brand-100/70" />

      {/* 게시판 목록 */}
      <div className="px-2 pb-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          내 라커룸
        </h3>
      </div>
      {isLoading ? (
        <div className="space-y-2 px-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
          ))}
        </div>
      ) : boards && boards.length > 0 ? (
        <div className="space-y-0.5">
          {boards.map((board) => {
            const isActive = location.pathname === `/boards/${board.id}`;
            return (
              <Link
                key={board.id}
                to={`/boards/${board.id}`}
                className={cn(
                  'group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-brand-50 font-semibold text-brand-700'
                    : 'text-foreground hover:bg-brand-50/60',
                )}
              >
                <Hash
                  className={cn(
                    'h-3.5 w-3.5 transition-colors',
                    isActive
                      ? 'text-brand-700'
                      : 'text-muted-foreground group-hover:text-brand-600',
                  )}
                />
                <span className="truncate">{board.name}</span>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="px-3 text-xs text-muted-foreground">참여 중인 라커룸이 없습니다.</p>
      )}
    </nav>
  );
}

export function Sidebar() {
  const { isSidebarOpen, setSidebarOpen } = useUiStore();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (isDesktop) {
    return (
      <aside className="sticky top-16 h-[calc(100vh-4rem)] w-[260px] shrink-0 overflow-y-auto border-r border-brand-100/70 bg-background/40">
        <SidebarContent />
      </aside>
    );
  }

  return (
    <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetTitle className="flex items-center gap-2 border-b border-brand-100/70 px-4 pb-3 pt-5 text-lg font-extrabold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient">
            <img src="/logo.png" alt="" className="h-5 w-5" />
          </span>
          Locker Room
        </SheetTitle>
        <SheetDescription className="sr-only">게시판과 메뉴를 탐색하는 사이드바</SheetDescription>
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
}
