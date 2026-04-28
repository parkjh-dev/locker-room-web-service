import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { NoticeDetail } from '@/features/notices/components/NoticeDetail';
import { useNoticeDetail } from '@/features/notices/hooks/useNoticeDetail';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';

export default function NoticeDetailPage() {
  const { noticeId } = useParams<{ noticeId: string }>();
  const nid = Number(noticeId);
  const { data: notice, isLoading } = useNoticeDetail(nid);

  if (isLoading) {
    return <SkeletonLoader type="post-detail" />;
  }

  if (!notice) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link
        to="/notices"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-brand-700"
      >
        <ChevronLeft className="h-4 w-4" />
        목록으로
      </Link>
      <NoticeDetail notice={notice} />
    </div>
  );
}
