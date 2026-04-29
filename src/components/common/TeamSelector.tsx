import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, X, ChevronRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { authApi } from '@/features/auth/api/authApi';
import { cn } from '@/lib/utils';
import type { SportTeamPair } from '@/types/common';
import type { Sport, Country, League, Team } from '@/features/auth/types/auth';

interface TeamSelectorProps {
  value: SportTeamPair[];
  onChange: (value: SportTeamPair[]) => void;
  error?: string;
  /**
   * 종목을 미리 잠그고 country 단계부터 시작.
   * 마이페이지에서 단일 종목의 응원팀을 추가할 때 사용.
   */
  lockedSportId?: number;
}

interface TeamLabel {
  sportName: string;
  countryName: string;
  leagueName: string;
  teamName: string;
}

type Phase = 'sport' | 'country' | 'league' | 'team';

const SPORT_ICON: Record<string, string> = {
  축구: '⚽',
  야구: '⚾',
  농구: '🏀',
  배구: '🏐',
};

const COUNTRY_FLAG: Record<string, string> = {
  KR: '🇰🇷',
  JP: '🇯🇵',
  US: '🇺🇸',
  'GB-ENG': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  ES: '🇪🇸',
  DE: '🇩🇪',
  IT: '🇮🇹',
  FR: '🇫🇷',
};

export function TeamSelector({ value, onChange, error, lockedSportId }: TeamSelectorProps) {
  const [phase, setPhase] = useState<Phase>(lockedSportId !== undefined ? 'country' : 'sport');
  const [sportId, setSportId] = useState<number | null>(lockedSportId ?? null);
  const [countryId, setCountryId] = useState<number | null>(null);
  const [leagueId, setLeagueId] = useState<number | null>(null);
  const [labelCache, setLabelCache] = useState<Record<string, TeamLabel>>({});

  // ── Queries
  const { data: sports, isLoading: sportsLoading } = useQuery<Sport[]>({
    queryKey: ['sports'],
    queryFn: authApi.getSports,
  });

  const { data: countries, isLoading: countriesLoading } = useQuery<Country[]>({
    queryKey: ['sports', sportId, 'countries'],
    queryFn: () => authApi.getCountriesBySport(sportId!),
    enabled: sportId !== null,
  });

  const { data: leagues, isLoading: leaguesLoading } = useQuery<League[]>({
    queryKey: ['sports', sportId, 'countries', countryId, 'leagues'],
    queryFn: () => authApi.getLeaguesByCountry(sportId!, countryId!),
    enabled: sportId !== null && countryId !== null,
  });

  const { data: teams, isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ['leagues', leagueId, 'teams'],
    queryFn: () => authApi.getTeamsByLeague(leagueId!),
    enabled: leagueId !== null,
  });

  const selectedSportIds = new Set(value.map((v) => v.sportId));
  const allSportsTaken = sports && sports.length > 0 && selectedSportIds.size >= sports.length;

  // 현재 단계의 path label
  const sport = sports?.find((s) => s.id === sportId);
  const country = countries?.find((c) => c.id === countryId);
  const league = leagues?.find((l) => l.id === leagueId);

  const resetAll = () => {
    setPhase(lockedSportId !== undefined ? 'country' : 'sport');
    setSportId(lockedSportId ?? null);
    setCountryId(null);
    setLeagueId(null);
  };

  const handlePickSport = (s: Sport) => {
    if (selectedSportIds.has(s.id)) return;
    setSportId(s.id);
    setCountryId(null);
    setLeagueId(null);
    setPhase('country');
  };

  const handlePickCountry = (c: Country) => {
    setCountryId(c.id);
    setLeagueId(null);
    setPhase('league');
  };

  const handlePickLeague = (l: League) => {
    setLeagueId(l.id);
    setPhase('team');
  };

  const handlePickTeam = (t: Team) => {
    if (sportId === null || sport === undefined || country === undefined || league === undefined)
      return;
    setLabelCache((prev) => ({
      ...prev,
      [`${sportId}-${t.id}`]: {
        sportName: sport.name,
        countryName: country.nameKo,
        leagueName: league.nameKo,
        teamName: t.name,
      },
    }));
    onChange([...value, { sportId, teamId: t.id }]);
    resetAll();
  };

  const handleRemoveTeam = (sId: number, tId: number) => {
    setLabelCache((prev) => {
      const next = { ...prev };
      delete next[`${sId}-${tId}`];
      return next;
    });
    onChange(value.filter((v) => !(v.sportId === sId && v.teamId === tId)));
  };

  return (
    <div className="space-y-4">
      <Picker
        phase={phase}
        sport={sport}
        country={country}
        league={league}
        onJumpTo={(p) => {
          // breadcrumb 클릭 시 해당 단계로 이동 (하위 단계는 클리어). 종목 락이면 sport 점프 차단
          if (p === 'sport') {
            if (lockedSportId !== undefined) return;
            setSportId(null);
            setCountryId(null);
            setLeagueId(null);
            setPhase('sport');
          } else if (p === 'country' && sportId !== null) {
            setCountryId(null);
            setLeagueId(null);
            setPhase('country');
          } else if (p === 'league' && countryId !== null) {
            setLeagueId(null);
            setPhase('league');
          } else if (p === 'team' && leagueId !== null) {
            setPhase('team');
          }
        }}
        allSportsTaken={!!allSportsTaken}
      >
        {phase === 'sport' && (
          <SportStep
            isLoading={sportsLoading}
            sports={sports}
            selectedSportIds={selectedSportIds}
            onPick={handlePickSport}
            allTaken={!!allSportsTaken}
          />
        )}
        {phase === 'country' && (
          <CountryStep
            isLoading={countriesLoading}
            countries={countries}
            onPick={handlePickCountry}
            onBack={() => setPhase('sport')}
          />
        )}
        {phase === 'league' && (
          <LeagueStep
            isLoading={leaguesLoading}
            leagues={leagues}
            onPick={handlePickLeague}
            onBack={() => setPhase('country')}
          />
        )}
        {phase === 'team' && (
          <TeamStep
            isLoading={teamsLoading}
            teams={teams}
            onPick={handlePickTeam}
            onBack={() => setPhase('league')}
          />
        )}
      </Picker>

      {/* 응원팀 칩 */}
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {value.map((pair) => {
            const cached = labelCache[`${pair.sportId}-${pair.teamId}`];
            const icon = cached?.sportName ? SPORT_ICON[cached.sportName] : null;
            return (
              <li key={`${pair.sportId}-${pair.teamId}`}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
                  {icon && <span className="text-base leading-none">{icon}</span>}
                  <span>{cached?.teamName ?? `팀 ${pair.teamId}`}</span>
                  {cached?.leagueName && (
                    <span className="text-[10px] font-medium text-brand-600/80">
                      · {cached.leagueName}
                    </span>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="-mr-1 h-5 w-5 rounded-full hover:bg-brand-100"
                    aria-label={`${cached?.teamName ?? '응원팀'} 제거`}
                    onClick={() => handleRemoveTeam(pair.sportId, pair.teamId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

// ────────────────────────────────────────
// Picker: breadcrumb + step 컨테이너
// ────────────────────────────────────────

function Picker({
  phase,
  sport,
  country,
  league,
  allSportsTaken,
  onJumpTo,
  children,
}: {
  phase: Phase;
  sport?: Sport;
  country?: Country;
  league?: League;
  allSportsTaken: boolean;
  onJumpTo: (p: Phase) => void;
  children: React.ReactNode;
}) {
  const stepIndex = (['sport', 'country', 'league', 'team'] as Phase[]).indexOf(phase);

  if (allSportsTaken) {
    return (
      <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-6 text-center">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white shadow-soft">
          <Check className="h-5 w-5" />
        </span>
        <p className="mt-2 text-sm font-bold text-brand-800">모든 종목 응원 완료!</p>
        <p className="text-xs text-muted-foreground">
          종목당 한 팀만 등록 가능해요. 변경하려면 아래 칩의 X를 누르세요.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-100/70 bg-card shadow-soft">
      {/* Header — breadcrumb + progress */}
      <div className="border-b border-brand-100/70 bg-gradient-to-br from-brand-50 to-card px-4 py-3">
        <nav aria-label="응원팀 선택 단계" className="flex items-center gap-1 text-xs">
          <Crumb
            label={sport?.name ?? '종목'}
            icon={sport ? SPORT_ICON[sport.name] : '🏆'}
            active={phase === 'sport'}
            done={!!sport}
            onClick={() => onJumpTo('sport')}
          />
          <ChevronRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
          <Crumb
            label={country?.nameKo ?? '국가'}
            icon={country ? COUNTRY_FLAG[country.code] : null}
            active={phase === 'country'}
            done={!!country}
            disabled={!sport}
            onClick={() => onJumpTo('country')}
          />
          <ChevronRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
          <Crumb
            label={league?.nameKo ?? '리그'}
            active={phase === 'league'}
            done={!!league}
            disabled={!country}
            onClick={() => onJumpTo('league')}
          />
          <ChevronRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
          <Crumb
            label="팀"
            active={phase === 'team'}
            done={false}
            disabled={!league}
            onClick={() => onJumpTo('team')}
          />
        </nav>
        <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-brand-100">
          <div
            className="h-full rounded-full bg-brand-gradient transition-[width] duration-500 ease-out"
            style={{ width: `${((stepIndex + 1) / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step body */}
      <div key={phase} className="animate-fade-up p-4 sm:p-5">
        {children}
      </div>
    </div>
  );
}

function Crumb({
  label,
  icon,
  active,
  done,
  disabled,
  onClick,
}: {
  label: string;
  icon?: string | null;
  active: boolean;
  done: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-semibold transition-colors',
        active && 'text-brand-700',
        done && !active && 'text-foreground hover:bg-brand-100/60',
        !active && !done && 'text-muted-foreground',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      {icon && <span className="text-sm leading-none">{icon}</span>}
      <span className="truncate max-w-[7rem]">{label}</span>
    </button>
  );
}

function StepHeading({
  title,
  description,
  onBack,
}: {
  title: string;
  description?: string;
  onBack?: () => void;
}) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-sm font-bold tracking-tight">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      {onBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="-mr-1 h-7 px-2 text-xs"
        >
          <ArrowLeft className="mr-1 h-3 w-3" />
          이전
        </Button>
      )}
    </div>
  );
}

// ────────────────────────────────────────
// Steps
// ────────────────────────────────────────

function SportStep({
  isLoading,
  sports,
  selectedSportIds,
  onPick,
  allTaken,
}: {
  isLoading: boolean;
  sports?: Sport[];
  selectedSportIds: Set<number>;
  onPick: (s: Sport) => void;
  allTaken: boolean;
}) {
  return (
    <>
      <StepHeading
        title="어떤 종목을 응원하시나요?"
        description="라커룸은 종목당 한 팀만 응원할 수 있어요."
      />
      {isLoading ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {sports?.map((sport) => {
            const taken = selectedSportIds.has(sport.id);
            return (
              <button
                key={sport.id}
                type="button"
                disabled={taken}
                onClick={() => onPick(sport)}
                className={cn(
                  'card-interactive group relative flex flex-col items-center justify-center gap-1.5 rounded-xl border bg-gradient-to-br from-brand-50 to-card p-4 text-center transition-all',
                  taken
                    ? 'cursor-not-allowed border-brand-200 opacity-60'
                    : 'border-brand-100/70 hover:border-brand-300 hover:shadow-elev',
                )}
              >
                <span className="text-3xl leading-none transition-transform group-hover:scale-110">
                  {SPORT_ICON[sport.name] ?? '🏆'}
                </span>
                <span className="text-sm font-bold">{sport.name}</span>
                {taken && (
                  <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-white shadow-soft">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
      {allTaken && (
        <p className="mt-3 inline-flex items-center gap-1 text-[11px] text-brand-700">
          <Sparkles className="h-3 w-3" />
          모든 종목에서 응원팀을 등록했어요.
        </p>
      )}
    </>
  );
}

function CountryStep({
  isLoading,
  countries,
  onPick,
  onBack,
}: {
  isLoading: boolean;
  countries?: Country[];
  onPick: (c: Country) => void;
  onBack: () => void;
}) {
  return (
    <>
      <StepHeading
        title="어느 나라 리그를 응원하시나요?"
        description="해당 종목 리그가 운영되는 국가만 표시돼요."
        onBack={onBack}
      />
      {isLoading ? (
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {countries?.map((country) => (
            <button
              key={country.id}
              type="button"
              onClick={() => onPick(country)}
              className="card-interactive group inline-flex items-center gap-3 rounded-xl border border-brand-100/70 bg-card p-3 text-left transition-all hover:border-brand-300"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-xl leading-none">
                {COUNTRY_FLAG[country.code] ?? '🌐'}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold group-hover:text-brand-700">
                {country.nameKo}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand-700" />
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function LeagueStep({
  isLoading,
  leagues,
  onPick,
  onBack,
}: {
  isLoading: boolean;
  leagues?: League[];
  onPick: (l: League) => void;
  onBack: () => void;
}) {
  return (
    <>
      <StepHeading
        title="어떤 리그를 응원하시나요?"
        description="리그는 같은 국가 내에서도 구분돼요 (예: 1부·2부)."
        onBack={onBack}
      />
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      ) : leagues && leagues.length > 0 ? (
        <ul className="space-y-2">
          {leagues.map((league) => (
            <li key={league.id}>
              <button
                type="button"
                onClick={() => onPick(league)}
                className="card-interactive group flex w-full items-center gap-3 rounded-xl border border-brand-100/70 bg-card p-3 text-left transition-all hover:border-brand-300"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-gradient text-xs font-extrabold text-white">
                  {league.nameKo.slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold group-hover:text-brand-700">
                    {league.nameKo}
                  </p>
                  {league.tier && league.tier > 1 && (
                    <p className="text-[11px] text-muted-foreground">{league.tier}부 리그</p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand-700" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-6 text-center text-sm text-muted-foreground">등록된 리그가 없어요.</p>
      )}
    </>
  );
}

function TeamStep({
  isLoading,
  teams,
  onPick,
  onBack,
}: {
  isLoading: boolean;
  teams?: Team[];
  onPick: (t: Team) => void;
  onBack: () => void;
}) {
  return (
    <>
      <StepHeading
        title="응원팀을 선택해주세요"
        description="선택한 팀의 라커룸이 활성화돼요."
        onBack={onBack}
      />
      {isLoading ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      ) : teams && teams.length > 0 ? (
        <ul className="grid max-h-[320px] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
          {teams.map((team) => (
            <li key={team.id}>
              <button
                type="button"
                onClick={() => onPick(team)}
                className="card-interactive group flex w-full items-center gap-3 rounded-xl border border-brand-100/70 bg-card p-3 text-left transition-all hover:border-brand-300"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-sm font-extrabold text-brand-700">
                  {team.logoUrl ? (
                    <img src={team.logoUrl} alt="" className="h-7 w-7 rounded" loading="lazy" />
                  ) : (
                    team.name.charAt(0)
                  )}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold group-hover:text-brand-700">
                  {team.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-6 text-center text-sm text-muted-foreground">등록된 팀이 없어요.</p>
      )}
    </>
  );
}
