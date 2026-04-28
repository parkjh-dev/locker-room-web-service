import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Loader2,
  Check,
  Mail,
  ArrowRight,
  ArrowLeft,
  Lock,
  UserCircle2,
  Trophy,
} from 'lucide-react';
import { signupSchema, type SignupFormData } from '@/features/auth/schemas/signupSchema';
import { authApi } from '@/features/auth/api/authApi';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { SsoButtons } from '@/features/auth/components/SsoButtons';
import { PasswordInput } from '@/features/auth/components/PasswordInput';
import { PasswordStrength } from '@/features/auth/components/PasswordStrength';
import { TeamSelector } from '@/components/common/TeamSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

type Phase = 'method' | 'account' | 'profile' | 'teams';

const STEP_META: { phase: Exclude<Phase, 'method'>; label: string; icon: typeof Lock }[] = [
  { phase: 'account', label: '계정 정보', icon: Lock },
  { phase: 'profile', label: '프로필', icon: UserCircle2 },
  { phase: 'teams', label: '응원팀', icon: Trophy },
];

export default function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const [phase, setPhase] = useState<Phase>('method');

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      nickname: '',
      teams: [],
    },
    mode: 'onTouched',
  });

  const password = form.watch('password');
  const passwordConfirm = form.watch('passwordConfirm');
  const passwordsMatch =
    password.length > 0 && passwordConfirm.length > 0 && password === passwordConfirm;

  const stepIndex = phase === 'method' ? 0 : STEP_META.findIndex((s) => s.phase === phase) + 1;
  const totalSteps = STEP_META.length;
  const progress = phase === 'method' ? 0 : (stepIndex / totalSteps) * 100;

  const goNext = async () => {
    if (phase === 'account') {
      const valid = await form.trigger(['email', 'password', 'passwordConfirm']);
      if (valid) setPhase('profile');
    } else if (phase === 'profile') {
      const valid = await form.trigger(['nickname']);
      if (valid) setPhase('teams');
    }
  };

  const goBack = () => {
    if (phase === 'account') setPhase('method');
    else if (phase === 'profile') setPhase('account');
    else if (phase === 'teams') setPhase('profile');
  };

  const onSubmit = async (data: SignupFormData) => {
    try {
      await authApi.signup({
        email: data.email,
        password: data.password,
        nickname: data.nickname,
        teams: data.teams,
      });
      toast.success('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate(`/auth/login${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { code?: string } } };
      const code = err.response?.data?.code;
      if (code === 'USER_EMAIL_DUPLICATED') {
        form.setError('email', { message: '이미 사용 중인 이메일입니다.' });
        setPhase('account');
      } else if (code === 'USER_NICKNAME_DUPLICATED') {
        form.setError('nickname', { message: '이미 사용 중인 닉네임입니다.' });
        setPhase('profile');
      }
    }
  };

  const headerCopy =
    phase === 'method'
      ? {
          eyebrow: 'Create your account',
          title: '라커룸에 합류하세요',
          subtitle: '30초면 충분해요. 응원팀의 진짜 팬들이 기다리고 있습니다.',
        }
      : {
          eyebrow: `Step ${stepIndex} of ${totalSteps}`,
          title:
            phase === 'account'
              ? '계정 정보를 입력해주세요'
              : phase === 'profile'
                ? '라커룸에서 어떻게 불릴까요?'
                : '어떤 팀을 응원하시나요?',
          subtitle:
            phase === 'account'
              ? '안전한 라커룸 이용을 위한 첫 걸음이에요.'
              : phase === 'profile'
                ? '닉네임은 라커룸 안에서 다른 팬들에게 표시돼요.'
                : '한 종목당 하나의 팀을 선택할 수 있어요.',
        };

  return (
    <AuthLayout
      eyebrow={headerCopy.eyebrow}
      title={headerCopy.title}
      subtitle={headerCopy.subtitle}
      footer={
        phase === 'method' ? (
          <p className="text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?{' '}
            <Link
              to={`/auth/login${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}
              className="font-semibold text-brand-700 hover:underline"
            >
              로그인
            </Link>
          </p>
        ) : null
      }
    >
      {/* Progress + Stepper (이메일 가입 진행 중에만) */}
      {phase !== 'method' && (
        <div className="mb-7 space-y-3">
          <div className="h-1 w-full overflow-hidden rounded-full bg-brand-100">
            <div
              className="h-full rounded-full bg-brand-gradient transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <ol className="flex items-center justify-between gap-2">
            {STEP_META.map((s, i) => {
              const idx = i + 1;
              const reached = stepIndex >= idx;
              const active = stepIndex === idx;
              return (
                <li key={s.phase} className="flex flex-1 flex-col items-center gap-1.5 text-center">
                  <span
                    className={cn(
                      'grid h-8 w-8 place-items-center rounded-full border text-xs font-bold transition-colors',
                      active && 'border-transparent bg-brand-gradient text-white shadow-glow',
                      reached && !active && 'border-transparent bg-brand-500 text-white',
                      !reached && 'border-brand-200 bg-card text-muted-foreground',
                    )}
                  >
                    {reached && !active ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <s.icon className="h-3.5 w-3.5" />
                    )}
                  </span>
                  <span
                    className={cn(
                      'text-[11px] font-semibold transition-colors',
                      active ? 'text-brand-700' : 'text-muted-foreground',
                    )}
                  >
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <div key={phase} className="animate-fade-up">
        {phase === 'method' ? (
          <MethodScreen returnUrl={returnUrl} onChooseEmail={() => setPhase('account')} />
        ) : (
          <Form {...form}>
            <form
              onSubmit={(e) => {
                if (phase !== 'teams') {
                  e.preventDefault();
                  goNext();
                  return;
                }
                form.handleSubmit(onSubmit)(e);
              }}
              className="space-y-5"
            >
              {phase === 'account' && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이메일</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="email@example.com"
                            type="email"
                            autoComplete="email"
                            autoFocus
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>비밀번호</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="영문·숫자·특수문자 포함 8~20자"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <PasswordStrength value={field.value} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="passwordConfirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>비밀번호 확인</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="비밀번호를 다시 입력하세요"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        {passwordsMatch && (
                          <p className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-brand-700">
                            <Check className="h-3 w-3" /> 비밀번호가 일치합니다
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {phase === 'profile' && (
                <FormField
                  control={form.control}
                  name="nickname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>닉네임</FormLabel>
                      <FormControl>
                        <Input placeholder="2~20자, 특수문자 제외" autoFocus {...field} />
                      </FormControl>
                      <p className="text-[11px] text-muted-foreground">
                        한국어, 영문, 숫자만 사용 가능해요. 가입 후 변경할 수 있어요.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {phase === 'teams' && (
                <FormField
                  control={form.control}
                  name="teams"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">응원팀 선택</FormLabel>
                      <FormControl>
                        <TeamSelector
                          value={field.value}
                          onChange={field.onChange}
                          error={form.formState.errors.teams?.message}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <NavRow
                onBack={goBack}
                isFinal={phase === 'teams'}
                isSubmitting={form.formState.isSubmitting}
              />

              {phase === 'teams' && (
                <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                  가입을 진행하면 <span className="underline underline-offset-2">이용약관</span>과{' '}
                  <span className="underline underline-offset-2">개인정보처리방침</span>에 동의하는
                  것으로 간주됩니다.
                </p>
              )}
            </form>
          </Form>
        )}
      </div>
    </AuthLayout>
  );
}

function MethodScreen({
  returnUrl,
  onChooseEmail,
}: {
  returnUrl: string | null;
  onChooseEmail: () => void;
}) {
  return (
    <div className="space-y-4">
      <SsoButtons returnUrl={returnUrl || undefined} />

      <div className="relative my-2 flex items-center">
        <span className="h-px flex-1 bg-border" />
        <span className="px-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          또는
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={onChooseEmail}
        className="group h-11 w-full justify-between text-sm font-semibold"
      >
        <span className="inline-flex items-center gap-2">
          <Mail className="h-4 w-4 text-brand-700" />
          이메일로 가입하기
        </span>
        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand-700" />
      </Button>

      <p className="pt-2 text-center text-[11px] leading-relaxed text-muted-foreground">
        가입을 진행하면 <span className="underline underline-offset-2">이용약관</span>과{' '}
        <span className="underline underline-offset-2">개인정보처리방침</span>에 동의하는 것으로
        간주됩니다.
      </p>
    </div>
  );
}

function NavRow({
  onBack,
  isFinal,
  isSubmitting,
}: {
  onBack: () => void;
  isFinal: boolean;
  isSubmitting: boolean;
}) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <Button
        type="button"
        variant="ghost"
        size="lg"
        onClick={onBack}
        disabled={isSubmitting}
        className="h-11 px-4"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        이전
      </Button>
      <Button
        type="submit"
        variant="brand"
        size="lg"
        disabled={isSubmitting}
        className="h-11 flex-1 text-sm font-semibold shadow-glow"
      >
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : isFinal ? null : (
          <ArrowRight className="ml-1 h-4 w-4" />
        )}
        {isFinal ? '라커룸 입장하기' : '다음'}
      </Button>
    </div>
  );
}
