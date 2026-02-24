import { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { postApi } from '../api/postApi';

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: number;
}

export function ReportModal({ open, onOpenChange, postId }: ReportModalProps) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error('신고 사유를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await postApi.report(postId, reason.trim());
      toast.success('신고가 접수되었습니다.');
      setReason('');
      onOpenChange(false);
    } catch {
      // axios 인터셉터에서 에러 처리
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>게시글 신고</DialogTitle>
          <DialogDescription>
            신고 사유를 작성해주세요. 허위 신고 시 제재를 받을 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="report-reason">신고 사유</Label>
          <Textarea
            id="report-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="신고 사유를 입력하세요"
            maxLength={500}
            rows={4}
          />
          <p className="text-xs text-muted-foreground text-right">{reason.length}/500</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            취소
          </Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={loading || !reason.trim()}>
            {loading ? '접수 중...' : '신고하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
