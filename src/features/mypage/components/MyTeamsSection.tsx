import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Lock, Plus, Trophy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TeamSelector } from '@/components/common/TeamSelector';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { authApi } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/features/auth/stores/authStore';
import type { Sport } from '@/features/auth/types/auth';
import type { SportTeamPair, UserTeam } from '@/types/common';

const SPORT_ICON: Record<string, string> = {
  축구: '⚽',
  야구: '⚾',
  농구: '🏀',
  배구: '🏐',
};

interface Props {
  teams: UserTeam[];
}

export function MyTeamsSection({ teams }: Props) {
  const [addSportId, setAddSportId] = useState<number | null>(null);

  const { data: sports = [] } = useQuery<Sport[]>({
    queryKey: ['sports'],
    queryFn: authApi.getSports,
    staleTime: 5 * 60 * 1000,
  });

  const teamBySport = new Map(teams.map((t) => [t.sportId, t]));

  return (
    <section className="rounded-2xl border border-brand-100/70 bg-card p-5 shadow-soft sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-brand-700">
          응원팀
        </h3>
        <span className="text-[10px] font-medium text-muted-foreground">
          한 번 등록한 종목은 변경할 수 없어요
        </span>
      </div>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {sports.map((sport) => {
          const team = teamBySport.get(sport.id);
          const icon = SPORT_ICON[sport.name];

          if (team) {
            return (
              <div
                key={sport.id}
                className="flex items-center gap-3 rounded-xl border border-brand-100/70 bg-gradient-to-br from-brand-50/60 to-card p-3.5"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-card text-2xl shadow-xs">
                  {icon ?? '🏆'}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-muted-foreground">{sport.name}</p>
                  <p className="truncate text-sm font-semibold">{team.teamName}</p>
                </div>
                <Lock
                  className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                  aria-label="변경 불가"
                />
              </div>
            );
          }

          return (
            <button
              key={sport.id}
              type="button"
              onClick={() => setAddSportId(sport.id)}
              className="card-interactive group flex items-center gap-3 rounded-xl border border-dashed border-brand-200 bg-card p-3.5 text-left"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-2xl">
                {icon ?? '🏆'}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-muted-foreground">{sport.name}</p>
                <p className="text-sm font-semibold text-brand-700">응원팀 추가</p>
              </div>
              <Plus className="h-4 w-4 shrink-0 text-brand-700 transition-transform group-hover:rotate-90" />
            </button>
          );
        })}
      </div>

      <AddTeamModal
        sportId={addSportId}
        sportName={sports.find((s) => s.id === addSportId)?.name}
        onClose={() => setAddSportId(null)}
      />
    </section>
  );
}

function AddTeamModal({
  sportId,
  sportName,
  onClose,
}: {
  sportId: number | null;
  sportName?: string;
  onClose: () => void;
}) {
  const [picked, setPicked] = useState<SportTeamPair[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (teams: SportTeamPair[]) => authApi.addUserTeams({ teams }),
    onSuccess: (profile) => {
      setUser(profile);
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
      // 새 응원팀이 등록되면 보이는 게시판 목록도 바뀜
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast.success('응원팀이 등록되었습니다.');
      handleClose();
    },
    onError: () => {
      toast.error('응원팀 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
      setConfirmOpen(false);
    },
  });

  const handleClose = () => {
    setPicked([]);
    setConfirmOpen(false);
    onClose();
  };

  const open = sportId !== null;
  const pickedTeam = picked[0];

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-brand-700" />
              {sportName ? `${sportName} 응원팀 등록` : '응원팀 등록'}
            </DialogTitle>
            <DialogDescription>
              한 번 등록하면 변경할 수 없어요. 신중히 선택해 주세요.
            </DialogDescription>
          </DialogHeader>

          {sportId !== null && (
            <div className="rounded-xl border border-brand-100/70 bg-card p-3">
              <TeamSelector
                value={picked}
                onChange={(v) => setPicked(v.slice(-1))}
                lockedSportId={sportId}
              />
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="ghost" onClick={handleClose}>
              취소
            </Button>
            <Button
              variant="brand"
              onClick={() => setConfirmOpen(true)}
              disabled={!pickedTeam || addMutation.isPending}
            >
              {addMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              등록하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="이 응원팀으로 등록할까요?"
        description={`${sportName} 종목의 응원팀은 이후 변경할 수 없어요.`}
        confirmLabel="등록"
        cancelLabel="다시 고르기"
        loading={addMutation.isPending}
        onConfirm={() => pickedTeam && addMutation.mutate([pickedTeam])}
      />
    </>
  );
}
