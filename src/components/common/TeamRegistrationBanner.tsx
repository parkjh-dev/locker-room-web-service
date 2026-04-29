import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, X, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/features/auth/stores/authStore';

const SESSION_KEY = 'lr.team_registration_banner.dismissed';

/**
 * 온보딩은 완료(skip)했지만 응원팀이 한 개도 없는 사용자에게 노출되는 안내 배너.
 * 어드민/응원팀 1개 이상 등록 사용자에겐 노출하지 않는다.
 */
export function TeamRegistrationBanner() {
  const user = useAuthStore((s) => s.user);
  const [dismissed, setDismissed] = useState(
    () => typeof window !== 'undefined' && window.sessionStorage.getItem(SESSION_KEY) === '1',
  );

  if (!user) return null;
  if (user.role === 'ADMIN') return null;
  if (user.onboardingCompletedAt === null) return null; // 온보딩 미진행 — Guard가 처리
  if (user.teams.length > 0) return null;
  if (dismissed) return null;

  const handleDismiss = () => {
    window.sessionStorage.setItem(SESSION_KEY, '1');
    setDismissed(true);
  };

  return (
    <section
      role="status"
      className="relative overflow-hidden rounded-2xl border border-brand-100/70 bg-gradient-to-br from-brand-50 via-card to-card p-5 shadow-soft sm:p-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-brand-gradient opacity-10 blur-2xl"
      />
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow">
          <Trophy className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="text-sm font-bold tracking-tight">응원팀을 등록하면 팀 게시판이 열려요</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            종목별로 한 팀씩 등록할 수 있어요. 등록한 팀의 전용 게시판에서 같은 팬들과 이야기해
            보세요.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Link
            to="/onboarding/teams"
            className="inline-flex h-9 shrink-0 items-center gap-1 rounded-lg bg-brand-gradient px-3.5 text-xs font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
          >
            응원팀 등록하기
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            aria-label="배너 닫기"
            onClick={handleDismiss}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-brand-50 hover:text-brand-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
