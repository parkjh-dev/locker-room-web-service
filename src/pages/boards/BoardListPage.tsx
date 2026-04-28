import { Link } from 'react-router-dom';
import { Hash, LayoutList, Users, Sparkles } from 'lucide-react';
import { useBoards } from '@/features/boards/hooks/useBoards';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { EmptyState } from '@/components/common/EmptyState';

const TYPE_META: Record<string, { label: string; tone: string; gradient: string }> = {
  TEAM: {
    label: '구단 라커룸',
    tone: 'bg-brand-50 text-brand-700',
    gradient: 'from-brand-500 to-brand-teal',
  },
  COMMON: {
    label: '자유 공간',
    tone: 'bg-amber-50 text-amber-700',
    gradient: 'from-amber-400 to-orange-500',
  },
  QNA: {
    label: 'Q&A',
    tone: 'bg-sky-50 text-sky-700',
    gradient: 'from-sky-500 to-indigo-600',
  },
  NOTICE: {
    label: '공지',
    tone: 'bg-rose-50 text-rose-700',
    gradient: 'from-rose-500 to-rose-600',
  },
  NEWS: {
    label: '뉴스',
    tone: 'bg-violet-50 text-violet-700',
    gradient: 'from-violet-500 to-fuchsia-500',
  },
};

export default function BoardListPage() {
  const { data: boards, isLoading } = useBoards();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-600">
          <Sparkles className="h-3.5 w-3.5" /> Locker Rooms
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight">전체 게시판</h1>
        <p className="text-sm text-muted-foreground">
          K리그·KBO·KBL·V리그를 비롯한 모든 라커룸. 좋아하는 팀의 라커룸으로 들어가보세요.
        </p>
      </header>

      {isLoading ? (
        <SkeletonLoader type="card" count={6} />
      ) : !boards || boards.length === 0 ? (
        <EmptyState icon={LayoutList} title="게시판이 없습니다" />
      ) : (
        <ul className="stagger grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => {
            const meta = TYPE_META[board.type] ?? TYPE_META.COMMON;
            return (
              <li key={board.id}>
                <Link
                  to={`/boards/${board.id}`}
                  className="card-interactive group relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand-100/70 bg-card p-5"
                >
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${meta.gradient} opacity-15 blur-2xl transition-opacity group-hover:opacity-30`}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-soft ${meta.gradient}`}
                    >
                      <Hash className="h-5 w-5" />
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${meta.tone}`}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <h2 className="mt-4 text-base font-bold tracking-tight group-hover:text-brand-700">
                    {board.name}
                  </h2>
                  {board.teamName && (
                    <p className="mt-1 truncate text-sm text-muted-foreground">{board.teamName}</p>
                  )}
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    실시간 토론 중
                    <span className="ml-auto text-brand-700 transition-transform group-hover:translate-x-0.5">
                      입장 →
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
