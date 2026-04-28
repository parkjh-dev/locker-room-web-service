import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Download } from 'lucide-react';

interface LightboxImage {
  url: string;
  alt: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function ImageLightbox({ images, index, onClose, onIndexChange }: ImageLightboxProps) {
  const total = images.length;
  const current = images[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && index > 0) onIndexChange(index - 1);
      if (e.key === 'ArrowRight' && index < total - 1) onIndexChange(index + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, total, onClose, onIndexChange]);

  // 스크롤 잠금
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!current) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`이미지 보기 ${index + 1} / ${total}`}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      {/* 상단 바 */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 px-4 py-3">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {index + 1} / {total}
        </span>
        <div className="flex items-center gap-1">
          <a
            href={current.url}
            download={current.alt}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
            aria-label="다운로드"
          >
            <Download className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 이전/다음 버튼 */}
      {index > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onIndexChange(index - 1);
          }}
          className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 sm:left-6 sm:h-12 sm:w-12"
          aria-label="이전"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {index < total - 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onIndexChange(index + 1);
          }}
          className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 sm:right-6 sm:h-12 sm:w-12"
          aria-label="다음"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* 이미지 */}
      <img
        src={current.url}
        alt={current.alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] max-w-[92vw] animate-scale-in object-contain"
      />

      {/* 캡션 */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center px-4 pb-5">
        <p className="max-w-[80%] truncate rounded-full bg-white/10 px-4 py-1.5 text-xs text-white backdrop-blur">
          {current.alt}
        </p>
      </div>
    </div>
  );
}
