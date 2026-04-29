/** 경기 결과 — 승/무/패 */
export type MatchResult = 'WIN' | 'DRAW' | 'LOSS';

/** 상대팀 (요약) */
export interface OpponentBrief {
  id: number;
  name: string;
  logoUrl: string | null;
}

/** 다음 예정 경기 */
export interface UpcomingMatch {
  id: number;
  competitionName: string;
  opponent: OpponentBrief;
  isHome: boolean;
  venue: string;
  /** ISO 8601 */
  kickoffAt: string;
}

/** 종료된 경기 (최근 N경기) */
export interface RecentMatch {
  id: number;
  competitionName: string;
  opponent: OpponentBrief;
  isHome: boolean;
  teamScore: number;
  opponentScore: number;
  result: MatchResult;
  /** ISO 8601 */
  playedAt: string;
}

/** 리그 순위 정보 */
export interface TeamStanding {
  rank: number;
  totalTeams: number;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

/** 팀 메타 정보 */
export interface TeamProfile {
  id: number;
  name: string;
  logoUrl: string | null;
  leagueName: string;
  /** 창단 연도 */
  founded: number | null;
  /** 홈구장 */
  venue: string | null;
  /** 팀 소개 (한두 문단) */
  description: string;
}

/** "가장 활발한 팀" 통계 — 메인 페이지 위젯 */
export interface ActiveTeamRanking {
  rank: number;
  team: {
    id: number;
    name: string;
    logoUrl: string | null;
  };
  sportName: string;
  /** 이 팀을 응원으로 등록한 사용자 수 */
  followerCount: number;
  /** 일일 평균 게시글 수 (최근 N일) */
  avgPostsPerDay: number;
}

/** 게시판 헤더 통합 응답 — round-trip 1번에 모든 정보 노출 */
export interface TeamDashboard {
  team: TeamProfile;
  /** 시즌 표기 — 종목·리그별 포맷이 다름 (예: "2026", "2025-26") */
  season: string;
  nextMatch: UpcomingMatch | null;
  /** 최신 → 과거 순 */
  recentMatches: RecentMatch[];
  standing: TeamStanding | null;
}
