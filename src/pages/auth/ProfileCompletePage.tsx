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
    defaultValues: {
      nickname: '',
      teams: [],
    },
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
    <div className="mx-auto max-w-sm px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <img src="/logo.png" alt="Locker Room" className="h-16 w-16" loading="lazy" />
        <h1 className="text-2xl font-bold">프로필 설정</h1>
        <p className="text-sm text-muted-foreground">닉네임과 응원팀을 설정해주세요</p>
      </div>

      {/* 폼 */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <FormLabel>응원팀 선택</FormLabel>
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

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            시작하기
          </Button>
        </form>
      </Form>
    </div>
  );
}
