import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Info,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
  UserSearch,
} from 'lucide-react';

import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { PhoneVerificationField } from '@/features/auth/components/PhoneVerificationField';
import { authApi } from '@/features/auth/api/authApi';
import type { AccountProvider, FindAccountIdResponse } from '@/features/auth/types/auth';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

type TabKey = 'id' | 'password';

const PROVIDER_LABEL: Record<AccountProvider, string> = {
  EMAIL: '이메일 자체 가입',
  KAKAO: '카카오 로그인',
  GOOGLE: '구글 로그인',
  NAVER: '네이버 로그인',
};

const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, '휴대폰 번호를 입력해주세요.')
    .regex(/^01[0-9]{8,9}$/, '올바른 휴대폰 번호 형식이 아닙니다.'),
  phoneVerified: z.literal(true, { message: '휴대폰 인증을 완료해주세요.' }),
});
type PhoneForm = z.infer<typeof phoneSchema>;

function buildKeycloakResetUrl() {
  const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL;
  const realm = import.meta.env.VITE_KEYCLOAK_REALM;
  const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;
  if (!keycloakUrl || !realm) return null;
  const redirect = encodeURIComponent(window.location.origin + '/auth/login');
  return `${keycloakUrl}/realms/${realm}/login-actions/reset-credentials?client_id=${clientId}&redirect_uri=${redirect}`;
}

export default function AccountFindPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabParam = searchParams.get('tab');
  const activeTab: TabKey = tabParam === 'password' ? 'password' : 'id';

  const handleTabChange = (next: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', next);
    setSearchParams(params, { replace: true });
  };

  const titleMap: Record<TabKey, { eyebrow: string; title: string; subtitle: string }> = {
    id: {
      eyebrow: 'Account recovery',
      title: '아이디 / 비밀번호 찾기',
      subtitle: '본인 확인 후 가입하신 계정 정보를 알려드릴게요.',
    },
    password: {
      eyebrow: 'Account recovery',
      title: '아이디 / 비밀번호 찾기',
      subtitle: '비밀번호는 SSO 인증 서버에서 안전하게 재설정합니다.',
    },
  };
  const meta = titleMap[activeTab];

  return (
    <AuthLayout
      eyebrow={meta.eyebrow}
      title={meta.title}
      subtitle={meta.subtitle}
      brandHeadline="잊으셨어도 괜찮아요"
      brandLines={[
        '휴대폰 본인 확인으로 가입 이메일 즉시 안내',
        '비밀번호는 라커룸이 보관하지 않고 SSO에서 직접 재설정',
        '소셜 로그인으로 가입했어도 어떤 SNS로 가입했는지 알려드려요',
      ]}
      footer={
        <button
          type="button"
          onClick={() => navigate('/auth/login')}
          className="mx-auto inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" />
          로그인으로 돌아가기
        </button>
      }
    >
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid h-11 w-full grid-cols-2">
          <TabsTrigger value="id" className="h-9 gap-1.5">
            <UserSearch className="h-3.5 w-3.5" />
            아이디 찾기
          </TabsTrigger>
          <TabsTrigger value="password" className="h-9 gap-1.5">
            <KeyRound className="h-3.5 w-3.5" />
            비밀번호 찾기
          </TabsTrigger>
        </TabsList>

        <TabsContent value="id" className="mt-6 animate-fade-in">
          <FindIdPanel />
        </TabsContent>

        <TabsContent value="password" className="mt-6 animate-fade-in">
          <FindPasswordPanel />
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
}

/* ────────── 아이디 찾기 ────────── */

function FindIdPanel() {
  const form = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
    mode: 'onTouched',
    defaultValues: { phone: '', phoneVerified: false as never },
  });
  const [result, setResult] = useState<FindAccountIdResponse | null>(null);
  const [looking, setLooking] = useState(false);
  const phoneVerified = form.watch('phoneVerified');

  // 인증 완료되면 자동으로 lookup 호출 — 추가 클릭 없이 바로 결과 노출
  useEffect(() => {
    if (!phoneVerified || result || looking) return;
    setLooking(true);
    authApi
      .findAccountIdByPhone(form.getValues('phone'))
      .then((res) => setResult(res))
      .finally(() => setLooking(false));
  }, [phoneVerified, result, looking, form]);

  const handleReset = () => {
    setResult(null);
    form.reset({ phone: '', phoneVerified: false as never });
  };

  if (result) {
    return <FindIdResultCard result={result} onReset={handleReset} />;
  }

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="rounded-xl border border-brand-100/70 bg-brand-50/40 p-4">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">휴대폰 본인 확인</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                가입할 때 사용한 휴대폰 번호로 인증번호를 보내드려요. 인증이 완료되면 가입 이메일을
                마스킹 처리해 안전하게 알려드립니다.
              </p>
            </div>
          </div>
        </div>

        <PhoneVerificationField
          control={form.control}
          phoneName="phone"
          verifiedName="phoneVerified"
          onVerifiedChange={(v) =>
            form.setValue('phoneVerified', v as never, { shouldValidate: true })
          }
          getPhone={() => form.getValues('phone')}
        />

        {looking && (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-brand-50/60 p-3 text-sm text-brand-700">
            <Loader2 className="h-4 w-4 animate-spin" />
            가입 정보를 조회하고 있어요
          </div>
        )}
      </form>
    </Form>
  );
}

function FindIdResultCard({
  result,
  onReset,
}: {
  result: FindAccountIdResponse;
  onReset: () => void;
}) {
  const navigate = useNavigate();

  if (!result.found) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 text-center">
          <span className="grid mx-auto h-14 w-14 place-items-center rounded-2xl bg-amber-500/15 text-amber-700">
            <Info className="h-6 w-6" />
          </span>
          <p className="mt-4 text-base font-semibold text-foreground">
            일치하는 계정을 찾을 수 없어요
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            입력하신 휴대폰 번호로 가입된 계정이 없어요.
            <br />
            번호를 다시 확인하시거나 회원가입을 진행해주세요.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button size="lg" className="h-11" onClick={() => navigate('/auth/signup')}>
            회원가입하러 가기
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button type="button" size="lg" variant="outline" className="h-11" onClick={onReset}>
            다른 번호로 다시 확인
          </Button>
        </div>
      </div>
    );
  }

  const isSocial = result.provider && result.provider !== 'EMAIL';
  const providerLabel = result.provider ? PROVIDER_LABEL[result.provider] : '이메일';
  const joinDate = result.createdAt
    ? new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(result.createdAt))
    : null;

  return (
    <div className="space-y-5">
      {/* 결과 카드 */}
      <div className="overflow-hidden rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-white shadow-soft">
        <div className="flex items-center gap-2 border-b border-brand-100/70 bg-brand-50/40 px-5 py-3">
          <CheckCircle2 className="h-4 w-4 text-brand-600" />
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">
            본인 확인 완료
          </span>
        </div>
        <div className="space-y-4 px-5 py-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              가입 이메일
            </p>
            <p className="mt-1.5 break-all text-2xl font-bold tracking-tight text-foreground">
              {result.maskedEmail}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-brand-100/70 pt-4">
            <Meta label="가입 수단" value={providerLabel} />
            {joinDate && <Meta label="가입일" value={joinDate} />}
          </div>
        </div>
      </div>

      {/* 소셜 가입자 안내 */}
      {isSocial && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
          <div className="flex items-start gap-2.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                {providerLabel}으로 가입하셨어요
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                비밀번호 재설정 대신 {providerLabel} 버튼으로 로그인해주세요.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col gap-2">
        <Button size="lg" className="h-11" onClick={() => navigate('/auth/login')}>
          <Mail className="mr-1 h-4 w-4" />이 계정으로 로그인하기
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
        {!isSocial && (
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="h-11"
            onClick={() => {
              const url = buildKeycloakResetUrl();
              if (url) window.location.href = url;
            }}
          >
            <KeyRound className="mr-1 h-4 w-4" />
            비밀번호 재설정하기
          </Button>
        )}
        <Button type="button" size="sm" variant="ghost" className="h-9 mt-1" onClick={onReset}>
          다른 번호로 다시 확인
        </Button>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

/* ────────── 비밀번호 찾기 (Keycloak 리다이렉트) ────────── */

function FindPasswordPanel() {
  const resetUrl = useMemo(() => buildKeycloakResetUrl(), []);

  const handleRedirect = () => {
    if (resetUrl) window.location.href = resetUrl;
  };

  return (
    <div className="space-y-5">
      <div
        className={cn(
          'rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-white p-6 text-center shadow-soft',
        )}
      >
        <span className="grid mx-auto h-14 w-14 place-items-center rounded-2xl bg-brand-500 text-white shadow-glow">
          <KeyRound className="h-6 w-6" />
        </span>
        <p className="mt-4 text-base font-semibold text-foreground">
          비밀번호는 SSO 인증 서버에서 재설정해요
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          입력하신 비밀번호는 라커룸 서버에 저장되지 않아요.
          <br />
          안전한 외부 페이지로 이동해 새 비밀번호를 설정해주세요.
        </p>
        <Button
          size="lg"
          className="mt-5 h-11 w-full text-sm font-semibold"
          onClick={handleRedirect}
          disabled={!resetUrl}
        >
          비밀번호 재설정 페이지로 이동
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* 소셜 가입자 안내 — 본인 가입 방식을 모르므로 정보성으로 표시 */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
        <div className="flex items-start gap-2.5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              SNS로 가입하셨다면 비밀번호가 없어요
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              카카오·구글·네이버로 가입하셨다면 비밀번호 재설정 대신 해당 SNS로 로그인해주세요. 어떤
              SNS로 가입했는지 모르겠다면{' '}
              <Link to="/auth/find?tab=id" className="font-semibold text-brand-700 hover:underline">
                아이디 찾기
              </Link>
              에서 확인할 수 있어요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
