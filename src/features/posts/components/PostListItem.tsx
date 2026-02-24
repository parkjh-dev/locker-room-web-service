import { Link } from 'react-router-dom';
import { Eye, Heart, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { PostListItem as PostListItemType } from '../types/post';

interface PostListItemProps {
  post: PostListItemType;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);

  if (diffMin < 1) return '방금';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  return date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
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
        <span>{post.nickname}</span>
        <span>{formatDate(post.createdAt)}</span>
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
