import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { Button } from '@/components/ui/button';
import { Toaster } from 'sonner';
import { router } from '@/app/router';
import { userProfile, adminProfile } from '@/mocks/data';
import type { UserTeam } from '@/types/common';

// ─── 개발용 시뮬레이터 (테스트 후 원복 예정) ───

const DEFAULT_USER_TEAMS: UserTeam[] = [
  { teamId: 101, teamName: '전북 현대 모터스', sportId: 1, sportName: '축구' },
  { teamId: 201, teamName: 'LG 트윈스', sportId: 2, sportName: '야구' },
];

const NOW = '2026-04-29T00:00:00';

interface Scenario {
  key: string;
  label: string;
  isAdmin?: boolean;
  emailVerified: boolean;
  onboardingCompletedAt: string | null;
  teams: UserTeam[];
}

const SCENARIOS: Scenario[] = [
  {
    key: 'fresh-signup',
    label: '🆕 신규 가입자 (이메일·온보딩 모두 미완료)',
    emailVerified: false,
    onboardingCompletedAt: null,
    teams: [],
  },
  {
    key: 'email-only',
    label: '✉️ 이메일만 인증 (온보딩 미완료)',
    emailVerified: true,
    onboardingCompletedAt: null,
    teams: [],
  },
  {
    key: 'skipped-onboarding',
    label: '⏩ 온보딩 건너뛰기 (이메일 미인증, 팀 없음)',
    emailVerified: false,
    onboardingCompletedAt: NOW,
    teams: [],
  },
  {
    key: 'teams-no-email',
    label: '⚽ 응원팀 등록 + 이메일 미인증',
    emailVerified: false,
    onboardingCompletedAt: NOW,
    teams: DEFAULT_USER_TEAMS,
  },
  {
    key: 'fully-active',
    label: '✅ 정상 사용자 (모두 완료)',
    emailVerified: true,
    onboardingCompletedAt: NOW,
    teams: DEFAULT_USER_TEAMS,
  },
  {
    key: 'admin',
    label: '🔴 관리자',
    isAdmin: true,
    emailVerified: true,
    onboardingCompletedAt: '2026-01-01T00:00:00',
    teams: [],
  },
];

function DevSimulator() {
  const { isAuthenticated, user, setTokens, setUser, clear } = useAuthStore();
  const [selected, setSelected] = useState<string>(SCENARIOS[0].key);

  const applyScenario = () => {
    const scenario = SCENARIOS.find((s) => s.key === selected);
    if (!scenario) return;

    if (scenario.isAdmin) {
      // mock data 동기화 (handlers가 동일 객체를 반환하므로 일관성 유지)
      Object.assign(adminProfile, {
        emailVerified: scenario.emailVerified,
        onboardingCompletedAt: scenario.onboardingCompletedAt,
        teams: [...scenario.teams],
      });
      setTokens('dev-admin-token', 'dev-refresh');
      setUser({
        id: adminProfile.id,
        email: adminProfile.email,
        emailVerified: scenario.emailVerified,
        nickname: adminProfile.nickname,
        role: 'ADMIN',
        teams: [...scenario.teams],
        onboardingCompletedAt: scenario.onboardingCompletedAt,
      });
    } else {
      Object.assign(userProfile, {
        emailVerified: scenario.emailVerified,
        onboardingCompletedAt: scenario.onboardingCompletedAt,
        teams: [...scenario.teams],
      });
      setTokens('dev-user-token', 'dev-refresh');
      setUser({
        id: userProfile.id,
        email: userProfile.email,
        emailVerified: scenario.emailVerified,
        nickname: userProfile.nickname,
        role: 'USER',
        teams: [...scenario.teams],
        onboardingCompletedAt: scenario.onboardingCompletedAt,
      });
    }
  };

  const currentScenarioLabel = SCENARIOS.find((s) => s.key === selected)?.label ?? '';

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-[300px] flex-col gap-2 rounded-lg border bg-background p-3 shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">
          {!isAuthenticated ? '⚪ 비로그인' : user?.role === 'ADMIN' ? '🔴 관리자' : '🟢 일반유저'}
        </span>
        {isAuthenticated && (
          <span className="truncate text-[10px] text-muted-foreground" title={user?.email}>
            {user?.email}
          </span>
        )}
      </div>

      {!isAuthenticated ? (
        <>
          <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            로그인 시나리오
          </label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="rounded-md border border-input bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {SCENARIOS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
          <Button size="sm" onClick={applyScenario}>
            이 시나리오로 로그인
          </Button>
        </>
      ) : (
        <>
          <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
            {currentScenarioLabel}
          </p>
          <Button size="sm" variant="outline" onClick={clear}>
            로그아웃
          </Button>
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <RouterProvider router={router} />
        {import.meta.env.DEV && <DevSimulator />}
        <Toaster position="top-right" richColors closeButton />
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
