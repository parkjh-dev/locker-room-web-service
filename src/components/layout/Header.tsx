import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, User, LogOut, FileText, MessageSquare } from 'lucide-react';
import { NotificationDropdown } from '@/features/notifications/components/NotificationDropdown';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useUiStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

export function Header() {
  const { isAuthenticated, user } = useAuthStore();
  const { logout } = useAuth();
  const { toggleSidebar } = useUiStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // 랜딩 페이지(비로그인 + '/'): transparent → 스크롤 시 glass
  const isLanding = !isAuthenticated && location.pathname === '/';

  useEffect(() => {
    if (!isLanding) return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLanding]);

  const handleSearchSubmit = () => {
    if (!searchKeyword.trim()) return;
    const boardMatch = location.pathname.match(/^\/boards\/(\d+)/);
    if (boardMatch) {
      navigate(`/boards/${boardMatch[1]}?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      navigate(`/boards?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-colors duration-200',
        isLanding && !scrolled
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-brand-100/70 bg-background/85 backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1140px] items-center gap-4 px-4">
        {/* 모바일 햄버거 (로그인 시만) */}
        {isAuthenticated && (
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">메뉴 열기</span>
          </Button>
        )}

        {/* 로고 */}
        <Link to="/" className="group flex items-center gap-2 whitespace-nowrap">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-gradient shadow-soft transition-transform group-hover:scale-105">
            <img src="/logo.png" alt="" className="h-6 w-6" loading="lazy" />
          </span>
          <span className="hidden text-base font-extrabold tracking-tight sm:inline">
            Locker Room
          </span>
        </Link>

        {/* 검색바 (로그인 시) */}
        {isAuthenticated && (
          <form
            role="search"
            className="hidden flex-1 justify-center sm:flex"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchSubmit();
            }}
          >
            <div className="relative w-full max-w-md">
              <label htmlFor="header-search" className="sr-only">
                게시글 검색
              </label>
              <Search
                aria-hidden="true"
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="header-search"
                type="search"
                placeholder="게시글, 라커룸 검색"
                className="h-10 rounded-full bg-brand-50/40 pl-9 focus-visible:bg-card"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
          </form>
        )}

        {/* 비로그인 시 spacer */}
        {!isAuthenticated && <div className="flex-1" />}

        {/* 우측 액션 */}
        <div className="flex items-center gap-1">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                onClick={() => navigate('/boards')}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">검색</span>
              </Button>

              <ThemeToggle />

              <NotificationDropdown />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-brand-50 hover:bg-brand-100"
                  >
                    <User className="h-4 w-4 text-brand-700" />
                    <span className="sr-only">내 메뉴</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5 shadow-float">
                  <DropdownMenuLabel className="px-2.5 pb-2 pt-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-gradient text-sm font-bold text-white">
                        {user?.nickname?.charAt(0) ?? 'U'}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {user?.nickname || '사용자'}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {user?.email ?? '라커룸 멤버'}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link to="/mypage">
                      <User className="mr-2 h-4 w-4" />
                      마이페이지
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link to="/mypage/posts">
                      <FileText className="mr-2 h-4 w-4" />
                      내가 쓴 글
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link to="/mypage/comments">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      내가 쓴 댓글
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="rounded-lg text-destructive focus:text-destructive"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth/login">로그인</Link>
              </Button>
              <Button size="sm" asChild className="shadow-soft">
                <Link to="/auth/signup">회원가입</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
