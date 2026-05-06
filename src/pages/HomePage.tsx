import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Megaphone,
  Pin,
  LayoutGrid,
  TrendingUp,
  Eye,
  Heart,
  ArrowRight,
  MessageSquare,
  Hash,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { formatRelativeDate } from '@/lib/date';
import { useBoards } from '@/features/boards/hooks/useBoards';
import { noticeApi } from '@/features/notices/api/noticeApi';
import { postApi } from '@/features/posts/api/postApi';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { TeamRegistrationBanner } from '@/components/common/TeamRegistrationBanner';
import {
  TopFollowedTeamsCard,
  MostActiveTeamsCard,
} from '@/features/teams/components/TeamPodiumCard';
import { LandingPage } from './LandingPage';
import type { PostListItem } from '@/features/posts/types/post';

const POPULAR_SIZE = 10;

function SectionCard({
  title,
  icon: Icon,
  to,
  children,
}: {
  title: string;
  icon: typeof Megaphone;
  to?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-brand-100/70 bg-card p-5 shadow-soft sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-700">
            <Icon className="h-4 w-4" />
          </span>
          <h2 className="text-base font-bold tracking-tight">{title}</h2>
        </div>
        {to && (
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
            <Link to={to}>
              더보기
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </div>
      {children}
    </section>
  );
}

export function NoticePreview() {
  const { data, isLoading } = useQuery({
    queryKey: ['notices', 'home'],
    queryFn: () => noticeApi.getNotices({ size: 5 }),
  });

  return (
    <SectionCard title="공지사항" icon={Megaphone} to="/notices">
      {isLoading ? (
        <SkeletonLoader type="post-list" count={3} />
      ) : (data?.items ?? []).length > 0 ? (
        <ul className="divide-y divide-brand-100/70">
          {data!.items.map((notice) => (
            <li key={notice.id}>
              <Link
                to={`/notices/${notice.id}`}
                className="flex items-center gap-2 py-2.5 text-sm transition-colors hover:text-brand-700"
              >
                {notice.isPinned && (
                  <Badge variant="secondary" className="shrink-0 gap-1 bg-brand-50 text-brand-700">
                    <Pin className="h-3 w-3" />
                    고정
                  </Badge>
                )}
                <span className="min-w-0 flex-1 truncate font-medium">{notice.title}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatRelativeDate(notice.createdAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">등록된 공지사항이 없습니다.</p>
      )}
    </SectionCard>
  );
}

function BoardGrid() {
  const { data: boards, isLoading } = useBoards();

  return (
    <SectionCard title="내 게시판" icon={LayoutGrid} to="/boards">
      {isLoading ? (
        <SkeletonLoader type="post-list" count={3} />
      ) : boards && boards.length > 0 ? (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {boards.map((board) => (
            <Link
              key={board.id}
              to={`/boards/${board.id}`}
              className="hover-lift group flex items-center gap-3 rounded-xl border border-brand-100/70 bg-gradient-to-br from-card to-brand-50/50 p-3.5 transition-colors"
            >
              {board.teamLogoUrl && (
                <img src={board.teamLogoUrl} alt="" className="h-8 w-8 shrink-0 rounded object-contain" loading="lazy" />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold group-hover:text-brand-700">
                  {board.name}
                </p>
                {board.teamName && (
                  <p className="truncate text-xs text-muted-foreground">{board.teamName}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">등록된 게시판이 없습니다.</p>
      )}
    </SectionCard>
  );
}

function PopularPostList({ posts, isLoading }: { posts?: PostListItem[]; isLoading: boolean }) {
  if (isLoading) return <SkeletonLoader type="post-list" count={5} />;
  if (!posts || posts.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">아직 인기 게시글이 없어요.</p>
    );
  }

  return (
    <ol className="divide-y divide-brand-100/70">
      {posts.map((post, idx) => (
        <li key={post.id}>
          <Link
            to={`/posts/${post.id}`}
            className="flex items-center gap-3 py-2.5 text-sm transition-colors hover:text-brand-700"
          >
            <span
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-md text-xs font-bold ${
                idx < 3 ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-700'
              }`}
            >
              {idx + 1}
            </span>
            <span className="min-w-0 flex-1 truncate font-medium">{post.title}</span>
            {post.commentCount > 0 && (
              <span className="hidden shrink-0 items-center gap-0.5 text-xs text-brand-700 sm:flex">
                <MessageSquare className="h-3 w-3" />
                {post.commentCount}
              </span>
            )}
            <span className="hidden shrink-0 items-center gap-0.5 text-xs text-muted-foreground sm:flex">
              <Eye className="h-3 w-3" />
              {post.viewCount}
            </span>
            <span className="flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground">
              <Heart className="h-3 w-3" />
              {post.likeCount}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

function PopularBoardTab({ boardId }: { boardId: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['posts', 'popular', 'board', boardId],
    queryFn: () => postApi.getList(boardId, { sort: 'likeCount', size: POPULAR_SIZE }),
  });
  return <PopularPostList posts={data?.items} isLoading={isLoading} />;
}

function PopularPosts() {
  const { data: boards } = useBoards();
  const [tab, setTab] = useState<string>('');

  useEffect(() => {
    if (!tab && boards && boards.length > 0) {
      setTab(String(boards[0].id));
    }
  }, [boards, tab]);

  return (
    <SectionCard title="인기 게시글" icon={TrendingUp}>
      <Tabs value={tab} onValueChange={setTab}>
        <div className="-mx-1 mb-4 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsList className="inline-flex h-auto w-auto gap-1 bg-transparent p-0">
            {boards?.map((board) => (
              <TabsTrigger
                key={board.id}
                value={String(board.id)}
                className="h-9 gap-1.5 rounded-full border border-brand-100/70 bg-card px-3 data-[state=active]:border-transparent data-[state=active]:bg-brand-gradient data-[state=active]:text-white data-[state=active]:shadow-glow"
              >
                <Hash className="h-3.5 w-3.5" />
                {board.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {boards?.map((board) => (
          <TabsContent key={board.id} value={String(board.id)} className="mt-0">
            <PopularBoardTab boardId={board.id} />
          </TabsContent>
        ))}
      </Tabs>
    </SectionCard>
  );
}

function AuthenticatedHome() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-brand-100/70 bg-gradient-to-br from-brand-50 via-card to-card p-6 shadow-soft sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
          Welcome back
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
          {user?.nickname ? `${user.nickname}님,` : '오늘도'} 라커룸에 오신 걸 환영해요
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          좋아하는 팀의 새 글과 인기 토픽을 확인해보세요.
        </p>
      </div>

      <TeamRegistrationBanner />
      <BoardGrid />
      <div className="grid gap-6 lg:grid-cols-2">
        <TopFollowedTeamsCard />
        <MostActiveTeamsCard />
      </div>
      <PopularPosts />
    </div>
  );
}

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <AuthenticatedHome /> : <LandingPage />;
}
