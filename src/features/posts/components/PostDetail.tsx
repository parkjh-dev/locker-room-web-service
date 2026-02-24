import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, Calendar, Flag, Pencil, Trash2, Bot, FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { LikeButton } from './LikeButton';
import { ReportModal } from './ReportModal';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { postApi } from '../api/postApi';
import type { PostDetail as PostDetailType } from '../types/post';

interface PostDetailProps {
  post: PostDetailType;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function PostDetail({ post }: PostDetailProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = user?.userId === post.userId;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await postApi.delete(post.id);
      toast.success('게시글이 삭제되었습니다.');
      navigate(`/boards/${post.boardId}`, { replace: true });
    } catch {
      // axios 인터셉터에서 에러 처리
    } finally {
      setDeleting(false);
    }
  };

  return (
    <article className="space-y-4">
      {/* 헤더 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Link
            to={`/boards/${post.boardId}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            {post.boardName}
          </Link>
          {post.isAiGenerated && (
            <Badge variant="outline" className="gap-1 text-xs">
              <Bot className="h-3 w-3" />
              AI 생성
            </Badge>
          )}
        </div>
        <h1 className="text-xl font-bold">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{post.nickname}</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {post.viewCount}
          </span>
        </div>
      </div>

      <Separator />

      {/* 본문 */}
      <div className="prose prose-sm max-w-none whitespace-pre-wrap">{post.content}</div>

      {/* 첨부파일 */}
      {post.attachments.length > 0 && (
        <div className="space-y-2 rounded-lg border p-3">
          <p className="text-xs font-medium text-muted-foreground">첨부파일</p>
          <ul className="space-y-1">
            {post.attachments.map((file) => (
              <li key={file.id}>
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <FileIcon className="h-4 w-4" />
                  {file.fileName}
                  <span className="text-xs text-muted-foreground">
                    ({formatFileSize(file.fileSize)})
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Separator />

      {/* 액션 버튼 */}
      <div className="flex items-center justify-between">
        <LikeButton postId={post.id} isLiked={post.isLiked} likeCount={post.likeCount} />

        <div className="flex items-center gap-1">
          {isOwner ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/posts/${post.id}/edit`}>
                  <Pencil className="mr-1.5 h-4 w-4" />
                  수정
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                삭제
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setReportOpen(true)}>
              <Flag className="mr-1.5 h-4 w-4" />
              신고
            </Button>
          )}
        </div>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="게시글 삭제"
        description="정말 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmLabel="삭제"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
      />

      {/* 신고 모달 */}
      <ReportModal open={reportOpen} onOpenChange={setReportOpen} postId={post.id} />
    </article>
  );
}
