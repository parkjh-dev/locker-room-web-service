import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
    <div className="space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/mypage">
          <ArrowLeft className="mr-1 h-4 w-4" />
          마이페이지
        </Link>
      </Button>
      <EditProfileForm profile={profile} />
    </div>
  );
}
