import { Link } from 'react-router-dom';
import { Eye, Heart, Bot, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatRelativeDate } from '@/lib/date';
import type { PostListItem as PostListItemType } from '../types/post';

interface PostListItemProps {
  post: PostListItemType;
}

export function PostListItem({ post }: PostListItemProps) {
  return (
    <Link
      to={`/posts/${post.id}`}
      className="group flex flex-col gap-2 border-b border-brand-100/60 px-2 py-3.5 transition-colors hover:bg-brand-50/40"
    >
      <div className="flex items-center gap-2">
        <h3 className="min-w-0 flex-1 truncate text-[15px] font-semibold tracking-tight text-foreground transition-colors group-hover:text-brand-700">
          {post.title}
        </h3>
        {post.isAiGenerated && (
          <Badge variant="ghost" className="shrink-0 gap-1 text-[10px]">
            <Bot className="h-3 w-3" />
            AI
          </Badge>
        )}
        {post.commentCount > 0 && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700">
            <MessageSquare className="h-3 w-3" />
            {post.commentCount}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground/80">{post.authorNickname}</span>
        <span aria-hidden="true">·</span>
        <span>{formatRelativeDate(post.createdAt)}</span>
        <span className="ml-auto flex items-center gap-2.5">
          <span className="inline-flex items-center gap-0.5">
            <Eye className="h-3 w-3" />
            {post.viewCount}
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Heart className="h-3 w-3" />
            {post.likeCount}
          </span>
        </span>
      </div>
    </Link>
  );
}
