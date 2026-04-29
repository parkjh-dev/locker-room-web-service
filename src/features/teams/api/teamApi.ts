import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { TeamDashboard, ActiveTeamRanking } from '../types/team';

export const teamApi = {
  /** 게시판 헤더용 팀 대시보드 — 팀 정보 + 다음 경기 + 최근 5경기 + 현재 순위 */
  getDashboard: (teamId: number) =>
    api.get<ApiResponse<TeamDashboard>>(`/teams/${teamId}/dashboard`).then((r) => r.data.data),

  /**
   * 팀 랭킹 통계 — metric으로 정렬 기준 결정.
   * - FOLLOWERS: 응원자(팔로워) 수
   * - AVG_POSTS: 일평균 게시글 수
   */
  getRanking: (metric: 'FOLLOWERS' | 'AVG_POSTS', sport: string, size = 3) =>
    api
      .get<ApiResponse<ActiveTeamRanking[]>>('/stats/teams/ranking', {
        params: { metric, sport, size },
      })
      .then((r) => r.data.data),
};
