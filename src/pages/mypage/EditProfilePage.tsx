import { Link } from 'react-router-dom';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { EditProfileForm } from '@/features/mypage/components/EditProfileForm';
import { useMyProfile } from '@/features/mypage/hooks/useMyProfile';

export default function EditProfilePage() {
  const { data: profile, isLoading } = useMyProfile();

  if (isLoading) {
    return <SkeletonLoader type="post-list" count={3} />;
  }

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-3">
        <Link
          to="/mypage"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-brand-700"
        >
          <ChevronLeft className="h-4 w-4" />
          마이페이지
        </Link>
        <header className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
            Account settings
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">계정 설정</h1>
          <p className="text-sm text-muted-foreground">프로필과 보안 설정을 관리할 수 있어요.</p>
        </header>
      </div>

      <EditProfileForm profile={profile} />

      {/* Danger Zone */}
      <section className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="inline-flex items-center gap-2 text-base font-bold text-rose-700">
              <Trash2 className="h-4 w-4" />
              회원 탈퇴
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              탈퇴 시 작성한 글, 댓글, 좋아요 정보는 복구되지 않습니다.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="shrink-0 border-rose-200 text-rose-600 hover:bg-rose-50"
          >
            <Link to="/mypage/withdraw">탈퇴 진행</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
