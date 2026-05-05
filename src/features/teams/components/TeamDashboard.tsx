import { useState } from 'react';
import {
  CalendarDays,
  MapPin,
  Trophy,
  History,
  Home,
  Plane,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTeamDashboard } from '../hooks/useTeamDashboard';
import { cn } from '@/lib/utils';
import type { RecentMatch, UpcomingMatch, TeamStanding, TeamProfile } from '../types/team';

interface Props {
  teamId: number;
  hideHero?: boolean;
}

export function TeamDashboard({ teamId, hideHero }: Props) {
  const { data, isLoading } = useTeamDashboard(teamId);

  if (isLoading || !data) {
    return <DashboardSkeleton hideHero={hideHero} />;
  }

  return (
    <section aria-label="팀 정보" className="space-y-3">
      {!hideHero && <HeroCard team={data.team} />}

      {/* 시즌 데이터 컨텍스트 — 다음 경기/최근 5경기/순위 모두 이 시즌 기준 */}
      <div className="flex items-center justify-end gap-1 pt-1 text-[11px] font-semibold text-muted-foreground">
        <Calendar className="h-3 w-3" />
        <span>{data.season} 시즌</span>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <NextMatchCard match={data.nextMatch} />
        <RecentMatchesCard matches={data.recentMatches} />
        <StandingCard standing={data.standing} leagueName={data.team.leagueName} />
      </div>
    </section>
  );
}

/* ────────── Hero (팀 헤더 + 팀 소개 통합) ────────── */

function HeroCard({ team }: { team: TeamProfile }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = team.description.length > 140;
  const shown =
    !isLong || expanded ? team.description : team.description.slice(0, 130).trimEnd() + '…';

  return (
    <article className="relative overflow-hidden rounded-2xl border border-brand-100/70 bg-gradient-to-br from-brand-50 via-card to-card p-5 shadow-soft sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-gradient opacity-10 blur-3xl"
      />

      <div className="relative space-y-3">
        {/* 태그형 메타 정보 */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
            <Trophy className="h-3 w-3" />
            {team.leagueName}
          </span>
          {team.founded && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {team.founded}년 창단
            </span>
          )}
          {team.venue && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {team.venue}
            </span>
          )}
        </div>

        {/* 팀 소개 */}
        <p className="text-sm leading-relaxed text-foreground/80">{shown}</p>
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 transition-colors hover:text-brand-800"
          >
            <Sparkles className="h-3 w-3" />
            {expanded ? '접기' : '더 보기'}
          </button>
        )}
      </div>
    </article>
  );
}

/* ────────── 다음 경기 (3-col 좌측, 살짝 강조) ────────── */

function NextMatchCard({ match }: { match: UpcomingMatch | null }) {
  if (!match) {
    return (
      <article className="rounded-2xl border border-brand-100/70 bg-card p-4 shadow-soft sm:p-5">
        <CardHeader icon={CalendarDays} title="다음 경기" />
        <p className="py-6 text-center text-xs text-muted-foreground">예정된 경기가 없어요.</p>
      </article>
    );
  }

  const kickoff = new Date(match.kickoffAt);
  const dDays = Math.floor(
    (kickoff.getTime() - new Date().setHours(0, 0, 0, 0)) / (24 * 60 * 60 * 1000),
  );
  const dDayLabel = dDays === 0 ? 'D-DAY' : dDays > 0 ? `D-${dDays}` : `D+${-dDays}`;
  const dateLabel = kickoff.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
  const timeLabel = kickoff.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <article className="relative overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 via-card to-card p-4 shadow-soft ring-1 ring-brand-200/40 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <CardHeader icon={CalendarDays} title="다음 경기" />
        <span className="rounded-full bg-brand-gradient px-2.5 py-0.5 text-[10px] font-bold text-white shadow-glow">
          {dDayLabel}
        </span>
      </div>

      <p className="inline-flex items-center gap-1.5 text-base font-extrabold tracking-tight">
        {match.isHome ? (
          <Home className="h-4 w-4 text-brand-700" />
        ) : (
          <Plane className="h-4 w-4 text-amber-600" />
        )}
        <span className="truncate">vs {match.opponent.name}</span>
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {dateLabel} · {timeLabel}
      </p>

      <div className="mt-3 space-y-1 border-t border-brand-100/70 pt-3 text-[11px]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">대회</span>
          <span className="truncate font-semibold">{match.competitionName}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">장소</span>
          <span className="truncate font-semibold">
            {match.isHome ? '홈' : '원정'} · {match.venue}
          </span>
        </div>
      </div>
    </article>
  );
}

/* ────────── 최근 5경기 ────────── */

function RecentMatchesCard({ matches }: { matches: RecentMatch[] }) {
  return (
    <article className="rounded-2xl border border-brand-100/70 bg-card p-4 shadow-soft sm:p-5">
      <CardHeader icon={History} title="최근 5경기" />

      {matches.length === 0 ? (
        <p className="py-6 text-center text-xs text-muted-foreground">기록된 경기가 없어요.</p>
      ) : (
        <>
          {/* 결과 폼 (W/D/L 점) */}
          <div className="mb-3 flex items-center gap-1">
            {matches.map((m) => (
              <span
                key={m.id}
                aria-label={m.result === 'WIN' ? '승' : m.result === 'DRAW' ? '무' : '패'}
                title={`${m.result === 'WIN' ? '승' : m.result === 'DRAW' ? '무' : '패'} · vs ${m.opponent.name} ${m.teamScore}-${m.opponentScore}`}
                className={cn(
                  'grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white',
                  m.result === 'WIN' && 'bg-emerald-500',
                  m.result === 'DRAW' && 'bg-amber-500',
                  m.result === 'LOSS' && 'bg-rose-500',
                )}
              >
                {m.result === 'WIN' ? '승' : m.result === 'DRAW' ? '무' : '패'}
              </span>
            ))}
          </div>

          {/* 상세 리스트 */}
          <ul className="divide-y divide-brand-100/60">
            {matches.map((m) => {
              const date = new Date(m.playedAt);
              const dateLabel = `${date.getMonth() + 1}.${date.getDate()}`;
              return (
                <li key={m.id} className="flex items-center gap-2.5 py-1.5 text-xs">
                  <span className="w-9 shrink-0 text-muted-foreground">{dateLabel}</span>
                  <span
                    className={cn(
                      'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-[9px] font-bold',
                      m.result === 'WIN' && 'bg-emerald-100 text-emerald-700',
                      m.result === 'DRAW' && 'bg-amber-100 text-amber-700',
                      m.result === 'LOSS' && 'bg-rose-100 text-rose-700',
                    )}
                  >
                    {m.result === 'WIN' ? '승' : m.result === 'DRAW' ? '무' : '패'}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {m.isHome ? 'vs' : '@'} {m.opponent.name}
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums">
                    {m.teamScore}-{m.opponentScore}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </article>
  );
}

/* ────────── 순위 ────────── */

function StandingCard({
  standing,
  leagueName,
}: {
  standing: TeamStanding | null;
  leagueName: string;
}) {
  if (!standing) {
    return (
      <article className="rounded-2xl border border-brand-100/70 bg-card p-4 shadow-soft sm:p-5">
        <CardHeader icon={Trophy} title="현재 순위" />
        <p className="py-6 text-center text-xs text-muted-foreground">순위 정보가 없어요.</p>
      </article>
    );
  }

  const winRate =
    standing.matchesPlayed > 0 ? Math.round((standing.wins / standing.matchesPlayed) * 100) : 0;

  return (
    <article className="rounded-2xl border border-brand-100/70 bg-card p-4 shadow-soft sm:p-5">
      <CardHeader icon={Trophy} title="현재 순위" subtitle={leagueName} />

      <div className="mb-3 flex items-end gap-2">
        <span className="text-3xl font-extrabold leading-none tracking-tight text-brand-700">
          {standing.rank}
        </span>
        <span className="pb-1 text-xs text-muted-foreground">위 / {standing.totalTeams}팀</span>
      </div>

      <dl className="grid grid-cols-3 gap-2 text-center text-xs">
        <Stat label="승" value={standing.wins} tone="win" />
        <Stat label="무" value={standing.draws} tone="draw" />
        <Stat label="패" value={standing.losses} tone="loss" />
      </dl>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-brand-100/60 pt-3 text-[11px]">
        {standing.points > 0 && <Row label="승점" value={standing.points} />}
        <Row label="경기수" value={standing.matchesPlayed} />
        {standing.goalsFor + standing.goalsAgainst > 0 && (
          <Row
            label="득실"
            value={`${standing.goalDifference > 0 ? '+' : ''}${standing.goalDifference}`}
          />
        )}
        <Row label="승률" value={`${winRate}%`} />
      </div>
    </article>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'win' | 'draw' | 'loss';
}) {
  return (
    <div
      className={cn(
        'rounded-lg px-1.5 py-2',
        tone === 'win' && 'bg-emerald-50 text-emerald-700',
        tone === 'draw' && 'bg-amber-50 text-amber-700',
        tone === 'loss' && 'bg-rose-50 text-rose-700',
      )}
    >
      <dt className="text-[10px] font-semibold opacity-80">{label}</dt>
      <dd className="text-base font-extrabold leading-none">{value}</dd>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-semibold tabular-nums">{value}</dd>
    </>
  );
}

/* ────────── 공통 ────────── */

function CardHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Trophy;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="flex items-center gap-2">
      <span className="grid h-6 w-6 place-items-center rounded-md bg-brand-50 text-brand-700">
        <Icon className="h-3 w-3" />
      </span>
      <h3 className="text-xs font-bold tracking-tight">{title}</h3>
      {subtitle && (
        <span className="ml-auto text-[10px] font-medium text-muted-foreground">{subtitle}</span>
      )}
    </header>
  );
}

function DashboardSkeleton({ hideHero }: { hideHero?: boolean }) {
  return (
    <section className="space-y-3">
      {!hideHero && <Skeleton className="h-28 rounded-2xl" />}
      <div className="grid gap-3 lg:grid-cols-3">
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
      </div>
    </section>
  );
}
