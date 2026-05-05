import type { ActiveTeamRanking } from '@/features/teams/types/team';
import { teamsByLeague } from './data';

/**
 * 백엔드 통계 endpoint(`GET /stats/teams/most-active`) 가 추가되기 전 풍부한 UX를
 * 보장하기 위한 mock. sport 파라미터로 필터링한다.
 */

interface RawEntry {
  teamId: number;
  teamName: string;
  sportName: string; // '축구' | '야구' | '농구' | '배구'
  followerCount: number;
  avgPostsPerDay: number;
}

const RAW: RawEntry[] = [
  // 축구
  {
    teamId: 101,
    teamName: '전북 현대 모터스',
    sportName: '축구',
    followerCount: 12400,
    avgPostsPerDay: 23,
  },
  {
    teamId: 102,
    teamName: '울산 HD FC',
    sportName: '축구',
    followerCount: 7200,
    avgPostsPerDay: 14,
  },
  { teamId: 103, teamName: 'FC 서울', sportName: '축구', followerCount: 5400, avgPostsPerDay: 11 },
  {
    teamId: 104,
    teamName: '수원 삼성 블루윙즈',
    sportName: '축구',
    followerCount: 4100,
    avgPostsPerDay: 9,
  },
  {
    teamId: 105,
    teamName: '포항 스틸러스',
    sportName: '축구',
    followerCount: 2800,
    avgPostsPerDay: 6,
  },

  // 야구
  {
    teamId: 201,
    teamName: 'LG 트윈스',
    sportName: '야구',
    followerCount: 9800,
    avgPostsPerDay: 18,
  },
  {
    teamId: 203,
    teamName: 'KIA 타이거즈',
    sportName: '야구',
    followerCount: 4800,
    avgPostsPerDay: 9,
  },
  {
    teamId: 204,
    teamName: '두산 베어스',
    sportName: '야구',
    followerCount: 4500,
    avgPostsPerDay: 8,
  },
  {
    teamId: 205,
    teamName: 'SSG 랜더스',
    sportName: '야구',
    followerCount: 3900,
    avgPostsPerDay: 7,
  },
  {
    teamId: 207,
    teamName: '한화 이글스',
    sportName: '야구',
    followerCount: 3200,
    avgPostsPerDay: 6,
  },

  // 농구
  {
    teamId: 301,
    teamName: '서울 SK 나이츠',
    sportName: '농구',
    followerCount: 1800,
    avgPostsPerDay: 4,
  },
  {
    teamId: 302,
    teamName: '안양 정관장',
    sportName: '농구',
    followerCount: 1200,
    avgPostsPerDay: 3,
  },
  {
    teamId: 303,
    teamName: '원주 DB 프로미',
    sportName: '농구',
    followerCount: 900,
    avgPostsPerDay: 2,
  },

  // 배구
  {
    teamId: 401,
    teamName: '대한항공 점보스',
    sportName: '배구',
    followerCount: 600,
    avgPostsPerDay: 1,
  },
  {
    teamId: 402,
    teamName: '현대캐피탈 스카이워커스',
    sportName: '배구',
    followerCount: 480,
    avgPostsPerDay: 1,
  },
];

function withRank(items: Omit<ActiveTeamRanking, 'rank'>[]): ActiveTeamRanking[] {
  return items.map((it, i) => ({ ...it, rank: i + 1 }));
}

const allTeams = Object.values(teamsByLeague).flat();

function toRanking(items: RawEntry[]): Omit<ActiveTeamRanking, 'rank'>[] {
  return items.map((r) => ({
    team: {
      id: r.teamId,
      name: r.teamName,
      logoUrl: allTeams.find((t) => t.id === r.teamId)?.logoUrl ?? null,
    },
    sportName: r.sportName,
    followerCount: r.followerCount,
    avgPostsPerDay: r.avgPostsPerDay,
  }));
}

export type RankingMetric = 'FOLLOWERS' | 'AVG_POSTS';

/**
 * 정렬 기준(metric) + 종목 필터(sport) 별로 Top N 팀을 반환.
 * - FOLLOWERS: 응원자(팔로워) 수 내림차순
 * - AVG_POSTS: 일평균 게시글 수 내림차순
 * - sport='ALL' | '축구' | '야구' | '농구' | '배구'
 */
export function getRankedTeams(
  metric: RankingMetric,
  sport: string,
  size: number,
): ActiveTeamRanking[] {
  const filtered = sport === 'ALL' ? RAW : RAW.filter((r) => r.sportName === sport);
  const sorted = [...filtered]
    .sort((a, b) =>
      metric === 'FOLLOWERS'
        ? b.followerCount - a.followerCount
        : b.avgPostsPerDay - a.avgPostsPerDay,
    )
    .slice(0, size);
  return withRank(toRanking(sorted));
}
