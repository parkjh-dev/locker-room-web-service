import { Calendar, Eye, Pin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
    <article className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {notice.isPinned && (
            <Badge variant="destructive" className="gap-1 text-xs">
              <Pin className="h-3 w-3" />
              고정
            </Badge>
          )}
        </div>
        <h1 className="text-xl font-bold">{notice.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(notice.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {notice.viewCount}
          </span>
        </div>
      </div>

      <Separator />

      <div className="prose prose-sm max-w-none whitespace-pre-wrap">{notice.content}</div>
    </article>
  );
}
