import { Link } from 'react-router-dom';
import { Mail, Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { UserProfile } from '../types/user';

interface MyProfileProps {
  profile: UserProfile;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function MyProfile({ profile }: MyProfileProps) {
  return (
    <div className="space-y-6">
      {/* 프로필 헤더 */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">{profile.nickname}</h2>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            {profile.email}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formatDate(profile.createdAt)} 가입
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/mypage/edit">
            <Settings className="mr-2 h-4 w-4" />
            설정
          </Link>
        </Button>
      </div>

      <Separator />

      {/* 응원팀 */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">응원팀</h3>
        {profile.teams.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.teams.map((team) => (
              <Badge key={`${team.sportId}-${team.teamId}`} variant="secondary" className="gap-1.5">
                {team.sportName} - {team.teamName}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">등록된 응원팀이 없습니다.</p>
        )}
      </div>

      <Separator />

      {/* 바로가기 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link
          to="/mypage/posts"
          className="rounded-lg border p-3 text-center text-sm transition-colors hover:bg-accent"
        >
          내가 쓴 글
        </Link>
        <Link
          to="/mypage/comments"
          className="rounded-lg border p-3 text-center text-sm transition-colors hover:bg-accent"
        >
          내가 쓴 댓글
        </Link>
        <Link
          to="/mypage/likes"
          className="rounded-lg border p-3 text-center text-sm transition-colors hover:bg-accent"
        >
          좋아요한 글
        </Link>
        <Link
          to="/mypage/withdraw"
          className="rounded-lg border p-3 text-center text-sm text-destructive transition-colors hover:bg-accent"
        >
          회원 탈퇴
        </Link>
      </div>
    </div>
  );
}
