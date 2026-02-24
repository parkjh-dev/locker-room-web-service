import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-[1140px] px-4 py-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/notices" className="hover:text-foreground transition-colors">
              공지사항
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link to="/inquiries" className="hover:text-foreground transition-colors">
              고객센터
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <span>이용약관</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="font-medium">개인정보처리방침</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Locker Room. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
