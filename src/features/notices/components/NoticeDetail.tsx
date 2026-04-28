import { Calendar, Pin, Megaphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { NoticeDetail as NoticeDetailType } from '../types/notice';

interface NoticeDetailProps {
  notice: NoticeDetailType;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function NoticeDetail({ notice }: NoticeDetailProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-brand-100/70 bg-card shadow-soft">
      <header className="relative space-y-3 px-6 pb-6 pt-7 sm:px-8 sm:pt-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-50/70 to-transparent"
        />
        <div className="relative flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-700">
            <Megaphone className="h-3.5 w-3.5" /> Announcement
          </span>
          {notice.isPinned && (
            <Badge variant="brand">
              <Pin className="h-3 w-3" />
              고정
            </Badge>
          )}
        </div>
        <h1 className="relative text-2xl font-extrabold tracking-tight sm:text-3xl">
          {notice.title}
        </h1>
        <div className="relative flex items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(notice.createdAt)}
          </span>
        </div>
      </header>

      <div className="h-px bg-brand-100/70" />

      <div className="px-6 py-7 sm:px-8">
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">
          {notice.content}
        </div>
      </div>
    </article>
  );
}
