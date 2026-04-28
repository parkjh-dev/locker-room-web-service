import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  profileCompleteSchema,
  type ProfileCompleteFormData,
} from '@/features/auth/schemas/profileCompleteSchema';
import { authApi } from '@/features/auth/api/authApi';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
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

export default function ProfileCompletePage() {
  const navigate = useNavigate();

  const form = useForm<ProfileCompleteFormData>({
    resolver: zodResolver(profileCompleteSchema),
    defaultValues: { nickname: '', teams: [] },
  });

  const onSubmit = async (data: ProfileCompleteFormData) => {
    try {
      await authApi.profileComplete(data);
      toast.success('프로필 설정이 완료되었습니다.');
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
      title="프로필을 완성해주세요"
      subtitle="닉네임과 응원팀을 설정하면 라커룸 이용을 시작할 수 있어요."
      brandHeadline="당신의 라커룸을 정의하는 첫 걸음"
      brandLines={[
        '닉네임은 라커룸 안에서 당신을 대표해요',
        '응원팀에 따라 전용 게시판이 열려요',
        '나중에 마이페이지에서 언제든 변경할 수 있어요',
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
                  <Input placeholder="2~20자, 특수문자 제외" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="teams"
            render={({ field }) => (
              <FormItem>
                <FormLabel>응원팀</FormLabel>
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

          <Button
            type="submit"
            size="lg"
            className="h-11 w-full text-sm font-semibold shadow-glow"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            라커룸 시작하기
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}
