import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MessagesSquare,
  Bell,
  Trophy,
  Sparkles,
  Users,
  ShieldCheck,
  Flame,
  Heart,
  CalendarDays,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const FEATURES = [
  {
    icon: MessagesSquare,
    title: '구단별 라커룸',
    desc: '같은 팀을 응원하는 팬끼리만 모이는 전용 게시판. 잡음 없이 우리 팀 이야기만.',
    accent: 'from-brand-500/15 to-brand-500/0',
    iconBg: 'bg-brand-500',
  },
  {
    icon: Bell,
    title: '실시간 반응 알림',
    desc: '내 글에 댓글이 달리거나 좋아요가 오면 즉시 알림. 놓치는 일 없이 대화에 참여하세요.',
    accent: 'from-brand-teal/15 to-brand-teal/0',
    iconBg: 'bg-brand-teal',
  },
  {
    icon: Trophy,
    title: '승부의 순간을 함께',
    desc: 'K리그·KBO·KBL·V리그까지. 경기 직후 가장 뜨거운 라커룸 토론을 만나세요.',
    accent: 'from-brand-lime/20 to-brand-lime/0',
    iconBg: 'bg-foreground',
  },
];

const STATS = [
  { value: '4', label: '프로 종목', sub: 'K리그·KBO·KBL·V리그' },
  { value: '39', label: '구단 라커룸', sub: '공식 팀별 게시판' },
  { value: '24/7', label: '실시간 토론', sub: '경기 후에도 멈추지 않는' },
];

const SHOWCASE_TEAMS = [
  { sport: 'KBO', name: 'LG 트윈스', color: 'from-rose-500 to-rose-600' },
  { sport: 'KBO', name: 'KIA 타이거즈', color: 'from-red-600 to-red-700' },
  { sport: 'K리그', name: 'FC 서울', color: 'from-rose-600 to-amber-500' },
  { sport: 'K리그', name: '울산 HD FC', color: 'from-blue-700 to-blue-900' },
  { sport: 'KBL', name: '서울 SK 나이츠', color: 'from-red-500 to-orange-500' },
  { sport: 'KBL', name: '안양 정관장', color: 'from-red-700 to-rose-900' },
  { sport: 'V리그', name: '대한항공 점보스', color: 'from-sky-500 to-blue-600' },
  { sport: 'KBO', name: '두산 베어스', color: 'from-blue-800 to-slate-900' },
];

export function LandingPage() {
  return (
    <div className="bg-background">
      <Hero />
      <Stats />
      <Features />
      <TeamsShowcase />
      <HowItWorks />
      <FinalCta />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid bg-grid-fade opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[640px] w-[640px] -translate-x-1/2 bg-blob-emerald blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-0 h-[480px] w-[480px] bg-blob-lime blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-16 text-center sm:pt-24 lg:pt-28">
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-brand-200 bg-card/70 px-3 py-1 text-xs font-medium text-brand-700 shadow-soft backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          <span>스포츠 팬을 위한 새로운 커뮤니티 — 베타 오픈</span>
        </div>

        <h1 className="animate-fade-up delay-100 mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          내가 사랑하는 팀의
          <br />
          <span className="text-brand-gradient">진짜 라커룸</span>으로 들어오세요
        </h1>

        <p className="animate-fade-up delay-200 mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          K리그부터 KBO까지, 같은 유니폼을 입은 팬들이 모이는 곳. 승리의 환호도, 패배의 한숨도,
          우리만의 언어로 나누세요.
        </p>

        <div className="animate-fade-up delay-300 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="group h-12 w-full px-7 text-base shadow-glow sm:w-auto"
          >
            <Link to="/auth/signup">
              지금 시작하기
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 w-full border-brand-200 bg-card/70 px-7 text-base backdrop-blur hover:border-brand-300 sm:w-auto"
          >
            <Link to="/auth/login">로그인</Link>
          </Button>
        </div>

        <p className="animate-fade-up delay-300 mt-5 inline-flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
          무료 가입 · Google·Kakao·Naver 간편 로그인 지원
        </p>

        <HeroPreview />
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="animate-fade-up delay-300 relative mx-auto mt-16 max-w-3xl">
      {/* Glow under card */}
      <div
        className="absolute -inset-x-10 -bottom-6 -top-2 -z-10 rounded-[2rem] bg-brand-gradient opacity-30 blur-2xl"
        aria-hidden="true"
      />
      <div className="rounded-2xl border border-brand-100 bg-card/80 p-3 shadow-float backdrop-blur">
        <div className="rounded-xl border border-brand-100/70 bg-gradient-to-br from-card to-brand-50/40 p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white shadow-soft">
                <Flame className="h-4 w-4" />
              </span>
              <div className="text-left">
                <p className="text-sm font-bold">LG 트윈스 라커룸</p>
                <p className="text-xs text-muted-foreground">실시간 1,284명 접속 중</p>
              </div>
            </div>
            <span className="hidden rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 sm:inline-flex">
              KBO · 정규시즌
            </span>
          </div>

          <div className="mt-5 space-y-2.5 text-left">
            <PreviewRow
              tag="HOT"
              tagClass="bg-rose-100 text-rose-700"
              title="9회말 끝내기 솔로포... 진짜 미쳤다"
              meta="댓글 248 · 좋아요 1.2k"
            />
            <PreviewRow
              tag="LIVE"
              tagClass="bg-brand-500 text-white"
              title="오늘 선발 라인업 어떻게 보세요?"
              meta="댓글 87 · 5분 전"
            />
            <PreviewRow
              tag="PIN"
              tagClass="bg-brand-100 text-brand-800"
              title="[공지] 잠실 직관 모임 안내 — 토요일 18:30"
              meta="고정 게시글 · 운영진"
            />
          </div>
        </div>
      </div>

      {/* Floating chips */}
      <div className="pointer-events-none absolute -left-6 top-10 hidden animate-float-slow rounded-xl border border-brand-100 bg-card px-3 py-2 text-xs shadow-elev sm:block">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-lime/30 text-brand-800">
            <Heart className="h-3.5 w-3.5" />
          </span>
          <div className="text-left">
            <p className="font-semibold">+128 좋아요</p>
            <p className="text-[10px] text-muted-foreground">방금</p>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -right-4 bottom-8 hidden animate-float-slow rounded-xl border border-brand-100 bg-card px-3 py-2 text-xs shadow-elev [animation-delay:1.5s] sm:block">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/15 text-brand-700">
            <CalendarDays className="h-3.5 w-3.5" />
          </span>
          <div className="text-left">
            <p className="font-semibold">오늘 18:30 직관</p>
            <p className="text-[10px] text-muted-foreground">12명 참석</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewRow({
  tag,
  tagClass,
  title,
  meta,
}: {
  tag: string;
  tagClass: string;
  title: string;
  meta: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-transparent px-2 py-2 transition-colors hover:border-brand-100 hover:bg-card">
      <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold ${tagClass}`}>
        {tag}
      </span>
      <p className="min-w-0 flex-1 truncate text-sm font-medium">{title}</p>
      <p className="hidden shrink-0 text-xs text-muted-foreground sm:block">{meta}</p>
    </div>
  );
}

function Stats() {
  return (
    <section className="border-y border-brand-100/60 bg-card">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-px overflow-hidden bg-brand-100/60 sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} className="bg-card px-6 py-8 text-center">
            <p className="text-3xl font-extrabold tracking-tight text-brand-700 sm:text-4xl">
              {s.value}
            </p>
            <p className="mt-1 text-sm font-semibold">{s.label}</p>
            <p className="text-xs text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
          Why Locker Room
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          팬을 위한, 팬에 의한, 팬의 공간
        </h2>
        <p className="mt-3 text-muted-foreground">
          기존 커뮤니티의 어그로와 분쟁을 걷어내고, 진짜 팬들이 깊이 있게 대화할 수 있는 환경을
          제공합니다.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <article
            key={f.title}
            className="hover-lift group relative overflow-hidden rounded-2xl border border-brand-100 bg-card p-6 shadow-soft"
          >
            <div
              className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100 ${f.accent}`}
              aria-hidden="true"
            />
            <span
              className={`relative inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-soft ${f.iconBg}`}
            >
              <f.icon className="h-5 w-5" />
            </span>
            <h3 className="relative mt-5 text-lg font-bold">{f.title}</h3>
            <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TeamsShowcase() {
  return (
    <section className="bg-brand-gradient-soft py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Teams</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            우리 팀, 우리 라커룸
          </h2>
          <p className="mt-3 text-muted-foreground">
            K리그 12팀, KBO 10팀, KBL 10팀, V리그 7팀 — 39개 공식 라커룸이 열려 있어요.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {SHOWCASE_TEAMS.map((t) => (
            <li
              key={t.name}
              className="group hover-lift flex items-center gap-3 rounded-xl border border-white/70 bg-card/80 p-3 backdrop-blur"
            >
              <span
                aria-hidden="true"
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${t.color} text-sm font-extrabold text-white shadow-soft`}
              >
                {t.name.charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.sport}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          * 응원하는 팀이 없으신가요?{' '}
          <Link
            to="/auth/signup"
            className="font-semibold text-brand-700 underline underline-offset-2"
          >
            가입 후 종목/구단 추가 요청
          </Link>
          이 가능해요.
        </p>
      </div>
    </section>
  );
}

function HowItWorks() {
  const STEPS = [
    {
      no: '01',
      icon: Users,
      title: '간편 가입',
      desc: '이메일 또는 SNS로 30초 가입. 닉네임과 응원팀만 정하면 끝.',
    },
    {
      no: '02',
      icon: Heart,
      title: '응원팀 라커룸 입장',
      desc: '내가 선택한 팀의 전용 게시판으로 자동 안내. 진짜 팬들과 만나세요.',
    },
    {
      no: '03',
      icon: MessagesSquare,
      title: '대화에 참여',
      desc: '경기 직후 토론, 직관 모임, 굿즈 거래까지 — 라커룸에서 모든 게 시작됩니다.',
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
          How it works
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          시작하는 데 30초면 충분해요
        </h2>
      </div>

      <ol className="mt-12 grid gap-6 sm:grid-cols-3">
        {STEPS.map((s, idx) => (
          <li key={s.no} className="relative rounded-2xl border border-brand-100 bg-card p-6">
            <span className="text-xs font-extrabold tracking-widest text-brand-300">{s.no}</span>
            <span className="mt-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <s.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-bold">{s.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
            {idx < STEPS.length - 1 && (
              <ArrowRight
                aria-hidden="true"
                className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-brand-300 sm:block"
              />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-6 pb-24 pt-4">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-brand-700/40 bg-brand-gradient p-10 text-center shadow-glow sm:p-14">
        <div className="absolute inset-0 bg-grid opacity-[0.08]" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -bottom-32 left-1/2 h-80 w-[140%] -translate-x-1/2 rounded-full bg-card/15 blur-3xl"
          aria-hidden="true"
        />
        <h2 className="relative text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          이제, 진짜 팬의 라커룸으로
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-sm text-white/85 sm:text-base">
          무료로 가입하고, 좋아하는 팀의 라커룸 문을 열어보세요. 같은 마음의 팬들이 기다리고 있어요.
        </p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-12 w-full bg-card px-8 text-base font-semibold text-brand-700 shadow-elev hover:bg-card/95 sm:w-auto"
          >
            <Link to="/auth/signup">
              무료로 시작하기
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="h-12 w-full px-6 text-base text-white hover:bg-card/10 hover:text-white sm:w-auto"
          >
            <Link to="/auth/login">이미 계정이 있어요</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
