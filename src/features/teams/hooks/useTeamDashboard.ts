import { useQuery } from '@tanstack/react-query';
import { teamApi } from '../api/teamApi';

export function useTeamDashboard(teamId: number | null | undefined) {
  return useQuery({
    queryKey: ['teams', teamId, 'dashboard'],
    queryFn: () => teamApi.getDashboard(teamId!),
    enabled: teamId !== null && teamId !== undefined,
    staleTime: 5 * 60 * 1000, // 5분 — 경기 일정/순위는 자주 바뀌지 않음
  });
}
