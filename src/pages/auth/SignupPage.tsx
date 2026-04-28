import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Check } from 'lucide-react';
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

export default function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

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
      } else if (code === 'USER_NICKNAME_DUPLICATED') {
        form.setError('nickname', { message: '이미 사용 중인 닉네임입니다.' });
      }
    }
  };

  return (
    <AuthLayout
      eyebrow="Create your account"
      title="라커룸에 합류하세요"
      subtitle="30초면 충분해요. 응원팀의 진짜 팬들이 기다리고 있습니다."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{' '}
          <Link to="/auth/login" className="font-semibold text-brand-700 hover:underline">
            로그인
          </Link>
        </p>
      }
    >
      <SsoButtons returnUrl={returnUrl || undefined} />

      <div className="relative my-6 flex items-center">
        <span className="h-px flex-1 bg-border" />
        <span className="px-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          또는 이메일로 가입
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup label="계정 정보">
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
          </FieldGroup>

          <FieldGroup label="프로필">
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>닉네임</FormLabel>
                  <FormControl>
                    <Input placeholder="2~20자, 특수문자 제외" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldGroup>

          <FieldGroup label="응원팀">
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
          </FieldGroup>

          <Button
            type="submit"
            size="lg"
            className="h-11 w-full text-sm font-semibold shadow-glow"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            라커룸 입장하기
          </Button>

          <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
            가입을 진행하면 Locker Room의{' '}
            <span className="underline underline-offset-2">이용약관</span>과{' '}
            <span className="underline underline-offset-2">개인정보처리방침</span>에 동의하는 것으로
            간주됩니다.
          </p>
        </form>
      </Form>
    </AuthLayout>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3.5">
      <legend className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}
