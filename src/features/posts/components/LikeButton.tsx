import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <Button
      variant="ghost"
      size="sm"
      className={cn('gap-1.5', isLiked && 'text-red-500 hover:text-red-600')}
      onClick={() => mutate()}
      disabled={isPending}
    >
      <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
      <span className="text-sm">{likeCount}</span>
    </Button>
  );
}
