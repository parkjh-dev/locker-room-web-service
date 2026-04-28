import { Megaphone } from 'lucide-react';
import { NoticeList } from '@/features/notices/components/NoticeList';
import { useNotices } from '@/features/notices/hooks/useNotices';

export default function NoticeListPage() {
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useNotices();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-600">
          <Megaphone className="h-3.5 w-3.5" /> Announcements
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight">공지사항</h1>
        <p className="text-sm text-muted-foreground">서비스 업데이트와 운영 정책을 확인하세요.</p>
      </header>

      <NoticeList
        data={data}
        isLoading={isLoading}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
}
