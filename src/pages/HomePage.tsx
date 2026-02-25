import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Megaphone, Pin, LayoutGrid, TrendingUp, Eye, Heart, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { useBoards } from '@/features/boards/hooks/useBoards';
import { noticeApi } from '@/features/notices/api/noticeApi';
import { postApi } from '@/features/posts/api/postApi';

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHour = Math.floor(diffMs / 3600000);

  if (diffHour < 1) return '방금';
  if (diffHour < 24) return `${diffHour}시간 전`;
  return date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
}

function NoticePreview() {
  const { data, isLoading } = useQuery({
    queryKey: ['notices', 'home'],
    queryFn: () => noticeApi.getNotices({ size: 5 }),
  });

  if (isLoading) return <SkeletonLoader type="post-list" count={3} />;

  const notices = data?.items ?? [];

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" />
          <h2 className="font-bold">공지사항</h2>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/notices">
            더보기
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      {notices.length > 0 ? (
        <div className="rounded-lg border">
          {notices.map((notice) => (
            <Link
              key={notice.id}
              to={`/notices/${notice.id}`}
              className="flex items-center gap-2 border-b px-3 py-2.5 text-sm transition-colors last:border-b-0 hover:bg-accent/50"
            >
              {notice.isPinned && (
                <Badge variant="secondary" className="shrink-0 gap-1">
                  <Pin className="h-3 w-3" />
                  고정
                </Badge>
              )}
              <span className="min-w-0 flex-1 truncate">{notice.title}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatDate(notice.createdAt)}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">등록된 공지사항이 없습니다.</p>
      )}
    </section>
  );
}

function BoardGrid() {
  const { data: boards, isLoading } = useBoards();

  if (isLoading) return <SkeletonLoader type="post-list" count={3} />;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <LayoutGrid className="h-5 w-5 text-primary" />
        <h2 className="font-bold">게시판</h2>
      </div>
      {boards && boards.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {boards.map((board) => (
            <Link
              key={board.id}
              to={`/boards/${board.id}/posts`}
              className="flex flex-col gap-1 rounded-lg border p-3 transition-colors hover:bg-accent/50"
            >
              <span className="font-medium text-sm">{board.name}</span>
              {board.teamName && (
                <span className="truncate text-xs text-muted-foreground">{board.teamName}</span>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">등록된 게시판이 없습니다.</p>
      )}
    </section>
  );
}

function PopularPosts() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', 'popular'],
    queryFn: () => postApi.getPopular(10),
  });

  if (isLoading) return <SkeletonLoader type="post-list" count={5} />;

  if (!posts || posts.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="font-bold">인기 게시글</h2>
      </div>
      <div className="rounded-lg border">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/posts/${post.id}`}
            className="flex items-center gap-3 border-b px-3 py-2.5 text-sm transition-colors last:border-b-0 hover:bg-accent/50"
          >
            <span className="min-w-0 flex-1 truncate">{post.title}</span>
            {post.commentCount > 0 && (
              <span className="shrink-0 text-xs font-medium text-primary">
                [{post.commentCount}]
              </span>
            )}
            <span className="flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              {post.viewCount}
            </span>
            <span className="flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground">
              <Heart className="h-3 w-3" />
              {post.likeCount}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-6">
      <NoticePreview />
      <Separator />
      <BoardGrid />
      <Separator />
      <PopularPosts />
    </div>
  );
}
