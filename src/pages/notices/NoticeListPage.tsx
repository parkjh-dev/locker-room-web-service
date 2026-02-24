import { Megaphone } from 'lucide-react';
import { NoticeList } from '@/features/notices/components/NoticeList';
import { useNotices } from '@/features/notices/hooks/useNotices';

export default function NoticeListPage() {
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useNotices();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Megaphone className="h-5 w-5" />
        <h1 className="text-xl font-bold">공지사항</h1>
      </div>

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
