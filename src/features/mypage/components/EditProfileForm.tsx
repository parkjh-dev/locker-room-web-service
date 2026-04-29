import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, User, KeyRound, Lock, Check, Camera, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { PasswordInput } from '@/features/auth/components/PasswordInput';
import { PasswordStrength } from '@/features/auth/components/PasswordStrength';
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

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof User;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-brand-100/70 bg-card p-5 shadow-soft sm:p-7">
      <header className="mb-5 flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-base font-bold tracking-tight">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}

function ProfileSection({ profile }: EditProfileFormProps) {
  const { mutateAsync } = useUpdateProfile();
  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { nickname: profile.nickname },
    mode: 'onTouched',
  });
  const isDirty = form.formState.isDirty;

  const onSubmit = async (data: EditProfileFormData) => {
    try {
      await mutateAsync(data);
      toast.success('프로필이 수정되었습니다.');
      form.reset(data);
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
    <SectionCard
      icon={User}
      title="프로필 정보"
      description="라커룸 안에서 다른 팬들에게 보이는 정보예요."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <ProfileImageField profile={profile} />

          {/* 이메일 (읽기 전용) */}
          <div className="rounded-xl border border-brand-100/60 bg-brand-50/30 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-700">
              {profile.provider ? `${profile.provider.toUpperCase()} 계정` : '이메일 계정'}
            </p>
            <p className="mt-0.5 truncate text-sm font-medium">{profile.email}</p>
            <p className="text-xs text-muted-foreground">이메일은 변경할 수 없습니다.</p>
          </div>

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

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => form.reset({ nickname: profile.nickname })}
              disabled={!isDirty || form.formState.isSubmitting}
            >
              초기화
            </Button>
            <Button
              type="submit"
              variant="brand"
              size="sm"
              disabled={!isDirty || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-1 h-4 w-4" />
              )}
              변경사항 저장
            </Button>
          </div>
        </form>
      </Form>
    </SectionCard>
  );
}

function PasswordSection({ provider }: { provider: string | null }) {
  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', newPasswordConfirm: '' },
    mode: 'onTouched',
  });

  const newPw = form.watch('newPassword');
  const newPwConfirm = form.watch('newPasswordConfirm');
  const matched = newPw.length > 0 && newPw === newPwConfirm;

  // SSO 가입자는 비밀번호 변경 불가
  if (provider) {
    return (
      <SectionCard icon={Lock} title="비밀번호 변경">
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-sm text-amber-800">
          <p className="font-semibold">SSO 계정으로 가입한 회원입니다.</p>
          <p className="mt-1 text-xs leading-relaxed">
            {provider.toUpperCase()} 계정의 비밀번호는 해당 서비스에서 직접 관리해주세요.
          </p>
        </div>
      </SectionCard>
    );
  }

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await userApi.updateMe({
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
    <SectionCard
      icon={KeyRound}
      title="비밀번호 변경"
      description="안전을 위해 주기적으로 변경하는 것을 권장해요."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>현재 비밀번호</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="current-password" {...field} />
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
            name="newPasswordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>새 비밀번호 확인</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="new-password" {...field} />
                </FormControl>
                {matched && (
                  <p className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-brand-700">
                    <Check className="h-3 w-3" /> 비밀번호가 일치합니다
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end pt-1">
            <Button type="submit" variant="brand" size="sm" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              비밀번호 변경
            </Button>
          </div>
        </form>
      </Form>
    </SectionCard>
  );
}

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB

function ProfileImageField({ profile }: { profile: UserProfile }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<'upload' | 'remove' | null>(null);
  const { mutateAsync } = useUpdateProfile();

  const handlePick = () => inputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // 같은 파일 재선택 가능하도록 reset
    if (!file) return;

    if (!IMAGE_TYPES.includes(file.type)) {
      toast.error('이미지 파일만 업로드할 수 있어요. (jpg, png, gif, webp)');
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      toast.error('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    setBusy('upload');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post<ApiResponse<{ url: string }>>('/files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data.data.url;
      await mutateAsync({ profileImageUrl: url });
      toast.success('프로필 사진이 변경되었습니다.');
    } catch {
      toast.error('업로드에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setBusy(null);
    }
  };

  const handleRemove = async () => {
    setBusy('remove');
    try {
      await mutateAsync({ profileImageUrl: null });
      toast.success('프로필 사진이 제거되었습니다.');
    } catch {
      toast.error('제거에 실패했습니다.');
    } finally {
      setBusy(null);
    }
  };

  const hasImage = !!profile.profileImageUrl;
  const isBusy = busy !== null;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-brand-100/60 bg-brand-50/30 p-4">
      <Avatar className="h-16 w-16 shrink-0 ring-2 ring-card">
        {hasImage && <AvatarImage src={profile.profileImageUrl!} alt={profile.nickname} />}
        <AvatarFallback className="bg-brand-gradient text-lg font-bold text-white">
          {profile.nickname.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1 space-y-2">
        <div>
          <p className="text-sm font-semibold">프로필 사진</p>
          <p className="text-[11px] text-muted-foreground">JPG · PNG · GIF · WebP / 5MB 이하</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePick}
            disabled={isBusy}
            className="h-8 text-xs"
          >
            {busy === 'upload' ? (
              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Camera className="mr-1 h-3.5 w-3.5" />
            )}
            {hasImage ? '사진 변경' : '사진 업로드'}
          </Button>
          {hasImage && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={isBusy}
              className="h-8 text-xs text-muted-foreground hover:text-destructive"
            >
              {busy === 'remove' ? (
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="mr-1 h-3.5 w-3.5" />
              )}
              제거
            </Button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_TYPES.join(',')}
          hidden
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

export function EditProfileForm({ profile }: EditProfileFormProps) {
  return (
    <div className="space-y-6">
      <ProfileSection profile={profile} />
      <PasswordSection provider={profile.provider} />
    </div>
  );
}
