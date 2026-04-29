import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight, Trophy, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { TeamSelector } from '@/components/common/TeamSelector';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { authApi } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { ONBOARDING_REDIRECT_SESSION_KEY } from '@/guards/OnboardingGuard';
import type { SportTeamPair } from '@/types/common';

export default function OnboardingTeamsPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);

  const [teams, setTeams] = useState<SportTeamPair[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [skipping, setSkipping] = useState(false);

  // 페이지 진입 시 세션 플래그를 셋해서, 사용자가 그냥 떠나도 같은 세션에선 다시 redirect되지 않도록
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(ONBOARDING_REDIRECT_SESSION_KEY, '1');
    }
  }, []);

  const handleSave = async () => {
    if (teams.length === 0) {
      toast.error('등록할 응원팀을 한 개 이상 선택해주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const updated = await authApi.addUserTeams({ teams });
      setUser(updated);
      toast.success('응원팀이 등록되었습니다.');
      navigate('/', { replace: true });
    } catch {
      toast.error('응원팀 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  };

  const handleSkip = async () => {
    setSkipping(true);
    try {
      const updated = await authApi.skipOnboarding();
      setUser(updated);
      navigate('/', { replace: true });
    } catch {
      toast.error('잠시 후 다시 시도해주세요.');
    } finally {
      setSkipping(false);
    }
  };

  const isFirstTime = user?.onboardingCompletedAt === null;

  return (
    <AuthLayout
      eyebrow={isFirstTime ? 'One last step' : 'Add your teams'}
      title={user?.nickname ? `${user.nickname}님, 응원팀을 알려주세요` : '응원팀을 알려주세요'}
      subtitle={
        isFirstTime
          ? '응원팀을 등록하면 팀 게시판이 활성화돼요. 지금 등록하지 않아도 자유 게시판은 자유롭게 이용할 수 있어요.'
          : '응원팀을 등록하면 팀 게시판이 활성화돼요. 한 번 등록한 종목은 변경할 수 없으니 신중히 골라주세요.'
      }
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-xs leading-relaxed text-amber-900">
          <p className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
            <span>
              <span className="font-semibold">한 번 등록한 종목의 응원팀은 변경할 수 없어요.</span>{' '}
              아직 등록하지 않은 종목은 마이페이지에서 언제든 추가할 수 있습니다.
            </span>
          </p>
        </div>

        <div className="rounded-2xl border border-brand-100/70 bg-card p-3 shadow-soft sm:p-4">
          <TeamSelector value={teams} onChange={setTeams} />
        </div>

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="brand"
            size="lg"
            onClick={() => setConfirmOpen(true)}
            disabled={submitting || teams.length === 0}
            className="h-11 w-full text-sm font-semibold shadow-glow"
          >
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trophy className="mr-2 h-4 w-4" />
            )}
            응원팀 등록하기
          </Button>
          {isFirstTime ? (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={handleSkip}
              disabled={skipping || submitting}
              className="h-11 w-full text-sm font-semibold text-muted-foreground"
            >
              {skipping ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              건너뛰고 자유 게시판부터 둘러보기
            </Button>
          ) : (
            <Button
              asChild
              type="button"
              variant="ghost"
              size="lg"
              className="h-11 w-full text-sm font-semibold text-muted-foreground"
            >
              <Link to="/">홈으로 돌아가기</Link>
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="이 응원팀으로 등록할까요?"
        description={`선택한 ${teams.length}개 종목의 응원팀은 이후 변경할 수 없어요. 신중히 결정해 주세요.`}
        confirmLabel="등록"
        cancelLabel="다시 고르기"
        loading={submitting}
        onConfirm={handleSave}
      />
    </AuthLayout>
  );
}
