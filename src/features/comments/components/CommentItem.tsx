import { useState } from 'react';
import { toast } from 'sonner';
import {
  MessageSquare,
  Pencil,
  Trash2,
  Bot,
  Heart,
  ChevronDown,
  ChevronUp,
  CornerDownRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ReplyForm } from './ReplyForm';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { commentApi } from '../api/commentApi';
import { useCreateReply } from '../hooks/useCreateReply';
import { useDeleteComment } from '../hooks/useDeleteComment';
import { cn } from '@/lib/utils';
import type { Comment } from '../types/comment';
import type { CommentFormData } from '../schemas/commentSchema';

interface CommentItemProps {
  comment: Comment;
  postId: number;
  isReply?: boolean;
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
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function renderContent(content: string) {
  return content.split(/(@[가-힣a-zA-Z0-9]+)/g).map((part, i) =>
    /^@[가-힣a-zA-Z0-9]+$/.test(part) ? (
      <span key={i} className="font-semibold text-brand-700">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function CommentItem({ comment, postId, isReply = false }: CommentItemProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [replyOpen, setReplyOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // 로컬 좋아요 (백엔드 미연동) — UI 인터랙션 강화용
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 대댓글 접기/펼치기
  const replyCount = comment.replies?.length ?? 0;
  const [repliesOpen, setRepliesOpen] = useState(replyCount > 0);

  const { mutateAsync: createReply } = useCreateReply(postId);
  const { mutateAsync: deleteComment, isPending: deleting } = useDeleteComment(postId);
  const isOwner = user?.id === comment.author.id;

  const handleReplySubmit = async (data: CommentFormData) => {
    await createReply({ commentId: comment.id, data });
    setReplyOpen(false);
    setRepliesOpen(true);
  };

  const handleEditSave = async () => {
    if (!editContent.trim()) return;
    setSaving(true);
    try {
      await commentApi.updateComment(comment.id, { content: editContent.trim() });
      toast.success('댓글이 수정되었습니다.');
      setEditing(false);
    } catch {
      // axios 인터셉터에서 에러 처리
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteComment(comment.id);
      toast.success('댓글이 삭제되었습니다.');
      setDeleteOpen(false);
    } catch {
      // axios 인터셉터에서 에러 처리
    }
  };

  const handleToggleLike = () => {
    if (!isAuthenticated) {
      toast.message('좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }
    setLiked((v) => {
      setLikeCount((c) => c + (v ? -1 : 1));
      return !v;
    });
  };

  return (
    <div className={cn('group/comment relative', isReply && 'ml-3 sm:ml-5')}>
      {/* 들여쓰기 라인 (대댓글) */}
      {isReply && (
        <span
          aria-hidden="true"
          className="absolute -left-px top-0 h-full w-0.5 rounded-full bg-brand-100"
        />
      )}

      <div
        className={cn(
          'rounded-xl px-3 py-3 transition-colors',
          isReply ? 'bg-brand-50/30 hover:bg-brand-50/60' : 'hover:bg-brand-50/30',
        )}
      >
        {/* 헤더 */}
        <div className="flex items-center gap-2 text-sm">
          <Avatar className="h-7 w-7 shrink-0 ring-1 ring-brand-100">
            {comment.author.profileImageUrl && (
              <AvatarImage src={comment.author.profileImageUrl} alt={comment.author.nickname} />
            )}
            <AvatarFallback className="text-xs font-bold">
              {comment.author.nickname?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          <span
            className={cn(
              'truncate text-sm font-semibold',
              !comment.author.nickname && 'text-muted-foreground',
            )}
          >
            {comment.author.nickname || '탈퇴한 사용자'}
          </span>
          {comment.author.teamName && !isReply && (
            <span className="hidden rounded-full bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700 sm:inline-flex">
              {comment.author.teamName}
            </span>
          )}
          {isOwner && (
            <span className="rounded-full bg-brand-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              나
            </span>
          )}
          {comment.isAiGenerated && (
            <Badge variant="ghost" className="gap-0.5 text-[10px]">
              <Bot className="h-3 w-3" />
              AI
            </Badge>
          )}
          <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
            {formatDate(comment.createdAt)}
          </span>
        </div>

        {/* 내용 */}
        {editing ? (
          <div className="mt-2.5 space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              maxLength={1000}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditing(false);
                  setEditContent(comment.content);
                }}
              >
                취소
              </Button>
              <Button variant="brand" size="sm" onClick={handleEditSave} disabled={saving}>
                {saving ? '저장 중...' : '저장'}
              </Button>
            </div>
          </div>
        ) : (
          <p className="ml-9 mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {renderContent(comment.content)}
          </p>
        )}

        {/* 액션 */}
        {!editing && (
          <div className="ml-9 mt-2 flex items-center gap-0.5 text-muted-foreground">
            <button
              type="button"
              onClick={handleToggleLike}
              aria-pressed={liked}
              className={cn(
                'group/like inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors',
                liked ? 'text-rose-600' : 'hover:text-rose-600',
              )}
            >
              <Heart
                className={cn(
                  'h-3.5 w-3.5 transition-transform group-hover/like:scale-110',
                  liked && 'fill-current',
                )}
              />
              {likeCount > 0 ? likeCount : '좋아요'}
            </button>

            {!isReply && (
              <button
                type="button"
                onClick={() => setReplyOpen((v) => !v)}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:text-brand-700"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                답글
              </button>
            )}

            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteOpen(true)}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  삭제
                </button>
              </>
            )}
          </div>
        )}

        {/* 인라인 답글 폼 */}
        {replyOpen && (
          <div className="ml-9 mt-3">
            <ReplyForm
              onSubmit={handleReplySubmit}
              onCancel={() => setReplyOpen(false)}
              replyToNickname={comment.author.nickname}
            />
          </div>
        )}
      </div>

      {/* 대댓글 토글 + 트리 */}
      {replyCount > 0 && (
        <div className="ml-3 mt-1 sm:ml-5">
          <button
            type="button"
            onClick={() => setRepliesOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-brand-700 transition-colors hover:text-brand-800"
          >
            <CornerDownRight className="h-3 w-3" />
            답글 {replyCount}개
            {repliesOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          {repliesOpen && (
            <ul className="mt-1 space-y-1">
              {comment.replies.map((reply) => (
                <li key={reply.id}>
                  <CommentItem comment={reply} postId={postId} isReply />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="댓글 삭제"
        description="정말 이 댓글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmLabel="삭제"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
