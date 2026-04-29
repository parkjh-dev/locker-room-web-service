/**
 * 팀 게시판 헤더용 mock 대시보드 — 백엔드 endpoint(`GET /teams/:id/dashboard`)
 * 가 추가되기 전 풍부한 UX를 보장하기 위한 더미.
 */
import type { TeamDashboard, MatchResult } from '@/features/teams/types/team';

const HOURS = 60 * 60 * 1000;
const DAYS = 24 * HOURS;

function iso(offsetMs: number) {
  return new Date(Date.now() + offsetMs).toISOString();
}

function makeRecent(
  id: number,
  daysAgo: number,
  competitionName: string,
  opponent: { id: number; name: string },
  isHome: boolean,
  teamScore: number,
  opponentScore: number,
) {
  let result: MatchResult;
  if (teamScore > opponentScore) result = 'WIN';
  else if (teamScore < opponentScore) result = 'LOSS';
  else result = 'DRAW';
  return {
    id,
    competitionName,
    opponent: { id: opponent.id, name: opponent.name, logoUrl: null },
    isHome,
    teamScore,
    opponentScore,
    result,
    playedAt: iso(-daysAgo * DAYS),
  };
}

/* ────────────────────────────────────────────────
 * teamId별 사전 정의 — 매핑이 없는 팀은 fallback 대시보드 사용
 * ──────────────────────────────────────────────── */

export const TEAM_DASHBOARDS: Record<number, TeamDashboard> = {
  // 전북 현대 모터스 (teamId=101)
  101: {
    team: {
      id: 101,
      name: '전북 현대 모터스',
      logoUrl: null,
      leagueName: 'K리그1',
      founded: 1994,
      venue: '전주월드컵경기장',
      description:
        'K리그1의 대표 명문 클럽. 9차례 K리그 우승과 2차례 AFC 챔피언스리그 우승 경력을 보유한 한국 최고의 축구 클럽 중 하나입니다.',
    },
    season: '2026',
    nextMatch: {
      id: 9001,
      competitionName: 'K리그1 14R',
      opponent: { id: 102, name: '울산 HD FC', logoUrl: null },
      isHome: true,
      venue: '전주월드컵경기장',
      kickoffAt: iso(3 * DAYS + 2 * HOURS),
    },
    recentMatches: [
      makeRecent(8001, 4, 'K리그1', { id: 105, name: '포항 스틸러스' }, false, 2, 1),
      makeRecent(8002, 11, 'FA컵', { id: 103, name: 'FC 서울' }, true, 3, 0),
      makeRecent(8003, 18, 'K리그1', { id: 104, name: '수원 삼성 블루윙즈' }, true, 1, 1),
      makeRecent(8004, 25, 'K리그1', { id: 106, name: '대구 FC' }, false, 0, 2),
      makeRecent(8005, 32, 'AFC 챔피언스리그', { id: 999, name: '요코하마 마리노스' }, true, 2, 0),
    ],
    standing: {
      rank: 3,
      totalTeams: 12,
      matchesPlayed: 13,
      wins: 7,
      draws: 4,
      losses: 2,
      points: 25,
      goalsFor: 22,
      goalsAgainst: 11,
      goalDifference: 11,
    },
  },

  // 울산 HD FC (teamId=102)
  102: {
    team: {
      id: 102,
      name: '울산 HD FC',
      logoUrl: null,
      leagueName: 'K리그1',
      founded: 1983,
      venue: '울산문수축구경기장',
      description:
        '1983년 창단된 K리그 명문 클럽. 최근 K리그1 우승을 차지한 강팀으로, 화려한 공격 축구로 유명합니다.',
    },
    season: '2026',
    nextMatch: {
      id: 9002,
      competitionName: 'K리그1 14R',
      opponent: { id: 101, name: '전북 현대 모터스', logoUrl: null },
      isHome: false,
      venue: '전주월드컵경기장',
      kickoffAt: iso(3 * DAYS + 2 * HOURS),
    },
    recentMatches: [
      makeRecent(8101, 5, 'K리그1', { id: 103, name: 'FC 서울' }, true, 3, 1),
      makeRecent(8102, 12, 'K리그1', { id: 104, name: '수원 삼성 블루윙즈' }, false, 1, 0),
      makeRecent(8103, 19, 'K리그1', { id: 105, name: '포항 스틸러스' }, true, 2, 2),
      makeRecent(8104, 26, 'K리그1', { id: 106, name: '대구 FC' }, true, 4, 0),
      makeRecent(8105, 33, 'K리그1', { id: 101, name: '전북 현대 모터스' }, false, 1, 2),
    ],
    standing: {
      rank: 1,
      totalTeams: 12,
      matchesPlayed: 13,
      wins: 9,
      draws: 2,
      losses: 2,
      points: 29,
      goalsFor: 28,
      goalsAgainst: 10,
      goalDifference: 18,
    },
  },

  // LG 트윈스 (teamId=201)
  201: {
    team: {
      id: 201,
      name: 'LG 트윈스',
      logoUrl: null,
      leagueName: 'KBO 리그',
      founded: 1990,
      venue: '잠실야구장',
      description:
        '서울을 연고로 하는 KBO 명문 구단. 트윈스의 상징 적성색 줄무늬 유니폼과 열정적인 응원 문화로 유명합니다.',
    },
    season: '2026',
    nextMatch: {
      id: 9201,
      competitionName: 'KBO 정규시즌',
      opponent: { id: 203, name: 'KIA 타이거즈', logoUrl: null },
      isHome: true,
      venue: '잠실야구장',
      kickoffAt: iso(1 * DAYS + 4 * HOURS),
    },
    recentMatches: [
      makeRecent(8201, 1, 'KBO', { id: 204, name: '두산 베어스' }, true, 7, 5),
      makeRecent(8202, 2, 'KBO', { id: 204, name: '두산 베어스' }, true, 4, 3),
      makeRecent(8203, 4, 'KBO', { id: 205, name: 'SSG 랜더스' }, false, 2, 8),
      makeRecent(8204, 5, 'KBO', { id: 205, name: 'SSG 랜더스' }, false, 6, 4),
      makeRecent(8205, 6, 'KBO', { id: 206, name: '롯데 자이언츠' }, true, 5, 1),
    ],
    standing: {
      rank: 2,
      totalTeams: 10,
      matchesPlayed: 38,
      wins: 23,
      draws: 1,
      losses: 14,
      points: 0, // KBO는 승률 기반이지만 표시 통일을 위해 0
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
    },
  },

  // KIA 타이거즈 (teamId=203)
  203: {
    team: {
      id: 203,
      name: 'KIA 타이거즈',
      logoUrl: null,
      leagueName: 'KBO 리그',
      founded: 1982,
      venue: '광주-기아 챔피언스 필드',
      description:
        'KBO 최다 우승(11회)을 자랑하는 호남의 명문 구단. 타이거즈 왕조의 영광을 이어가고 있습니다.',
    },
    season: '2026',
    nextMatch: {
      id: 9203,
      competitionName: 'KBO 정규시즌',
      opponent: { id: 201, name: 'LG 트윈스', logoUrl: null },
      isHome: false,
      venue: '잠실야구장',
      kickoffAt: iso(1 * DAYS + 4 * HOURS),
    },
    recentMatches: [
      makeRecent(8301, 1, 'KBO', { id: 207, name: '한화 이글스' }, true, 9, 3),
      makeRecent(8302, 2, 'KBO', { id: 207, name: '한화 이글스' }, true, 6, 7),
      makeRecent(8303, 4, 'KBO', { id: 208, name: '키움 히어로즈' }, false, 5, 2),
      makeRecent(8304, 5, 'KBO', { id: 208, name: '키움 히어로즈' }, false, 4, 4),
      makeRecent(8305, 6, 'KBO', { id: 205, name: 'SSG 랜더스' }, true, 3, 5),
    ],
    standing: {
      rank: 1,
      totalTeams: 10,
      matchesPlayed: 38,
      wins: 25,
      draws: 0,
      losses: 13,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
    },
  },
};

/** 매핑이 없는 팀에 사용하는 fallback 대시보드 */
export function fallbackTeamDashboard(teamId: number, teamName: string): TeamDashboard {
  return {
    team: {
      id: teamId,
      name: teamName,
      logoUrl: null,
      leagueName: '리그 정보 준비 중',
      founded: null,
      venue: null,
      description: '팀 소개가 준비되는 중입니다. 곧 풍부한 정보로 만나뵐게요.',
    },
    season: '2026',
    nextMatch: null,
    recentMatches: [],
    standing: null,
  };
}
