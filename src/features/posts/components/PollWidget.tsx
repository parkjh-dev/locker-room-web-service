import { useState } from 'react';
import { BarChart3, Check, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useVotePoll } from '../hooks/useVotePoll';
import { useAuthStore } from '@/features/auth/stores/authStore';
import type { Poll } from '../types/post';
import { cn } from '@/lib/utils';

interface Props {
  postId: number;
  poll: Poll;
}

function formatRemaining(expiresAt: string, now: number) {
  const ms = new Date(expiresAt).getTime() - now;
  if (ms <= 0) return '마감';
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  if (days > 0) return `${days}일 ${hours}시간 남음`;
  if (hours > 0) return `${hours}시간 ${minutes}분 남음`;
  return `${minutes}분 남음`;
}

export function PollWidget({ postId, poll }: Props) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [now] = useState(() => Date.now()); // 마운트 시점 시간 — 매 분 업데이트 불필요
  const expired = new Date(poll.expiresAt).getTime() <= now;
  const voted = poll.myVoteOptionId !== null;
  const showResults = expired || voted;
  const { mutate, isPending } = useVotePoll(postId);

  const handleVote = (optionId: number) => {
    if (!isAuthenticated) {
      toast.error('로그인 후 투표할 수 있어요.');
      return;
    }
    if (expired) {
      toast.error('마감된 투표입니다.');
      return;
    }
    if (voted || isPending) return;
    mutate(optionId);
  };

  return (
    <section
      aria-label="투표"
      className="mt-6 rounded-2xl border border-brand-100/70 bg-card p-5 shadow-soft"
    >
      <header className="mb-4 flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-50 text-brand-700">
            <BarChart3 className="h-3.5 w-3.5" />
          </span>
          <h3 className="text-sm font-bold tracking-tight">{poll.question || '투표'}</h3>
        </div>
        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold',
            expired ? 'text-muted-foreground' : 'text-brand-700',
          )}
        >
          {expired ? <Lock className="h-3 w-3" /> : null}
          {formatRemaining(poll.expiresAt, now)}
        </span>
      </header>

      <ul className="space-y-2">
        {poll.options.map((option) => {
          const percent =
            poll.totalVotes > 0 ? Math.round((option.voteCount / poll.totalVotes) * 100) : 0;
          const isMine = poll.myVoteOptionId === option.id;
          const isWinner =
            showResults &&
            poll.totalVotes > 0 &&
            option.voteCount === Math.max(...poll.options.map((o) => o.voteCount));

          if (showResults) {
            return (
              <li key={option.id}>
                <div
                  className={cn(
                    'relative overflow-hidden rounded-xl border px-3.5 py-2.5 transition-colors',
                    isMine ? 'border-brand-300 bg-brand-50/60' : 'border-brand-100/70 bg-card',
                  )}
                >
                  <div
                    aria-hidden="true"
                    className={cn(
                      'pointer-events-none absolute inset-y-0 left-0 transition-[width] duration-500 ease-out',
                      isMine ? 'bg-brand-200/60' : 'bg-brand-100/50',
                      isWinner && !isMine && 'bg-brand-100/80',
                    )}
                    style={{ width: `${percent}%` }}
                  />
                  <div className="relative flex items-center justify-between gap-3">
                    <span className="inline-flex min-w-0 items-center gap-1.5 truncate text-sm font-medium">
                      {isMine && <Check className="h-3.5 w-3.5 shrink-0 text-brand-700" />}
                      <span className="truncate">{option.text}</span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-foreground">
                      {percent}% <span className="text-muted-foreground">({option.voteCount})</span>
                    </span>
                  </div>
                </div>
              </li>
            );
          }

          return (
            <li key={option.id}>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleVote(option.id)}
                disabled={isPending}
                className="h-auto w-full justify-start rounded-xl border-brand-100/70 px-3.5 py-2.5 text-sm font-medium hover:border-brand-300 hover:bg-brand-50/60"
              >
                {isPending ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : null}
                {option.text}
              </Button>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-[11px] text-muted-foreground">
        총 {poll.totalVotes.toLocaleString()}명 참여 ·{' '}
        {voted ? '한 번 투표한 후엔 변경할 수 없어요' : '한 번 투표하면 결과를 볼 수 있어요'}
      </p>
    </section>
  );
}
