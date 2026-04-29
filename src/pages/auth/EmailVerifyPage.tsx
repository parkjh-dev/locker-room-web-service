import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { authApi } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/features/auth/stores/authStore';

type Status = 'loading' | 'success' | 'error';

export default function EmailVerifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<Status>(() => (token ? 'loading' : 'error'));
  const [errorMessage, setErrorMessage] = useState<string>(() =>
    token ? '' : '인증 링크가 올바르지 않습니다.',
  );
  const ranRef = useRef(false);
  const patchUser = useAuthStore((s) => s.patchUser);

  useEffect(() => {
    if (ranRef.current || !token) return;
    ranRef.current = true;

    authApi
      .verifyEmail(token)
      .then((res) => {
        if (res?.verified) {
          setStatus('success');
          patchUser({ emailVerified: true });
        } else {
          setStatus('error');
          setErrorMessage('인증에 실패했습니다.');
        }
      })
      .catch((err: unknown) => {
        const e = err as { response?: { data?: { message?: string } } };
        setStatus('error');
        setErrorMessage(e.response?.data?.message ?? '유효하지 않거나 만료된 인증 링크입니다.');
      });
  }, [token, patchUser]);

  const meta =
    status === 'loading'
      ? {
          eyebrow: 'Email verification',
          title: '이메일을 확인하고 있어요',
          subtitle: '잠시만 기다려주세요.',
        }
      : status === 'success'
        ? {
            eyebrow: 'Welcome aboard',
            title: '이메일 인증이 완료되었습니다',
            subtitle: '이제 라커룸의 모든 기능을 자유롭게 이용할 수 있어요.',
          }
        : {
            eyebrow: 'Verification failed',
            title: '인증에 실패했습니다',
            subtitle: '인증 메일을 다시 받아 새 링크로 시도해 주세요.',
          };

  return (
    <AuthLayout eyebrow={meta.eyebrow} title={meta.title} subtitle={meta.subtitle}>
      <div className="rounded-2xl border border-brand-100/70 bg-card p-6 shadow-soft">
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-3 py-6 text-muted-foreground">
            <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
            <p className="text-sm">인증 토큰을 확인하는 중...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-700">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <p className="text-sm text-muted-foreground">
              가입하신 이메일 주소가 정상적으로 확인되었습니다.
            </p>
            <Button
              asChild
              variant="brand"
              size="lg"
              className="mt-2 h-11 w-full text-sm font-semibold"
            >
              <Link to="/">홈으로 가기</Link>
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-destructive/10 text-destructive">
              <XCircle className="h-7 w-7" />
            </span>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
            <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 flex-1 text-sm font-semibold"
              >
                <Link to="/auth/login">로그인 후 재발송</Link>
              </Button>
              <Button
                asChild
                variant="brand"
                size="lg"
                className="h-11 flex-1 text-sm font-semibold"
              >
                <Link to="/">홈으로 가기</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
