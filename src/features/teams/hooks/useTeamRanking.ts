import { useQuery } from '@tanstack/react-query';
import { teamApi } from '../api/teamApi';

export type RankingMetric = 'FOLLOWERS' | 'AVG_POSTS';

export function useTeamRanking(metric: RankingMetric, sport: string, size = 3) {
  return useQuery({
    queryKey: ['stats', 'teams', 'ranking', metric, sport, size],
    queryFn: () => teamApi.getRanking(metric, sport, size),
    staleTime: 5 * 60 * 1000,
  });
}
