import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { applyFieldErrors } from '@/lib/formError';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { userApi } from '../api/userApi';
import {
  editProfileSchema,
  changePasswordSchema,
  type EditProfileFormData,
  type ChangePasswordFormData,
} from '../schemas/profileSchema';
import type { UserProfile } from '../types/user';

interface EditProfileFormProps {
  profile: UserProfile;
}

function ProfileSection({ profile }: EditProfileFormProps) {
  const { mutateAsync } = useUpdateProfile();
  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      nickname: profile.nickname,
    },
  });

  const onSubmit = async (data: EditProfileFormData) => {
    try {
      await mutateAsync(data);
      toast.success('프로필이 수정되었습니다.');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { code?: string } } };
      if (err.response?.data?.code === 'USER_NICKNAME_DUPLICATED') {
        form.setError('nickname', { message: '이미 사용 중인 닉네임입니다.' });
      } else {
        applyFieldErrors(error, form.setError);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-lg font-bold">프로필 수정</h2>

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

        <div className="space-y-2">
          <Label>응원팀</Label>
          <div className="flex flex-wrap gap-2">
            {profile.teams.map((team) => (
              <Badge key={`${team.sportId}-${team.teamId}`} variant="secondary">
                {team.sportName} - {team.teamName}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">응원팀은 변경할 수 없습니다.</p>
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          저장
        </Button>
      </form>
    </Form>
  );
}

function PasswordSection() {
  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', newPasswordConfirm: '' },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await userApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('비밀번호가 변경되었습니다.');
      form.reset();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { code?: string } } };
      if (err.response?.data?.code === 'USER_PASSWORD_MISMATCH') {
        form.setError('currentPassword', { message: '현재 비밀번호가 일치하지 않습니다.' });
      } else {
        applyFieldErrors(error, form.setError);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-lg font-bold">비밀번호 변경</h2>

        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>현재 비밀번호</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>새 비밀번호</FormLabel>
              <FormControl>
                <Input type="password" placeholder="영문, 숫자, 특수문자 포함 8~20자" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPasswordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>새 비밀번호 확인</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          변경
        </Button>
      </form>
    </Form>
  );
}

export function EditProfileForm({ profile }: EditProfileFormProps) {
  return (
    <div className="space-y-8">
      <ProfileSection profile={profile} />
      <Separator />
      <PasswordSection />
    </div>
  );
}
