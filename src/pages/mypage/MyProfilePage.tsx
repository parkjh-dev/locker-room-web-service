import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { MyProfile } from '@/features/mypage/components/MyProfile';
import { useMyProfile } from '@/features/mypage/hooks/useMyProfile';

export default function MyProfilePage() {
  const { data: profile, isLoading } = useMyProfile();

  if (isLoading) {
    return <SkeletonLoader type="post-list" count={3} />;
  }

  if (!profile) return null;

  return <MyProfile profile={profile} />;
}
