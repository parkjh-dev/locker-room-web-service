import { Link } from 'react-router-dom';
import { Flag, HelpCircle, GitPullRequestArrow } from 'lucide-react';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

const cards = [
  { key: 'pendingReportCount', label: '미처리 신고', icon: Flag, to: '/admin/reports' },
  { key: 'pendingInquiryCount', label: '미답변 문의', icon: HelpCircle, to: '/admin/inquiries' },
  {
    key: 'pendingRequestCount',
    label: '미처리 요청',
    icon: GitPullRequestArrow,
    to: '/admin/requests',
  },
] as const;

export function Dashboard() {
  const { data, isLoading } = useAdminDashboard();

  if (isLoading) {
    return <SkeletonLoader type="post-list" count={3} />;
  }

  if (!data) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map(({ key, label, icon: Icon, to }) => (
        <Link
          key={key}
          to={to}
          className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{data[key]}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
