import { useRef, useState } from 'react';
import { Upload, X, FileIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILE_COUNT = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];

interface UploadedFile {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

interface FileUploadProps {
  value: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  maxCount?: number;
}

export function FileUpload({ value, onChange, maxCount = MAX_FILE_COUNT }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 개수 검증
    if (value.length + files.length > maxCount) {
      toast.error(`파일은 최대 ${maxCount}개까지 첨부할 수 있습니다.`);
      return;
    }

    // 파일별 검증
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}: 파일 크기는 10MB 이하여야 합니다.`);
        return;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: 허용되지 않은 파일 형식입니다.`);
        return;
      }
    }

    // 업로드
    setUploading(true);
    try {
      const uploaded: UploadedFile[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
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

  const handleRemove = (fileId: number) => {
    onChange(value.filter((f) => f.id !== fileId));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

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
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading || value.length >= maxCount}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        {uploading ? '업로드 중...' : `파일 첨부 (${value.length}/${maxCount})`}
      </Button>

      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((file) => (
            <li
              key={file.id}
              className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
            >
              <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate">{file.fileName}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatSize(file.fileSize)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                aria-label="파일 삭제"
                onClick={() => handleRemove(file.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
