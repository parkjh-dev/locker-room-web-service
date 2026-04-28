import { Link } from 'react-router-dom';
import { Sparkles, MessagesSquare, Bell, Trophy } from 'lucide-react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  /** 우측 폼 패널의 폼 위에 표시할 작은 라벨 (예: "Welcome back") */
  eyebrow?: string;
  /** Brand 패널의 인용/카피 스타일 (좌측 패널) */
  brandHeadline?: string;
  brandLines?: string[];
  children: React.ReactNode;
  /** 폼 아래 footer 영역 (회원가입 ↔ 로그인 링크 등) */
  footer?: React.ReactNode;
}

export function AuthLayout({
  title,
  subtitle,
  eyebrow,
  brandHeadline = '내가 사랑하는 팀의 진짜 라커룸',
  brandLines = [
    '경기 직후 가장 뜨거운 토론이 시작되는 곳',
    '같은 유니폼을 입은 팬들과의 진짜 대화',
    '응원팀 전용 알림과 직관 모임까지',
  ],
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="grid min-h-[calc(100vh-4rem-1px)] grid-cols-1 bg-background lg:grid-cols-[1.05fr_1fr]">
      {/* 좌측 — 브랜드 패널 (데스크탑 전용) */}
      <aside className="relative hidden overflow-hidden bg-brand-gradient lg:block">
        <div className="absolute inset-0 bg-grid opacity-[0.08]" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -left-32 top-1/3 h-[480px] w-[480px] rounded-full bg-card/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 -bottom-24 h-[420px] w-[420px] rounded-full bg-brand-lime/30 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-card/15 backdrop-blur">
              <img src="/logo.png" alt="" className="h-7 w-7" />
            </span>
            <span className="text-lg font-bold tracking-tight">Locker Room</span>
          </Link>

          <div className="space-y-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card/15 px-3 py-1 text-xs font-medium backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Sports Fan Community
              </span>
              <h2 className="mt-5 max-w-md text-4xl font-extrabold leading-tight tracking-tight">
                {brandHeadline}
              </h2>
              <ul className="mt-6 space-y-3 text-white/90">
                {brandLines.map((line, i) => {
                  const Icon = [MessagesSquare, Bell, Trophy][i] ?? Sparkles;
                  return (
                    <li key={line} className="flex items-start gap-3 text-sm leading-relaxed">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-card/15 backdrop-blur">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span>{line}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} Locker Room. Made for true fans.
          </p>
        </div>
      </aside>

      {/* 우측 — 폼 패널 */}
      <main className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          {/* 모바일 로고 */}
          <Link to="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
            <img src="/logo.png" alt="Locker Room" className="h-9 w-9" />
            <span className="text-lg font-bold tracking-tight">Locker Room</span>
          </Link>

          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-[32px]">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-8">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
