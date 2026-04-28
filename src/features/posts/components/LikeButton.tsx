import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToggleLike } from '../hooks/useToggleLike';

interface LikeButtonProps {
  postId: number;
  isLiked: boolean;
  likeCount: number;
}

export function LikeButton({ postId, isLiked, likeCount }: LikeButtonProps) {
  const { mutate, isPending } = useToggleLike(postId);

  return (
    <button
      type="button"
      onClick={() => mutate()}
      disabled={isPending}
      aria-pressed={isLiked}
      className={cn(
        'group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-150 active:scale-[0.97] disabled:opacity-60',
        isLiked
          ? 'border-rose-200 bg-rose-50 text-rose-600 shadow-soft'
          : 'border-brand-200 bg-card text-foreground hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600',
      )}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-transform group-hover:scale-110',
          isLiked && 'fill-current',
        )}
      />
      <span>{likeCount}</span>
    </button>
  );
}
