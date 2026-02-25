import { useQuery } from '@tanstack/react-query';
import { FileIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { inquiryApi } from '../api/inquiryApi';
import type { InquiryType, InquiryStatus } from '../types/inquiry';

const typeLabels: Record<InquiryType, string> = {
  GENERAL: '일반 문의',
  BUG: '버그 신고',
  SUGGESTION: '건의사항',
};

const statusConfig: Record<InquiryStatus, { label: string; variant: 'secondary' | 'default' }> = {
  PENDING: { label: '대기중', variant: 'secondary' },
  ANSWERED: { label: '답변완료', variant: 'default' },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface InquiryDetailProps {
  inquiryId: number;
}

export function InquiryDetail({ inquiryId }: InquiryDetailProps) {
  const { data: inquiry, isLoading } = useQuery({
    queryKey: ['inquiries', inquiryId],
    queryFn: () => inquiryApi.getInquiryDetail(inquiryId),
  });

  if (isLoading) {
    return <SkeletonLoader type="post-list" count={3} />;
  }

  if (!inquiry) return null;

  const status = statusConfig[inquiry.status];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{typeLabels[inquiry.type]}</Badge>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        <h2 className="text-lg font-bold">{inquiry.title}</h2>
        <p className="text-sm text-muted-foreground">{formatDate(inquiry.createdAt)}</p>
      </div>

      <Separator />

      {/* 내용 */}
      <div className="whitespace-pre-wrap text-sm leading-relaxed">{inquiry.content}</div>

      {/* 첨부파일 */}
      {inquiry.files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">첨부파일</p>
          <ul className="space-y-1">
            {inquiry.files.map((file) => (
              <li key={file.id}>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <FileIcon className="h-4 w-4" />
                  {file.originalName}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Separator />

      {/* 관리자 답변 */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold">관리자 답변</h3>
        {inquiry.replies.length > 0 ? (
          <div className="space-y-3">
            {inquiry.replies.map((reply) => (
              <div key={reply.id} className="rounded-lg border bg-muted/50 p-4">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{reply.content}</div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {reply.adminNickname} · {formatDate(reply.createdAt)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">아직 답변이 등록되지 않았습니다.</p>
        )}
      </div>
    </div>
  );
}
