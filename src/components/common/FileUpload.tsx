import { useRef, useState } from 'react';
import { Upload, X, FileIcon, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { cn } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_FILE_COUNT = 5;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_TYPES = [...IMAGE_TYPES, 'application/pdf', 'text/plain'];

interface UploadedFile {
  id: number;
  originalName: string;
  url: string;
  size: number;
  mimeType?: string;
}

type TargetType = 'POST' | 'COMMENT' | 'INQUIRY' | 'NOTICE' | 'PROFILE';

interface FileUploadProps {
  value: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  targetType: TargetType;
  maxCount?: number;
}

function isImage(file: UploadedFile) {
  if (file.mimeType) return IMAGE_TYPES.includes(file.mimeType);
  return /\.(jpe?g|png|gif|webp)$/i.test(file.originalName);
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function FileUpload({ value, onChange, targetType, maxCount = MAX_FILE_COUNT }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const uploadFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    if (arr.length === 0) return;

    if (value.length + arr.length > maxCount) {
      toast.error(`파일은 최대 ${maxCount}개까지 첨부할 수 있습니다.`);
      return;
    }

    for (const file of arr) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: 허용되지 않은 파일 형식입니다.`);
        return;
      }
      const isImg = IMAGE_TYPES.includes(file.type);
      const sizeLimit = isImg ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;
      const sizeLimitLabel = isImg ? '10MB' : '20MB';
      if (file.size > sizeLimit) {
        toast.error(`${file.name}: 파일 크기는 ${sizeLimitLabel} 이하여야 합니다.`);
        return;
      }
    }

    setUploading(true);
    try {
      const uploaded: UploadedFile[] = [];
      for (const file of arr) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('targetType', targetType);
        const res = await api.post<ApiResponse<UploadedFile>>('/files', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploaded.push(res.data.data);
      }
      onChange([...value, ...uploaded]);
    } catch {
      // axios 인터셉터에서 에러 토스트 처리
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
  };

  const handleRemove = async (fileId: number) => {
    onChange(value.filter((f) => f.id !== fileId));
    try {
      await api.delete(`/files/${fileId}`);
    } catch {
      // 삭제 실패해도 UI에서는 제거된 상태 유지 (S3 정리는 백엔드 배치로 보완)
    }
  };

  const remaining = maxCount - value.length;
  const images = value.filter(isImage);
  const documents = value.filter((f) => !isImage(f));

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ALLOWED_TYPES.join(',')}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!uploading && remaining > 0) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && remaining > 0 && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        aria-label="파일 첨부"
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-6 text-center transition-all cursor-pointer',
          dragging
            ? 'border-brand-500 bg-brand-50/60'
            : 'border-brand-200 bg-brand-50/30 hover:border-brand-300 hover:bg-brand-50/50',
          (uploading || remaining <= 0) && 'cursor-not-allowed opacity-60',
        )}
      >
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-card text-brand-700 shadow-soft">
          <Upload className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold">
            {uploading
              ? '업로드 중...'
              : remaining <= 0
                ? '첨부 한도에 도달했어요'
                : '파일을 끌어다 놓거나 클릭해서 업로드'}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            이미지 10MB · 문서 20MB · 최대 {maxCount}개 ({value.length}/{maxCount})
          </p>
        </div>
      </div>

      {/* 이미지 미리보기 그리드 */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((file) => (
            <div
              key={file.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-brand-100/70 bg-brand-50"
            >
              <img
                src={file.url}
                alt={file.originalName}
                loading="lazy"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                <p className="truncate text-[10px] font-medium text-white">{file.originalName}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(file.id)}
                aria-label="이미지 삭제"
                className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 문서 파일 목록 */}
      {documents.length > 0 && (
        <ul className="space-y-2">
          {documents.map((file) => (
            <li
              key={file.id}
              className="flex items-center gap-2.5 rounded-lg border border-brand-100/70 bg-card px-3 py-2 text-sm shadow-xs"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-brand-50 text-brand-700">
                <FileIcon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{file.originalName}</p>
                <p className="text-[11px] text-muted-foreground">{formatSize(file.size)}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                aria-label="파일 삭제"
                onClick={() => handleRemove(file.id)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {/* 안내 (이미지 0개 문서 0개일 때 dropzone에 통합되므로 생략) */}
      {value.length === 0 && (
        <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <ImageIcon className="h-3 w-3" />
          이미지는 본문 하단에 갤러리로 표시됩니다.
        </p>
      )}
    </div>
  );
}
