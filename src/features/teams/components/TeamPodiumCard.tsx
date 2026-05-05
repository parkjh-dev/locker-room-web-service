import { useState, type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Crown, Medal, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTeamRanking, type RankingMetric } from '../hooks/useTeamRanking';
import { useBoards } from '@/features/boards/hooks/useBoards';
import { cn } from '@/lib/utils';
import type { ActiveTeamRanking } from '../types/team';

const SPORT_FILTERS = [
  { key: 'ALL', label: '전체', emoji: '🏆' },
  { key: '축구', label: '축구', emoji: '⚽' },
  { key: '야구', label: '야구', emoji: '⚾' },
  { key: '농구', label: '농구', emoji: '🏀' },
  { key: '배구', label: '배구', emoji: '🏐' },
] as const;

const SPORT_EMOJI: Record<string, string> = {
  축구: '⚽',
  야구: '⚾',
  농구: '🏀',
  배구: '🏐',
};

interface Props {
  metric: RankingMetric;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  /** 값 + 단위 포맷터 (예: 12,400명, 23개/일) */
  formatValue: (row: ActiveTeamRanking) => { value: string; unit: string };
}

export function TeamPodiumCard({ metric, title, description, icon: Icon, formatValue }: Props) {
  const [sport, setSport] = useState<string>('ALL');
  const { data, isLoading } = useTeamRanking(metric, sport, 3);
  const { data: boards } = useBoards();
  const boardByTeamId = new Map((boards ?? []).map((b) => [b.teamId, b]));

  // 시상대 순서: [2위, 1위, 3위] — items-end로 베이스라인 정렬
  const podium = data ? [data[1], data[0], data[2]].filter(Boolean) : [];

  return (
    <section className="rounded-2xl border border-brand-100/70 bg-card p-5 shadow-soft sm:p-6">
      {/* 헤더 */}
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-700">
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-bold tracking-tight">{title}</h2>
            <p className="text-[11px] text-muted-foreground">{description}</p>
          </div>
        </div>
      </header>

      {/* 종목 탭 (pill) */}
      <div
        role="tablist"
        aria-label="종목 필터"
        className="-mx-1 mb-5 flex items-center gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {SPORT_FILTERS.map((s) => {
          const active = sport === s.key;
          return (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSport(s.key)}
              className={cn(
                'inline-flex h-8 shrink-0 items-center gap-1 rounded-full border px-3 text-xs font-semibold transition-colors',
                active
                  ? 'border-transparent bg-brand-gradient text-white shadow-glow'
                  : 'border-brand-100 bg-card text-muted-foreground hover:border-brand-200 hover:text-foreground',
              )}
            >
              <span aria-hidden="true">{s.emoji}</span>
              {s.label}
            </button>
          );
        })}
      </div>

      {/* 시상대 */}
      {isLoading || !data ? (
        <PodiumSkeleton />
      ) : podium.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          아직 통계가 충분하지 않아요.
        </p>
      ) : (
        <div className="grid grid-cols-3 items-end gap-2 sm:gap-3">
          {podium.map((row) => (
            <PodiumBlock
              key={row.team.id}
              row={row}
              board={boardByTeamId.get(row.team.id)}
              format={formatValue}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function PodiumBlock({
  row,
  board,
  format,
}: {
  row: ActiveTeamRanking;
  board?: { id: number };
  format: (row: ActiveTeamRanking) => { value: string; unit: string };
}) {
  const { value, unit } = format(row);
  const emoji = SPORT_EMOJI[row.sportName] ?? '🏆';

  // 순위별 시상대 시각 강도
  const tone =
    row.rank === 1
      ? {
          card: 'h-[200px] sm:h-[220px] bg-gradient-to-br from-amber-100 via-amber-50 to-card border-amber-300 ring-2 ring-amber-200',
          medal: 'bg-gradient-to-br from-amber-400 to-amber-500 shadow-glow',
          medalIcon: Crown,
          rankBadge: 'bg-amber-500 text-white',
          valueColor: 'text-amber-700',
        }
      : row.rank === 2
        ? {
            card: 'h-[170px] sm:h-[190px] bg-gradient-to-br from-slate-100 via-slate-50 to-card border-slate-300',
            medal: 'bg-gradient-to-br from-slate-300 to-slate-400 shadow-soft',
            medalIcon: Medal,
            rankBadge: 'bg-slate-400 text-white',
            valueColor: 'text-slate-700',
          }
        : {
            card: 'h-[150px] sm:h-[170px] bg-gradient-to-br from-orange-100 via-orange-50 to-card border-orange-300',
            medal: 'bg-gradient-to-br from-orange-400 to-orange-500 shadow-soft',
            medalIcon: Award,
            rankBadge: 'bg-orange-500 text-white',
            valueColor: 'text-orange-700',
          };

  const MedalIcon = tone.medalIcon;

  const content = (
    <article
      className={cn(
        'relative flex h-full flex-col items-center justify-end rounded-xl border px-2 pb-3 pt-7 text-center transition-transform sm:px-3',
        tone.card,
        board && 'cursor-pointer hover:-translate-y-0.5',
      )}
    >
      {/* 메달 (상단 중앙 — 카드 위로 살짝 겹치게) */}
      <span
        className={cn(
          'absolute left-1/2 -top-4 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full text-white sm:h-10 sm:w-10',
          tone.medal,
        )}
      >
        <MedalIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      </span>

      {/* 순위 뱃지 */}
      <span
        className={cn(
          'mb-1.5 inline-flex h-5 items-center rounded-full px-2 text-[10px] font-bold tabular-nums',
          tone.rankBadge,
        )}
      >
        {row.rank}위
      </span>

      {/* 팀 로고 */}
      {row.team.logoUrl ? (
        <img src={row.team.logoUrl} alt={row.team.name} className="h-8 w-8 object-contain sm:h-10 sm:w-10" loading="lazy" />
      ) : (
        <span className="text-2xl leading-none sm:text-3xl" aria-hidden="true">
          {emoji}
        </span>
      )}

      {/* 팀명 */}
      <p className="mt-1.5 line-clamp-2 text-xs font-bold leading-tight tracking-tight sm:text-sm">
        {row.team.name}
      </p>

      {/* 값 */}
      <div className="mt-1.5 flex flex-col items-center leading-none">
        <span className={cn('text-base font-extrabold tabular-nums sm:text-lg', tone.valueColor)}>
          {value}
        </span>
        <span className="mt-0.5 text-[10px] text-muted-foreground">{unit}</span>
      </div>
    </article>
  );

  return board ? (
    <Link to={`/boards/${board.id}`} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}

function PodiumSkeleton() {
  return (
    <div className="grid grid-cols-3 items-end gap-2 sm:gap-3">
      <Skeleton className="h-[170px] rounded-xl sm:h-[190px]" />
      <Skeleton className="h-[200px] rounded-xl sm:h-[220px]" />
      <Skeleton className="h-[150px] rounded-xl sm:h-[170px]" />
    </div>
  );
}

/* ────────── 두 가지 변형 — HomePage에서 바로 import 해서 쓰기 좋게 ────────── */

export function TopFollowedTeamsCard() {
  return (
    <TeamPodiumCard
      metric="FOLLOWERS"
      title="가장 많이 응원받는 팀"
      description="라커룸 응원 등록자 수 기준"
      icon={Trophy}
      formatValue={(row) => ({
        value: row.followerCount.toLocaleString(),
        unit: '명 응원중',
      })}
    />
  );
}

export function MostActiveTeamsCard() {
  return (
    <TeamPodiumCard
      metric="AVG_POSTS"
      title="가장 활발한 팀"
      description="일평균 게시글 수 기준"
      icon={Award}
      formatValue={(row) => ({
        value: row.avgPostsPerDay.toLocaleString(),
        unit: '개/일',
      })}
    />
  );
}
