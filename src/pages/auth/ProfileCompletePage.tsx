import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  profileCompleteSchema,
  type ProfileCompleteFormData,
} from '@/features/auth/schemas/profileCompleteSchema';
import { authApi } from '@/features/auth/api/authApi';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
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

export default function ProfileCompletePage() {
  const navigate = useNavigate();

  const form = useForm<ProfileCompleteFormData>({
    resolver: zodResolver(profileCompleteSchema),
    defaultValues: { nickname: '' },
  });

  const onSubmit = async (data: ProfileCompleteFormData) => {
    try {
      await authApi.profileComplete(data);
      // 응원팀 등록은 OnboardingGuard가 /onboarding/teams로 안내한다
      navigate('/', { replace: true });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { code?: string } } };
      const code = err.response?.data?.code;
      if (code === 'USER_NICKNAME_DUPLICATED') {
        form.setError('nickname', { message: '이미 사용 중인 닉네임입니다.' });
      }
    }
  };

  return (
    <AuthLayout
      eyebrow="One last step"
      title="라커룸에서 어떻게 불릴까요?"
      subtitle="닉네임을 정하면 라커룸을 시작할 수 있어요. 응원팀은 다음 단계에서 등록할 수 있습니다."
      brandHeadline="당신의 라커룸을 정의하는 첫 걸음"
      brandLines={[
        '닉네임은 라커룸 안에서 당신을 대표해요',
        '응원팀에 따라 전용 게시판이 열려요',
        '나중에 마이페이지에서 언제든 추가할 수 있어요',
      ]}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>닉네임</FormLabel>
                <FormControl>
                  <Input placeholder="2~20자, 특수문자 제외" autoFocus {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="h-11 w-full text-sm font-semibold shadow-glow"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            다음으로
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}
