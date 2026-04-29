import { useEffect, useRef, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { authApi } from '../api/authApi';
import type { Control, FieldValues, Path } from 'react-hook-form';

const RESEND_SECONDS = 180;

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface Props<T extends FieldValues> {
  control: Control<T>;
  phoneName: Path<T>;
  verifiedName: Path<T>;
  onVerifiedChange: (verified: boolean) => void;
  getPhone: () => string;
}

export function PhoneVerificationField<T extends FieldValues>({
  control,
  phoneName,
  verifiedName,
  onVerifiedChange,
  getPhone,
}: Props<T>) {
  const [status, setStatus] = useState<'idle' | 'sent' | 'verified'>('idle');
  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [sending, setSending] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    },
    [],
  );

  const startTimer = (seconds: number) => {
    setSecondsLeft(seconds);
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((v) => {
        if (v <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  };

  const handleSend = async () => {
    const phone = getPhone();
    if (!/^01[0-9]{8,9}$/.test(phone)) {
      toast.error('올바른 휴대폰 번호를 먼저 입력해주세요.');
      return;
    }
    setSending(true);
    try {
      const res = await authApi.requestPhoneVerification(phone);
      setStatus('sent');
      setCode('');
      startTimer(res?.expiresInSec ?? RESEND_SECONDS);
      toast.success('인증번호를 발송했습니다.');
    } catch {
      toast.error('인증번호 발송에 실패했습니다.');
    } finally {
      setSending(false);
    }
  };

  const handleConfirm = async () => {
    if (code.length !== 6) {
      toast.error('인증번호 6자리를 입력해주세요.');
      return;
    }
    if (secondsLeft === 0) {
      toast.error('인증번호가 만료되었습니다. 다시 요청해주세요.');
      return;
    }
    setConfirming(true);
    try {
      const res = await authApi.confirmPhoneVerification(getPhone(), code);
      if (res?.verified) {
        setStatus('verified');
        onVerifiedChange(true);
        if (timerRef.current) window.clearInterval(timerRef.current);
        toast.success('휴대폰 인증이 완료되었습니다.');
      }
    } catch {
      toast.error('인증번호가 일치하지 않습니다.');
    } finally {
      setConfirming(false);
    }
  };

  const isVerified = status === 'verified';

  return (
    <div className="space-y-3">
      <FormField
        control={control}
        name={phoneName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>휴대폰 번호</FormLabel>
            <div className="flex items-start gap-2">
              <FormControl>
                <Input
                  type="tel"
                  inputMode="numeric"
                  placeholder="01012345678"
                  autoComplete="tel"
                  disabled={isVerified}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value.replace(/[^0-9]/g, ''));
                    if (status !== 'idle') {
                      setStatus('idle');
                      setCode('');
                      setSecondsLeft(0);
                      onVerifiedChange(false);
                    }
                  }}
                />
              </FormControl>
              <Button
                type="button"
                variant="outline"
                onClick={handleSend}
                disabled={sending || isVerified}
                className="h-10 shrink-0 px-3 text-xs font-semibold"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : status === 'sent' ? (
                  '재발송'
                ) : (
                  '인증번호 받기'
                )}
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {(status === 'sent' || isVerified) && (
        <FormField
          control={control}
          name={verifiedName}
          render={() => (
            <FormItem>
              <FormLabel>인증번호</FormLabel>
              <div className="flex items-start gap-2">
                <FormControl>
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="6자리 숫자"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                      disabled={isVerified}
                      autoComplete="one-time-code"
                    />
                    {!isVerified && secondsLeft > 0 && (
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-600">
                        {formatTime(secondsLeft)}
                      </span>
                    )}
                  </div>
                </FormControl>
                <Button
                  type="button"
                  variant={isVerified ? 'outline' : 'brand'}
                  onClick={handleConfirm}
                  disabled={confirming || isVerified || code.length !== 6}
                  className="h-10 shrink-0 px-3 text-xs font-semibold"
                >
                  {confirming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isVerified ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" />
                      완료
                    </span>
                  ) : (
                    '인증 확인'
                  )}
                </Button>
              </div>
              {isVerified ? (
                <p className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-brand-700">
                  <Check className="h-3 w-3" /> 휴대폰 인증이 완료되었습니다
                </p>
              ) : secondsLeft === 0 ? (
                <p className="text-[11px] text-muted-foreground">
                  인증번호가 만료되었습니다. 재발송해주세요.
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  문자로 받은 6자리 인증번호를 입력해주세요.
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
