import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, Calendar, Flag, Pencil, Trash2, Bot, FileIcon, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ImageLightbox } from '@/components/common/ImageLightbox';
import { LikeButton } from './LikeButton';
import { ReportModal } from './ReportModal';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useDeletePost } from '../hooks/useDeletePost';
import type { PostDetail as PostDetailType } from '../types/post';

interface PostDetailProps {
  post: PostDetailType;
}

const IMAGE_MIME_RE = /^image\//i;
const IMAGE_EXT_RE = /\.(jpe?g|png|gif|webp|avif|bmp|svg)$/i;

function isImageFile(file: { mimeType?: string; originalName: string; url: string }) {
  if (file.mimeType && IMAGE_MIME_RE.test(file.mimeType)) return true;
  return IMAGE_EXT_RE.test(file.originalName) || IMAGE_EXT_RE.test(file.url);
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { mutateAsync: deletePost, isPending: deleting } = useDeletePost(post.id, post.boardId);

  const isOwner = user?.id === post.author.id;

  const images = post.files.filter(isImageFile);
  const documents = post.files.filter((f) => !isImageFile(f));

  const handleDelete = async () => {
    try {
      await deletePost();
      toast.success('게시글이 삭제되었습니다.');
      navigate(`/boards/${post.boardId}`, { replace: true });
    } catch {
      // axios 인터셉터에서 에러 처리
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-brand-100/70 bg-card shadow-soft">
      {/* 상단 — 라커룸 배지 + 제목 */}
      <header className="relative space-y-3 px-6 pb-6 pt-7 sm:px-8 sm:pt-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-50/70 to-transparent"
        />

        <Link
          to={`/boards/${post.boardId}`}
          className="relative inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-700 transition-colors hover:text-brand-800"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          {post.boardName}
        </Link>

        <div className="relative flex flex-wrap items-start gap-2">
          {post.isAiGenerated && (
            <Badge variant="ghost" className="gap-1">
              <Bot className="h-3 w-3" />
              AI 생성
            </Badge>
          )}
        </div>

        <h1 className="relative text-2xl font-extrabold tracking-tight sm:text-3xl">
          {post.title}
        </h1>

        <div className="relative flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Avatar className="h-7 w-7 ring-2 ring-brand-100">
              {post.author.profileImageUrl && (
                <AvatarImage src={post.author.profileImageUrl} alt={post.author.nickname} />
              )}
              <AvatarFallback className="bg-brand-gradient text-xs font-bold text-white">
                {post.author.nickname?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <span
              className={`text-sm font-semibold ${
                post.author.nickname ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {post.author.nickname || '탈퇴한 사용자'}
            </span>
            {post.author.teamName && (
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
                {post.author.teamName}
              </span>
            )}
          </span>
          <span className="inline-flex items-center gap-1 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs">
            <Eye className="h-3.5 w-3.5" />
            {post.viewCount}
          </span>
        </div>
      </header>

      <div className="h-px bg-brand-100/70" />

      {/* 본문 */}
      <div className="px-6 py-7 sm:px-8">
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">
          {post.content}
        </div>

        {/* 이미지 갤러리 */}
        {images.length > 0 && (
          <ImageGallery
            images={images.map((img) => ({ url: img.url, alt: img.originalName }))}
            onOpen={(i) => setLightboxIndex(i)}
          />
        )}

        {/* 문서 첨부 */}
        {documents.length > 0 && (
          <div className="mt-6 space-y-2 rounded-xl border border-brand-100/70 bg-brand-50/30 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-700">
              첨부파일
            </p>
            <ul className="space-y-1.5">
              {documents.map((file) => (
                <li key={file.id}>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-card px-3 py-1.5 text-sm font-medium text-brand-700 shadow-xs transition-colors hover:bg-brand-50"
                  >
                    <FileIcon className="h-4 w-4" />
                    {file.originalName}
                    <span className="text-xs text-muted-foreground">
                      ({formatFileSize(file.size)})
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="h-px bg-brand-100/70" />

      {/* 액션 버튼 */}
      <footer className="flex items-center justify-between gap-2 px-6 py-4 sm:px-8">
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
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
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
      </footer>

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

      <ReportModal open={reportOpen} onOpenChange={setReportOpen} postId={post.id} />

      {lightboxIndex !== null && (
        <ImageLightbox
          images={images.map((img) => ({ url: img.url, alt: img.originalName }))}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </article>
  );
}

function ImageGallery({
  images,
  onOpen,
}: {
  images: { url: string; alt: string }[];
  onOpen: (index: number) => void;
}) {
  const count = images.length;

  // 1장: full width 큰 이미지
  if (count === 1) {
    return (
      <div className="mt-6">
        <button
          type="button"
          onClick={() => onOpen(0)}
          className="group block w-full overflow-hidden rounded-xl border border-brand-100/70 bg-brand-50"
          aria-label={`이미지 보기: ${images[0].alt}`}
        >
          <img
            src={images[0].url}
            alt={images[0].alt}
            loading="lazy"
            className="max-h-[520px] w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        </button>
      </div>
    );
  }

  // 2장 이상: 2열 그리드 (3장째부터 +N 표시 옵션)
  const visible = images.slice(0, 4);
  const overflow = count - 4;

  return (
    <div className="mt-6 grid grid-cols-2 gap-2">
      {visible.map((img, i) => {
        const showOverflow = i === 3 && overflow > 0;
        return (
          <button
            key={img.url}
            type="button"
            onClick={() => onOpen(i)}
            className="group relative aspect-square overflow-hidden rounded-xl border border-brand-100/70 bg-brand-50"
            aria-label={`이미지 보기 ${i + 1}/${count}`}
          >
            <img
              src={img.url}
              alt={img.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            {showOverflow && (
              <span className="absolute inset-0 grid place-items-center bg-black/55 text-2xl font-bold text-white">
                +{overflow}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
