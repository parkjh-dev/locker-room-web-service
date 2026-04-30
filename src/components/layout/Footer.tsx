import { Link } from 'react-router-dom';
import { toast } from 'sonner';

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function GooglePlayLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M37.564 22.124L29.96 17.74l-5.96 6.26 5.962 6.26 7.602-4.382c2.56-1.474 2.56-5.28 0-6.754z" />
      <path fill="#FF3D00" d="M29.96 17.74L7.16 4.7C6.067 4.07 4.788 4.85 4.788 6.114v.05L24 24z" />
      <path fill="#4CAF50" d="M24 24L4.788 41.836v.05c0 1.265 1.279 2.045 2.372 1.414L29.96 30.26z" />
      <path fill="#2196F3" d="M4.788 6.164v35.722L24 24z" />
    </svg>
  );
}

function notifyComingSoon(platform: 'iOS' | 'Android') {
  toast.info(`${platform} 앱은 준비 중입니다.`, {
    description: '곧 만나보실 수 있도록 열심히 준비하고 있어요.',
  });
}

const LINKS = [
  {
    title: '지원',
    items: [
      { label: '고객센터', to: '/support' },
      { label: '비밀번호 찾기', to: '/auth/password/find' },
    ],
  },
  {
    title: '법적 정보',
    items: [
      { label: '이용약관', to: '/' },
      { label: '개인정보처리방침', to: '/' },
      { label: '운영 정책', to: '/' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-brand-100/70 bg-brand-50/40">
      <div className="mx-auto max-w-[1140px] px-4 py-7">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div className="space-y-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src="/locker-room-logo-transparent.png" alt="" className="h-7 w-7" />
              <span className="text-sm font-extrabold tracking-tight">Locker Room</span>
            </Link>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              내가 사랑하는 팀의 진짜 라커룸. 같은 유니폼을 입은 팬들과의 진짜 대화.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => notifyComingSoon('iOS')}
                aria-label="iOS 앱 다운로드 (준비 중)"
                className="grid h-10 w-10 place-items-center rounded-full bg-muted transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <AppleLogo className="h-5 w-5 text-foreground" />
              </button>
              <button
                type="button"
                onClick={() => notifyComingSoon('Android')}
                aria-label="Android 앱 다운로드 (준비 중)"
                className="grid h-10 w-10 place-items-center rounded-full bg-muted transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <GooglePlayLogo className="h-5 w-5" />
              </button>
            </div>
          </div>

          {LINKS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-brand-700">
                {col.title}
              </h3>
              <ul className="mt-2.5 space-y-1.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-xs text-muted-foreground transition-colors hover:text-brand-700"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-brand-100/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Locker Room. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">Made with love for true sports fans.</p>
        </div>
      </div>
    </footer>
  );
}
