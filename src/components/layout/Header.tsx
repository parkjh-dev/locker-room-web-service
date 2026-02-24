import { Link } from 'react-router-dom';
import { Bell, Menu, Search, User, LogOut, Settings, FileText, MessageSquare } from 'lucide-react';
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
import { useUiStore } from '@/stores/uiStore';

export function Header() {
  const { isAuthenticated, user } = useAuthStore();
  const { toggleSidebar } = useUiStore();

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex h-16 max-w-[1140px] items-center gap-4 px-4">
        {/* 모바일 햄버거 (로그인 시만) */}
        {isAuthenticated && (
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">메뉴 열기</span>
          </Button>
        )}

        {/* 로고 */}
        <Link to="/" className="flex items-center gap-2 whitespace-nowrap">
          <img src="/logo.png" alt="Locker Room" className="h-9 w-9" />
          <span className="hidden font-bold text-lg text-primary sm:inline">Locker Room</span>
        </Link>

        {/* 검색바 (로그인 시) */}
        {isAuthenticated && (
          <div className="hidden flex-1 justify-center sm:flex">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="검색어를 입력하세요" className="pl-9" />
            </div>
          </div>
        )}

        {/* 비로그인 시 spacer */}
        {!isAuthenticated && <div className="flex-1" />}

        {/* 우측 액션 */}
        <div className="flex items-center gap-1">
          {isAuthenticated ? (
            <>
              {/* 모바일 검색 버튼 */}
              <Button variant="ghost" size="icon" className="sm:hidden">
                <Search className="h-5 w-5" />
                <span className="sr-only">검색</span>
              </Button>

              {/* 알림 */}
              <Button variant="ghost" size="icon" asChild>
                <Link to="/notifications" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">알림</span>
                </Link>
              </Button>

              {/* 프로필 드롭다운 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">내 메뉴</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>{user?.nickname || '사용자'}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/mypage">
                      <User className="mr-2 h-4 w-4" />
                      마이페이지
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/mypage/posts">
                      <FileText className="mr-2 h-4 w-4" />
                      내가 쓴 글
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/mypage/comments">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      내가 쓴 댓글
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/mypage/edit">
                      <Settings className="mr-2 h-4 w-4" />
                      설정
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth/login">로그인</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/auth/signup">회원가입</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
