import { Link } from 'react-router-dom';

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
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-gradient shadow-soft">
                <img src="/logo.png" alt="" className="h-5 w-5" />
              </span>
              <span className="text-sm font-extrabold tracking-tight">Locker Room</span>
            </Link>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              내가 사랑하는 팀의 진짜 라커룸. 같은 유니폼을 입은 팬들과의 진짜 대화.
            </p>
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
