import { Link } from 'react-router-dom';
import { Eye, Heart, Bot } from 'lucide-react';
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
      className="flex flex-col gap-1.5 border-b px-1 py-3 transition-colors hover:bg-accent/50"
    >
      {/* 제목 행 */}
      <div className="flex items-center gap-2">
        <h3 className="min-w-0 flex-1 truncate text-sm font-medium">{post.title}</h3>
        {post.isAiGenerated && (
          <Badge variant="outline" className="shrink-0 gap-1 text-xs">
            <Bot className="h-3 w-3" />
            AI
          </Badge>
        )}
        {post.commentCount > 0 && (
          <span className="shrink-0 text-xs font-medium text-primary">[{post.commentCount}]</span>
        )}
      </div>

      {/* 메타 정보 행 */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>{post.authorNickname}</span>
        <span>{formatRelativeDate(post.createdAt)}</span>
        <span className="flex items-center gap-0.5">
          <Eye className="h-3 w-3" />
          {post.viewCount}
        </span>
        <span className="flex items-center gap-0.5">
          <Heart className="h-3 w-3" />
          {post.likeCount}
        </span>
      </div>
    </Link>
  );
}
