import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { SuspendModal } from './SuspendModal';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { adminApi } from '../api/adminApi';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR');
}

export function UserManagement() {
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [role, setRole] = useState<string>('');
  const [suspendTarget, setSuspendTarget] = useState<{
    userId: number;
    nickname: string;
  } | null>(null);

  const queryClient = useQueryClient();
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useAdminUsers({
    keyword: searchKeyword || undefined,
    role: role || undefined,
  });

  const { mutate: unsuspend } = useMutation({
    mutationFn: (userId: number) => adminApi.unsuspendUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('정지가 해제되었습니다.');
    },
  });

  const scrollRef = useInfiniteScroll(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  });

  const users = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="space-y-4">
      {/* 필터 */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="닉네임 또는 이메일 검색"
            className="pl-9"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setSearchKeyword(keyword)}
          />
        </div>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="역할" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="USER">USER</SelectItem>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 목록 */}
      {isLoading ? (
        <SkeletonLoader type="post-list" count={5} />
      ) : (
        <div className="rounded-lg border">
          <div className="grid grid-cols-[1fr_1fr_80px_80px_120px] gap-2 border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
            <span>닉네임</span>
            <span>이메일</span>
            <span>역할</span>
            <span>상태</span>
            <span>관리</span>
          </div>
          {users.map((user) => (
            <div
              key={user.userId}
              className="grid grid-cols-[1fr_1fr_80px_80px_120px] items-center gap-2 border-b px-4 py-2 text-sm last:border-b-0"
            >
              <span className="truncate">{user.nickname}</span>
              <span className="truncate text-muted-foreground">{user.email}</span>
              <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="w-fit">
                {user.role}
              </Badge>
              <span>
                {user.isSuspended ? (
                  <Badge variant="destructive" className="w-fit">
                    정지
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </span>
                )}
              </span>
              <div>
                {user.role !== 'ADMIN' &&
                  (user.isSuspended ? (
                    <Button variant="outline" size="sm" onClick={() => unsuspend(user.userId)}>
                      해제
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setSuspendTarget({ userId: user.userId, nickname: user.nickname })
                      }
                    >
                      정지
                    </Button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {isFetchingNextPage && <SkeletonLoader type="post-list" count={2} />}
      <div ref={scrollRef} className="h-1" />

      {suspendTarget && (
        <SuspendModal
          open={!!suspendTarget}
          onOpenChange={(open) => !open && setSuspendTarget(null)}
          userId={suspendTarget.userId}
          nickname={suspendTarget.nickname}
        />
      )}
    </div>
  );
}
