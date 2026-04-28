import { Link } from 'react-router-dom';

const LINKS = [
  {
    title: '서비스',
    items: [
      { label: '전체 게시판', to: '/boards' },
      { label: '공지사항', to: '/notices' },
      { label: '인기 게시글', to: '/' },
    ],
  },
  {
    title: '지원',
    items: [
      { label: '고객센터', to: '/inquiries' },
      { label: '종목/구단 요청', to: '/requests' },
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
      <div className="mx-auto max-w-[1140px] px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-3">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-gradient shadow-soft">
                <img src="/logo.png" alt="" className="h-6 w-6" />
              </span>
              <span className="text-base font-extrabold tracking-tight">Locker Room</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              내가 사랑하는 팀의 진짜 라커룸. 같은 유니폼을 입은 팬들과의 진짜 대화.
            </p>
          </div>

          {LINKS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-brand-700">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-brand-700"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-brand-100/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Locker Room. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">Made with love for true sports fans.</p>
        </div>
      </div>
    </footer>
  );
}
