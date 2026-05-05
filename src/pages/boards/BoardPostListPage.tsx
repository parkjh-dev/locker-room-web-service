import { useCallback, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PenSquare, Hash, Flame, Clock, Trophy, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostSearchBar } from '@/features/posts/components/PostSearchBar';
import { PostList } from '@/features/posts/components/PostList';
import { usePostList } from '@/features/posts/hooks/usePostList';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { boardApi } from '@/features/boards/api/boardApi';
import { TeamDashboard } from '@/features/teams/components/TeamDashboard';
import { useTeamDashboard } from '@/features/teams/hooks/useTeamDashboard';
import { cn } from '@/lib/utils';
import type { SearchParams } from '@/types/api';

type Sort = NonNullable<SearchParams['sort']>;
type SearchType = NonNullable<SearchParams['searchType']>;

export default function BoardPostListPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const [searchParams] = useSearchParams();
  const urlKeyword = searchParams.get('keyword') || '';
  const { isAuthenticated } = useAuthStore();
  const [sort, setSort] = useState<Sort>('createdAt');
  const [keyword, setKeyword] = useState(urlKeyword);
  const [searchType, setSearchType] = useState<SearchType>('TITLE_CONTENT');

  const bid = Number(boardId);
  const params = { sort, ...(keyword && { keyword, searchType }) };

  const { data: boards } = useQuery({
    queryKey: ['boards'],
    queryFn: boardApi.getBoards,
  });
  const board = boards?.find((b) => b.id === bid);
  const isTeamBoard = board?.type === 'TEAM' && board.teamId !== null;
  const { data: dashboardData } = useTeamDashboard(isTeamBoard ? board.teamId : null);

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = usePostList(
    bid,
    params,
  );

  const handleSearch = useCallback((kw: string, st: SearchType) => {
    setKeyword(kw);
    setSearchType(st);
  }, []);

  return (
    <div className="space-y-6">
      {/* 라커룸 헤더 — 팀 게시판일 경우 메타 정보 병합 */}
      <header className="relative overflow-hidden rounded-2xl border border-brand-100/70 bg-brand-gradient-soft p-6 shadow-soft sm:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blob-emerald opacity-50 blur-2xl"
        />
        <div className="relative space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {board?.teamLogoUrl ? (
                <img src={board.teamLogoUrl} alt="" className="h-12 w-12 rounded-2xl object-contain" loading="lazy" />
              ) : (
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-gradient text-white shadow-soft">
                  <Hash className="h-5 w-5" />
                </span>
              )}
              <div>
                <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-brand-700">
                  <span className="live-dot" /> Live Locker Room
                </p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-[28px]">
                  {board?.name ?? '게시판'}
                </h1>
              </div>
            </div>
            {isAuthenticated && (
              <Button asChild variant="brand" size="lg" className="shadow-glow">
                <Link to="/posts/new">
                  <PenSquare className="mr-1 h-4 w-4" />
                  글쓰기
                </Link>
              </Button>
            )}
          </div>

          {/* 팀 메타 정보 (팀 게시판 한정) */}
          {dashboardData?.team && (
            <div className="space-y-2.5 border-t border-brand-200/50 pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-brand-700 shadow-xs">
                  <Trophy className="h-3 w-3" />
                  {dashboardData.team.leagueName}
                </span>
                {dashboardData.team.founded && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {dashboardData.team.founded}년 창단
                  </span>
                )}
                {dashboardData.team.venue && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {dashboardData.team.venue}
                  </span>
                )}
              </div>
              {dashboardData.team.description && (
                <p className="text-sm leading-relaxed text-foreground/70">
                  {dashboardData.team.description}
                </p>
              )}
            </div>
          )}
        </div>
      </header>

      {/* 팀 게시판 한정 — 다음 경기 / 최근 5경기 / 순위 (HeroCard 제외) */}
      {isTeamBoard && <TeamDashboard teamId={board.teamId!} hideHero />}

      {/* 검색 + 정렬 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xl">
          <PostSearchBar onSearch={handleSearch} initialKeyword={urlKeyword} />
        </div>
        <div className="inline-flex rounded-xl border border-brand-100/70 bg-card p-1 shadow-xs">
          <SortChip
            active={sort === 'createdAt'}
            onClick={() => setSort('createdAt')}
            icon={Clock}
            label="최신"
          />
          <SortChip
            active={sort === 'likeCount'}
            onClick={() => setSort('likeCount')}
            icon={Flame}
            label="인기"
          />
        </div>
      </div>

      {/* 게시글 목록 */}
      <PostList
        data={data}
        isLoading={isLoading}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
}

function SortChip({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Flame;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors',
        active ? 'bg-brand-50 text-brand-700' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
