import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, HelpCircle, GitPullRequestArrow, ChevronRight } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useUiStore } from '@/stores/uiStore';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useBoards } from '@/features/boards/hooks/useBoards';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { to: '/boards', label: '전체 게시판', icon: LayoutDashboard },
  { to: '/inquiries', label: '고객센터', icon: HelpCircle },
  { to: '/requests', label: '종목/구단 요청', icon: GitPullRequestArrow },
];

function SidebarContent() {
  const location = useLocation();
  const { data: boards, isLoading } = useBoards();

  return (
    <nav className="flex flex-col gap-1 py-4">
      {/* 게시판 목록 */}
      <div className="px-4 pb-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          게시판
        </h3>
      </div>
      {isLoading ? (
        <div className="space-y-2 px-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : (
        boards?.map((board) => (
          <Link
            key={board.id}
            to={`/boards/${board.id}`}
            className={cn(
              'mx-2 flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent',
              location.pathname === `/boards/${board.id}` && 'bg-accent font-medium',
            )}
          >
            {board.name}
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))
      )}

      <Separator className="my-3" />

      {/* 네비게이션 링크 */}
      {NAV_LINKS.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className={cn(
            'mx-2 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent',
            location.pathname.startsWith(to) && 'bg-accent font-medium',
          )}
        >
          <Icon className="h-4 w-4 text-muted-foreground" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function Sidebar() {
  const { isSidebarOpen, setSidebarOpen } = useUiStore();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // 데스크톱: 고정 사이드바
  if (isDesktop) {
    return (
      <aside className="w-[240px] shrink-0 border-r bg-background">
        <SidebarContent />
      </aside>
    );
  }

  // 모바일: Sheet 오버레이
  return (
    <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetTitle className="flex items-center gap-2 px-4 pt-6 text-lg font-bold text-primary">
          <img src="/logo.png" alt="Locker Room" className="h-8 w-8" loading="lazy" />
          Locker Room
        </SheetTitle>
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
}
