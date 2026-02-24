import { Link } from 'react-router-dom';
import { ChevronRight, LayoutList } from 'lucide-react';
import { useBoards } from '@/features/boards/hooks/useBoards';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { EmptyState } from '@/components/common/EmptyState';

export default function BoardListPage() {
  const { data: boards, isLoading } = useBoards();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">전체 게시판</h1>
        <SkeletonLoader type="card" count={6} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">전체 게시판</h1>

      {!boards || boards.length === 0 ? (
        <EmptyState icon={LayoutList} title="게시판이 없습니다" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {boards.map((board) => (
            <Link
              key={board.id}
              to={`/boards/${board.id}`}
              className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent"
            >
              <div className="min-w-0 flex-1">
                <h2 className="font-medium">{board.name}</h2>
                {board.description && (
                  <p className="mt-1 truncate text-sm text-muted-foreground">{board.description}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">게시글 {board.postCount}개</p>
              </div>
              <ChevronRight className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
