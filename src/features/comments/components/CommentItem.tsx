import { useState } from 'react';
import { toast } from 'sonner';
import { MessageSquare, Pencil, Trash2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ReplyForm } from './ReplyForm';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { commentApi } from '../api/commentApi';
import { useCreateReply } from '../hooks/useCreateReply';
import { useDeleteComment } from '../hooks/useDeleteComment';
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
  return date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
}

export function CommentItem({ comment, postId, isReply = false }: CommentItemProps) {
  const { user } = useAuthStore();
  const [replyOpen, setReplyOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const { mutateAsync: createReply } = useCreateReply(postId);
  const { mutateAsync: deleteComment, isPending: deleting } = useDeleteComment(postId);
  const isOwner = user?.userId === comment.userId;

  const handleReplySubmit = async (data: CommentFormData) => {
    await createReply({ commentId: comment.id, data });
    setReplyOpen(false);
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

  // 삭제된 댓글
  if (comment.isDeleted) {
    return (
      <div className={isReply ? 'ml-8 border-l pl-4' : ''}>
        <p className="py-3 text-sm text-muted-foreground italic">삭제된 댓글입니다.</p>
        {comment.replies?.map((reply) => (
          <CommentItem key={reply.id} comment={reply} postId={postId} isReply />
        ))}
      </div>
    );
  }

  return (
    <div className={isReply ? 'ml-8 border-l pl-4' : ''}>
      <div className="py-3">
        {/* 헤더 */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">{comment.nickname}</span>
          {comment.isAiGenerated && (
            <Badge variant="outline" className="gap-0.5 text-xs">
              <Bot className="h-3 w-3" />
              AI
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
          {comment.updatedAt !== comment.createdAt && (
            <span className="text-xs text-muted-foreground">(수정됨)</span>
          )}
        </div>

        {/* 내용 */}
        {editing ? (
          <div className="mt-2 space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={2}
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
              <Button size="sm" onClick={handleEditSave} disabled={saving}>
                {saving ? '저장 중...' : '저장'}
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-1 whitespace-pre-wrap text-sm">{comment.content}</p>
        )}

        {/* 액션 */}
        {!editing && (
          <div className="mt-1 flex items-center gap-1">
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setReplyOpen(!replyOpen)}
              >
                <MessageSquare className="mr-1 h-3 w-3" />
                답글
              </Button>
            )}
            {isOwner && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setEditing(true)}
                >
                  <Pencil className="mr-1 h-3 w-3" />
                  수정
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  삭제
                </Button>
              </>
            )}
          </div>
        )}

        {/* 인라인 답글 폼 */}
        {replyOpen && (
          <ReplyForm onSubmit={handleReplySubmit} onCancel={() => setReplyOpen(false)} />
        )}
      </div>

      {/* 대댓글 */}
      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} postId={postId} isReply />
      ))}

      {/* 삭제 확인 */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="댓글 삭제"
        description="정말 이 댓글을 삭제하시겠습니까?"
        confirmLabel="삭제"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
