import { useState } from 'react';
import { Plus, X, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PollDraft } from '../schemas/postSchema';

interface PollEditorProps {
  value: PollDraft | null | undefined;
  onChange: (next: PollDraft | null) => void;
  /** 외부에서 옵션 단위 에러 메시지를 주입하고 싶을 때 (FormMessage 대신 사용) */
  errorMessage?: string;
}

const DURATION_OPTIONS = [
  { label: '1시간', hours: 1 },
  { label: '6시간', hours: 6 },
  { label: '1일', hours: 24 },
  { label: '3일', hours: 24 * 3 },
  { label: '7일', hours: 24 * 7 },
];

const DEFAULT_DURATION_HOURS = 24 * 3;

function nowPlus(hours: number) {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

export function PollEditor({ value, onChange, errorMessage }: PollEditorProps) {
  // 렌더 중 Date.now() 호출 lint 회피용 — duration 매칭 시점은 마운트 시 한 번이면 충분
  const [renderTime] = useState(() => Date.now());
  const enabled = value !== null && value !== undefined;

  const handleEnable = () => {
    onChange({
      question: '',
      options: ['', ''],
      expiresAt: nowPlus(DEFAULT_DURATION_HOURS),
    });
  };

  const handleDisable = () => onChange(null);

  if (!enabled) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={handleEnable}
        className="h-10 w-full justify-start gap-2 text-sm font-medium text-muted-foreground"
      >
        <BarChart3 className="h-4 w-4" />
        투표 추가
      </Button>
    );
  }

  const updateOption = (index: number, text: string) => {
    const next = [...value.options];
    next[index] = text;
    onChange({ ...value, options: next });
  };

  const addOption = () => {
    if (value.options.length >= 5) return;
    onChange({ ...value, options: [...value.options, ''] });
  };

  const removeOption = (index: number) => {
    if (value.options.length <= 2) return;
    onChange({ ...value, options: value.options.filter((_, i) => i !== index) });
  };

  // 현재 선택된 duration 추정 (가장 가까운 표준값으로 매칭)
  const currentDurationHours = (() => {
    const diffMs = new Date(value.expiresAt).getTime() - renderTime;
    const hours = Math.round(diffMs / (60 * 60 * 1000));
    const closest = DURATION_OPTIONS.reduce((prev, curr) =>
      Math.abs(curr.hours - hours) < Math.abs(prev.hours - hours) ? curr : prev,
    );
    return closest.hours;
  })();

  return (
    <div className="space-y-3 rounded-xl border border-brand-100/70 bg-brand-50/30 p-4">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
          <BarChart3 className="h-4 w-4" />
          투표
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleDisable}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
        >
          <X className="mr-1 h-3.5 w-3.5" />
          제거
        </Button>
      </div>

      <Input
        placeholder="질문 (선택, 비우면 본문 자체가 질문이 돼요)"
        maxLength={120}
        value={value.question ?? ''}
        onChange={(e) => onChange({ ...value, question: e.target.value })}
      />

      <div className="space-y-2">
        {value.options.map((option, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-card text-xs font-bold text-brand-700">
              {idx + 1}
            </span>
            <Input
              placeholder={`옵션 ${idx + 1}`}
              maxLength={50}
              value={option}
              onChange={(e) => updateOption(idx, e.target.value)}
              className="flex-1"
            />
            {value.options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(idx)}
                aria-label={`옵션 ${idx + 1} 제거`}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-card hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}

        {value.options.length < 5 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addOption}
            className="h-8 w-full justify-start gap-1.5 text-xs text-muted-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            옵션 추가 ({value.options.length}/5)
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">마감</span>
        <Select
          value={String(currentDurationHours)}
          onValueChange={(v) => onChange({ ...value, expiresAt: nowPlus(Number(v)) })}
        >
          <SelectTrigger className="h-9 flex-1 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DURATION_OPTIONS.map((d) => (
              <SelectItem key={d.hours} value={String(d.hours)}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {errorMessage && <p className="text-xs font-medium text-destructive">{errorMessage}</p>}
    </div>
  );
}
