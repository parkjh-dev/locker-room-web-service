import { Link } from 'react-router-dom';
import { Mail, Calendar, Settings, FileText, MessageSquare, Heart, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MyTeamsSection } from './MyTeamsSection';
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

const SHORTCUTS = [
  { to: '/mypage/posts', label: '내가 쓴 글', icon: FileText },
  { to: '/mypage/comments', label: '내가 쓴 댓글', icon: MessageSquare },
  { to: '/mypage/likes', label: '좋아요한 글', icon: Heart },
  { to: '/mypage/withdraw', label: '회원 탈퇴', icon: UserMinus, danger: true },
];

export function MyProfile({ profile }: MyProfileProps) {
  return (
    <div className="space-y-6">
      {/* 프로필 헤더 카드 */}
      <section className="rounded-2xl border border-brand-100/70 bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar className="h-14 w-14 shrink-0 ring-2 ring-brand-100 sm:h-16 sm:w-16">
              {profile.profileImageUrl && (
                <AvatarImage src={profile.profileImageUrl} alt={profile.nickname} />
              )}
              <AvatarFallback className="bg-brand-gradient text-lg font-bold text-white sm:text-xl">
                {profile.nickname.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 space-y-1">
              <h2 className="truncate text-xl font-extrabold tracking-tight sm:text-2xl">
                {profile.nickname}
              </h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground sm:text-sm">
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{profile.email}</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(profile.createdAt)} 가입
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild className="shrink-0">
            <Link to="/mypage/edit">
              <Settings className="mr-1.5 h-4 w-4" />
              프로필 편집
            </Link>
          </Button>
        </div>
      </section>

      {/* 응원팀 섹션 */}
      <MyTeamsSection teams={profile.teams} />

      {/* 바로가기 그리드 */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SHORTCUTS.map(({ to, label, icon: Icon, danger }) => (
          <Link
            key={to}
            to={to}
            className={`card-interactive group rounded-2xl border bg-card p-4 text-center shadow-xs ${
              danger
                ? 'border-rose-100 hover:border-rose-200'
                : 'border-brand-100/70 hover:border-brand-200'
            }`}
          >
            <span
              className={`mx-auto grid h-10 w-10 place-items-center rounded-xl transition-transform group-hover:-translate-y-0.5 ${
                danger ? 'bg-rose-50 text-rose-600' : 'bg-brand-50 text-brand-700'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
            </span>
            <p
              className={`mt-2.5 text-sm font-semibold ${
                danger ? 'text-rose-600' : 'text-foreground'
              }`}
            >
              {label}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
