import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PostSearchBar } from '@/features/posts/components/PostSearchBar';
import { PostList } from '@/features/posts/components/PostList';
import { usePostList } from '@/features/posts/hooks/usePostList';
import { useAuthStore } from '@/features/auth/stores/authStore';
import type { SearchParams } from '@/types/api';

type Sort = NonNullable<SearchParams['sort']>;
type SearchType = NonNullable<SearchParams['searchType']>;

export default function BoardPostListPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const { isAuthenticated } = useAuthStore();
  const [sort, setSort] = useState<Sort>('created_at');
  const [keyword, setKeyword] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('TITLE_CONTENT');

  const bid = Number(boardId);
  const params = { sort, ...(keyword && { keyword, searchType }) };

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = usePostList(
    bid,
    params,
  );

  const handleSearch = useCallback((kw: string, st: SearchType) => {
    setKeyword(kw);
    setSearchType(st);
  }, []);

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">게시판</h1>
        {isAuthenticated && (
          <Button size="sm" asChild>
            <Link to="/posts/new">
              <PenSquare className="mr-2 h-4 w-4" />
              글쓰기
            </Link>
          </Button>
        )}
      </div>

      {/* 검색 + 정렬 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <PostSearchBar onSearch={handleSearch} />
        </div>
        <Select value={sort} onValueChange={(v: Sort) => setSort(v)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">최신순</SelectItem>
            <SelectItem value="like_count">인기순</SelectItem>
          </SelectContent>
        </Select>
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
