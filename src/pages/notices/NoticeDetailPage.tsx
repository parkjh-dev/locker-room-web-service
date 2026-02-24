import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <div className="space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/notices">
          <ChevronLeft className="mr-1 h-4 w-4" />
          목록으로
        </Link>
      </Button>
      <NoticeDetail notice={notice} />
    </div>
  );
}
