/**
 * MSW API Handlers
 * http://localhost:8080/api/v1 기준 전체 엔드포인트
 */
import { http, HttpResponse } from 'msw';
import {
  sports,
  teamsBySport,
  continents,
  countries,
  leagues,
  teamsByLeague,
  boards,
  postListItems,
  postDetailsById,
  commentsByPost,
  noticeListItems,
  noticeDetailsById,
  notifications,
  userProfile,
  adminProfile,
  myPosts,
  myComments,
  myLikes,
  inquiryListItems,
  inquiryDetailsById,
  requestListItems,
  requestDetailsById,
  adminDashboard,
  adminUsers,
  adminReports,
  adminNotices,
  adminInquiries,
  adminRequests,
} from './data';

import { TEAM_DASHBOARDS, fallbackTeamDashboard } from './teamDashboards';
import { getRankedTeams, type RankingMetric } from './teamStats';

const BASE = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082'}/api/v1`;

/** ApiResponse 래핑 헬퍼 */
function ok<T>(data: T) {
  return HttpResponse.json({ code: 'SUCCESS', message: '성공', data });
}

/** 404 헬퍼 */
function notFound(code: string, message: string) {
  return HttpResponse.json({ code, message, data: null }, { status: 404 });
}

/** CursorPageResponse 래핑 헬퍼 (커서 기반 페이지네이션) */
const PAGE_SIZE = 10;
function cursorPage<T extends { id: number }>(allItems: T[], request: Request) {
  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor');
  let startIndex = 0;
  if (cursor) {
    const cursorId = Number(cursor);
    const idx = allItems.findIndex((item) => item.id === cursorId);
    startIndex = idx === -1 ? 0 : idx + 1;
  }
  const items = allItems.slice(startIndex, startIndex + PAGE_SIZE);
  const hasNext = startIndex + PAGE_SIZE < allItems.length;
  const nextCursor = hasNext ? String(items[items.length - 1].id) : null;
  return ok({ items, nextCursor, hasNext });
}

// ─── 게시글 카테고리/투표 더미 부여 (mock 데이터에 없는 신규 필드) ───
const CATEGORY_CYCLE = ['REVIEW', 'PREDICTION', 'QUESTION', 'MEME', 'NEWS', 'GENERAL'] as const;

function pickCategory(id: number): (typeof CATEGORY_CYCLE)[number] {
  return CATEGORY_CYCLE[id % CATEGORY_CYCLE.length];
}

function makeMockPoll(postId: number) {
  // id 모듈로 분기 — 일부 글에만 다양한 형태의 투표가 노출되도록
  const variants = [
    {
      question: '오늘 경기 MVP는?',
      options: ['손흥민', '황희찬', '이강인', '김민재'],
    },
    {
      question: '이번 시즌 우승팀 예상',
      options: ['전북 현대', '울산 HD', 'FC 서울'],
    },
    {
      question: '경기 결과 어땠나요?',
      options: ['최고였어요', '아쉬웠어요'],
    },
  ];
  const v = variants[postId % variants.length];
  const baseVotes = [42, 28, 15, 9, 4];
  const options = v.options.map((text, i) => ({
    id: i + 1,
    text,
    voteCount: baseVotes[i] ?? 1,
  }));
  return {
    question: v.question,
    options,
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    totalVotes: options.reduce((acc, o) => acc + o.voteCount, 0),
    myVoteOptionId: null as number | null,
  };
}

function hasMockPoll(id: number): boolean {
  return id % 7 === 0; // 7개당 1개 글에 투표 부여
}

function enrichListItem<T extends { id: number }>(item: T) {
  return {
    ...item,
    category: pickCategory(item.id),
    hasPoll: hasMockPoll(item.id),
  };
}

// 서버처럼 동작하도록 postId별 poll 인스턴스를 보관 (투표하면 해당 인스턴스가 갱신됨)
const pollStore = new Map<number, ReturnType<typeof makeMockPoll>>();

function getOrCreatePoll(postId: number) {
  if (!pollStore.has(postId)) {
    pollStore.set(postId, makeMockPoll(postId));
  }
  return pollStore.get(postId)!;
}

function enrichDetail<T extends { id: number }>(detail: T) {
  return {
    ...detail,
    category: pickCategory(detail.id),
    poll: hasMockPoll(detail.id) ? getOrCreatePoll(detail.id) : null,
  };
}

/**
 * post detail 폴백:
 * id 매핑이 없는 글이라도 list item을 기반으로 그럴듯한 상세를 만들어 반환.
 * (라우터에서 임의 id로 들어와도 404가 아닌 풍부한 화면을 보여주기 위함)
 */
function fallbackPostDetail(postId: number) {
  const item = postListItems.find((p) => p.id === postId);
  if (!item) return null;
  return {
    id: item.id,
    boardId: 1,
    boardName: '자유게시판',
    author: { id: 99, nickname: item.authorNickname, teamName: undefined, profileImageUrl: null },
    title: item.title,
    content:
      `${item.title}\n\n` +
      '아직 상세 본문이 등록되지 않은 게시글입니다.\n' +
      '목록 데이터 기반으로 자동 생성된 더미 본문이며, 실제 서비스에서는 상세 콘텐츠가 표시됩니다.',
    viewCount: item.viewCount,
    likeCount: item.likeCount,
    commentCount: item.commentCount,
    isAiGenerated: item.isAiGenerated,
    isLiked: false,
    files: [],
    createdAt: item.createdAt,
    updatedAt: item.createdAt,
  };
}

export const handlers = [
  // ──────────────────────────────────────────────
  // Auth
  // ──────────────────────────────────────────────
  http.post(`${BASE}/auth/signup`, () => ok({ id: 100 })),
  http.post(`${BASE}/auth/profile/complete`, () => ok({ id: 100 })),

  // 휴대폰 인증번호 발송 — 항상 성공으로 응답 (mock 발송코드: 123456)
  http.post(`${BASE}/auth/phone/verification`, () => ok({ expiresInSec: 180 })),

  // 휴대폰 인증번호 검증 — 123456만 통과
  http.post(`${BASE}/auth/phone/verification/confirm`, async ({ request }) => {
    const body = (await request.json()) as { phone: string; code: string };
    if (body.code === '123456') return ok({ verified: true });
    return HttpResponse.json(
      {
        code: 'PHONE_VERIFICATION_INVALID',
        message: '인증번호가 일치하지 않습니다.',
        data: null,
      },
      { status: 400 },
    );
  }),

  // 이메일 인증 메일 재발송 — 항상 성공
  http.post(`${BASE}/auth/email/verification/resend`, () => ok(null)),

  // 이메일 인증 토큰 검증 — 'invalid' 토큰만 실패, 그 외 모두 성공 + userProfile 인증 처리
  http.post(`${BASE}/auth/email/verification/confirm`, async ({ request }) => {
    const body = (await request.json()) as { token: string };
    if (!body?.token || body.token === 'invalid') {
      return HttpResponse.json(
        {
          code: 'EMAIL_VERIFICATION_INVALID',
          message: '유효하지 않거나 만료된 토큰입니다.',
          data: null,
        },
        { status: 400 },
      );
    }
    userProfile.emailVerified = true;
    return ok({ verified: true });
  }),

  // 아이디(가입 이메일) 찾기 — 휴대폰 본인확인 결과 기반 마스킹 이메일 반환.
  // mock 규칙:
  //   · 끝자리 0  → 가입 이력 없음 (found:false)
  //   · 끝자리 8  → 카카오 가입 시뮬 (provider: KAKAO)
  //   · 그 외     → 이메일 자체가입 (provider: EMAIL)
  http.post(`${BASE}/auth/account/find/id`, async ({ request }) => {
    const body = (await request.json()) as { phone: string };
    const phone = body?.phone ?? '';
    const last = phone.slice(-1);
    if (last === '0') {
      return ok({ found: false, maskedEmail: null, provider: null, createdAt: null });
    }
    const provider = last === '8' ? 'KAKAO' : 'EMAIL';
    return ok({
      found: true,
      maskedEmail: 's****r_fan@example.com',
      provider,
      createdAt: '2026-01-15T08:30:00',
    });
  }),

  // ──────────────────────────────────────────────
  // Sports & Cascading 4-step (Sport → Country → League → Team)
  // ──────────────────────────────────────────────
  http.get(`${BASE}/sports`, () => ok(sports)),

  // 종목별 국가 (해당 종목의 리그가 등록된 국가만 반환)
  http.get(`${BASE}/sports/:sportId/countries`, ({ params }) => {
    const sportId = Number(params.sportId);
    const countryIds = new Set(
      leagues.filter((l) => l.sportId === sportId).map((l) => l.countryId),
    );
    const result = countries
      .filter((c) => countryIds.has(c.id))
      // 한국을 최상단으로
      .sort((a, b) => (a.code === 'KR' ? -1 : b.code === 'KR' ? 1 : 0));
    return ok(result);
  }),

  // 종목·국가별 리그
  http.get(`${BASE}/sports/:sportId/countries/:countryId/leagues`, ({ params }) => {
    const sportId = Number(params.sportId);
    const countryId = Number(params.countryId);
    return ok(leagues.filter((l) => l.sportId === sportId && l.countryId === countryId));
  }),

  // 리그별 팀
  http.get(`${BASE}/leagues/:leagueId/teams`, ({ params }) => {
    const leagueId = Number(params.leagueId);
    return ok(teamsByLeague[leagueId] ?? []);
  }),

  // 팀 랭킹 통계 — metric(FOLLOWERS|AVG_POSTS) + sport 필터 지원
  http.get(`${BASE}/stats/teams/ranking`, ({ request }) => {
    const url = new URL(request.url);
    const metric = (url.searchParams.get('metric') ?? 'FOLLOWERS') as RankingMetric;
    const sport = url.searchParams.get('sport') ?? 'ALL';
    const size = Number(url.searchParams.get('size') ?? '3');
    return ok(getRankedTeams(metric, sport, size));
  }),

  // 팀 게시판 헤더용 대시보드 (다음 경기 + 최근 5경기 + 순위 + 팀 소개)
  http.get(`${BASE}/teams/:teamId/dashboard`, ({ params }) => {
    const teamId = Number(params.teamId);
    const dashboard = TEAM_DASHBOARDS[teamId];
    if (dashboard) return ok(dashboard);

    // 매핑 없을 때 — boards에서 teamName을 찾아 fallback 생성
    const board = boards.find((b) => b.teamId === teamId);
    return ok(fallbackTeamDashboard(teamId, board?.teamName ?? '응원팀'));
  }),

  // (deprecated) 종목별 전체 팀 — 호환 유지
  http.get(`${BASE}/sports/:sportId/teams`, ({ params }) => {
    const sportId = Number(params.sportId);
    return ok(teamsBySport[sportId] ?? []);
  }),

  // 단일 continent 조회 등 부수 endpoint는 필요 시 추가
  http.get(`${BASE}/continents`, () => ok(continents)),

  // ──────────────────────────────────────────────
  // Boards — 인증된 사용자 기준 필터링
  // 비인증/관리자: 전체 노출
  // 일반 사용자: 공통 게시판(teamId=null) + 본인 응원팀 게시판만
  // ──────────────────────────────────────────────
  http.get(`${BASE}/boards`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth || auth.includes('admin')) return ok(boards);

    const profile = userProfile;
    const userTeamIds = new Set(profile.teams.map((t) => t.teamId));
    const accessible = boards.filter((b) => b.teamId === null || userTeamIds.has(b.teamId));
    return ok(accessible);
  }),

  // ──────────────────────────────────────────────
  // Posts
  // ──────────────────────────────────────────────
  // boardId가 팀 게시판이면 'AI 어시스턴트' 글은 제외 (팀 게시판은 사용자 글 위주)
  // sort=likeCount 시 좋아요 순 정렬
  http.get(`${BASE}/boards/:boardId/posts`, ({ params, request }) => {
    const boardId = Number(params.boardId);
    const board = boards.find((b) => b.id === boardId);
    const url = new URL(request.url);
    const sort = url.searchParams.get('sort');

    let list = postListItems;
    if (board?.type === 'TEAM') {
      list = postListItems.filter((p) => !p.isAiGenerated);
    } else if (board?.type === 'NEWS') {
      list = postListItems.filter((p) => p.isAiGenerated);
    } else if (board?.type === 'QNA') {
      // 질문 형태('?'가 들어간 제목) 위주
      list = postListItems.filter((p) => p.title.includes('?') || p.title.includes('어떻게'));
    }

    if (sort === 'likeCount') {
      list = [...list].sort((a, b) => b.likeCount - a.likeCount);
    }
    return cursorPage(list.map(enrichListItem), request);
  }),
  http.get(`${BASE}/posts/popular`, ({ request }) => {
    const url = new URL(request.url);
    const size = Number(url.searchParams.get('size') ?? '10');
    const sorted = [...postListItems]
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, size)
      .map(enrichListItem);
    return ok(sorted);
  }),
  http.get(`${BASE}/posts/:postId`, ({ params }) => {
    const postId = Number(params.postId);
    const detail = postDetailsById[postId] ?? fallbackPostDetail(postId);
    if (!detail) return notFound('POST_NOT_FOUND', '게시글을 찾을 수 없습니다.');
    return ok(enrichDetail(detail));
  }),
  http.post(`${BASE}/posts`, () => ok({ id: 100 })),
  http.put(`${BASE}/posts/:postId`, ({ params }) => ok({ id: Number(params.postId) })),
  http.post(`${BASE}/posts/:postId/vote`, async ({ params, request }) => {
    const postId = Number(params.postId);
    const body = (await request.json()) as { optionId: number };
    const poll = getOrCreatePoll(postId);
    if (poll.myVoteOptionId !== null) {
      return ok(poll); // 이미 투표함 — idempotent
    }
    const target = poll.options.find((o) => o.id === body.optionId);
    if (!target) {
      return HttpResponse.json(
        { code: 'POLL_OPTION_INVALID', message: '존재하지 않는 옵션입니다.', data: null },
        { status: 400 },
      );
    }
    target.voteCount += 1;
    poll.totalVotes += 1;
    poll.myVoteOptionId = body.optionId;
    return ok(poll);
  }),
  http.delete(`${BASE}/posts/:postId`, () => ok(null)),
  http.post(`${BASE}/posts/:postId/like`, ({ params }) => {
    const postId = Number(params.postId);
    const item = postListItems.find((p) => p.id === postId);
    return ok({
      postId,
      isLiked: true,
      likeCount: (item?.likeCount ?? 0) + 1,
    });
  }),
  http.post(`${BASE}/posts/:postId/report`, () => ok(null)),

  // ──────────────────────────────────────────────
  // Comments
  // ──────────────────────────────────────────────
  http.get(`${BASE}/posts/:postId/comments`, ({ params, request }) => {
    const postId = Number(params.postId);
    const list = commentsByPost[postId] ?? [];
    return cursorPage(list, request);
  }),
  http.post(`${BASE}/posts/:postId/comments`, () => ok({ id: 1000 })),
  http.post(`${BASE}/comments/:commentId/replies`, () => ok({ id: 1001 })),
  http.put(`${BASE}/comments/:commentId`, ({ params }) => ok({ id: Number(params.commentId) })),
  http.delete(`${BASE}/comments/:commentId`, () => ok(null)),

  // ──────────────────────────────────────────────
  // Notices
  // ──────────────────────────────────────────────
  http.get(`${BASE}/notices`, ({ request }) => cursorPage(noticeListItems, request)),
  http.get(`${BASE}/notices/:noticeId`, ({ params }) => {
    const noticeId = Number(params.noticeId);
    const detail = noticeDetailsById[noticeId];
    if (!detail) return notFound('NOTICE_NOT_FOUND', '공지를 찾을 수 없습니다.');
    return ok(detail);
  }),

  // ──────────────────────────────────────────────
  // Users / MyPage
  // ──────────────────────────────────────────────
  http.get(`${BASE}/users/me`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) {
      return HttpResponse.json(
        { code: 'AUTH_UNAUTHORIZED', message: '인증이 필요합니다.', data: null },
        { status: 401 },
      );
    }
    // DevSimulator 토큰: dev-admin-token / dev-user-token
    if (auth.includes('admin')) {
      return ok(adminProfile);
    }
    return ok(userProfile);
  }),
  http.put(`${BASE}/users/me`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as {
      nickname?: string;
      profileImageUrl?: string | null;
    };
    if (typeof body.nickname === 'string') userProfile.nickname = body.nickname;
    if ('profileImageUrl' in body) userProfile.profileImageUrl = body.profileImageUrl ?? null;
    return ok({ id: userProfile.id, nickname: userProfile.nickname });
  }),
  http.delete(`${BASE}/users/me`, () => ok(null)),

  // 응원팀 등록 — 등록한 종목은 변경 불가, 미등록 종목은 추가 가능
  http.post(`${BASE}/users/me/teams`, async ({ request }) => {
    const body = (await request.json()) as { teams: { sportId: number; teamId: number }[] };
    const existingSportIds = new Set(userProfile.teams.map((t) => t.sportId));

    for (const { sportId, teamId } of body.teams ?? []) {
      if (existingSportIds.has(sportId)) continue;

      const sport = sports.find((s) => s.id === sportId);
      const teamList = Object.values(teamsByLeague).flat();
      const team = teamList.find((t) => t.id === teamId);
      if (!sport || !team) continue;

      userProfile.teams.push({
        teamId: team.id,
        teamName: team.name,
        sportId: sport.id,
        sportName: sport.name,
      });
      existingSportIds.add(sportId);
    }
    userProfile.onboardingCompletedAt = new Date().toISOString();
    return ok(userProfile);
  }),

  // 온보딩 건너뛰기
  http.post(`${BASE}/users/me/onboarding/skip`, () => {
    userProfile.onboardingCompletedAt = new Date().toISOString();
    return ok(userProfile);
  }),

  http.get(`${BASE}/users/me/posts`, ({ request }) => cursorPage(myPosts, request)),
  http.get(`${BASE}/users/me/comments`, ({ request }) => cursorPage(myComments, request)),
  http.get(`${BASE}/users/me/likes`, ({ request }) => cursorPage(myLikes, request)),

  // ──────────────────────────────────────────────
  // Notifications
  // ──────────────────────────────────────────────
  http.get(`${BASE}/notifications`, ({ request }) => cursorPage(notifications, request)),
  http.get(`${BASE}/notifications/unread-count`, () =>
    ok({ unreadCount: notifications.filter((n) => !n.isRead).length }),
  ),
  http.put(`${BASE}/notifications/:id/read`, () => ok(null)),
  http.put(`${BASE}/notifications/read-all`, () =>
    ok({ updatedCount: notifications.filter((n) => !n.isRead).length }),
  ),

  // ──────────────────────────────────────────────
  // Inquiries
  // ──────────────────────────────────────────────
  http.get(`${BASE}/inquiries`, ({ request }) => cursorPage(inquiryListItems, request)),
  http.get(`${BASE}/inquiries/:inquiryId`, ({ params }) => {
    const inquiryId = Number(params.inquiryId);
    const detail = inquiryDetailsById[inquiryId];
    if (!detail) return notFound('INQUIRY_NOT_FOUND', '문의를 찾을 수 없습니다.');
    return ok(detail);
  }),
  http.post(`${BASE}/inquiries`, () => ok({ id: 100 })),

  // ──────────────────────────────────────────────
  // Requests
  // ──────────────────────────────────────────────
  http.get(`${BASE}/requests`, ({ request }) => cursorPage(requestListItems, request)),
  http.get(`${BASE}/requests/:requestId`, ({ params }) => {
    const requestId = Number(params.requestId);
    const detail = requestDetailsById[requestId];
    if (!detail) return notFound('REQUEST_NOT_FOUND', '요청을 찾을 수 없습니다.');
    return ok(detail);
  }),
  http.post(`${BASE}/requests`, () => ok({ id: 100 })),

  // ──────────────────────────────────────────────
  // File Upload
  // ──────────────────────────────────────────────
  http.post(`${BASE}/files`, async ({ request }) => {
    // multipart/form-data 안에 'file' 키로 오는 실제 File을 ObjectURL로 변환해 즉시 미리보기 가능
    const form = await request.formData().catch(() => null);
    const file = form?.get('file');
    if (file instanceof File) {
      return ok({
        id: Math.floor(Math.random() * 100000),
        originalName: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        mimeType: file.type || 'application/octet-stream',
      });
    }
    return ok({
      id: Math.floor(Math.random() * 100000),
      originalName: 'image.png',
      url: 'https://placehold.co/600x400',
      size: 102400,
      mimeType: 'image/png',
    });
  }),

  // ──────────────────────────────────────────────
  // Admin
  // ──────────────────────────────────────────────
  http.get(`${BASE}/admin/dashboard`, () => ok(adminDashboard)),
  http.get(`${BASE}/admin/users`, ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword');
    const role = url.searchParams.get('role');
    let list = adminUsers;
    if (keyword) {
      const kw = keyword.toLowerCase();
      list = list.filter(
        (u) => u.nickname.toLowerCase().includes(kw) || u.email.toLowerCase().includes(kw),
      );
    }
    if (role) {
      list = list.filter((u) => u.role === role);
    }
    return cursorPage(list, request);
  }),
  http.put(`${BASE}/admin/users/:userId/suspend`, () => ok(null)),
  http.put(`${BASE}/admin/users/:userId/unsuspend`, () => ok(null)),
  http.get(`${BASE}/admin/reports`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const list = status ? adminReports.filter((r) => r.status === status) : adminReports;
    return cursorPage(list, request);
  }),
  http.put(`${BASE}/admin/reports/:reportId`, () => ok(null)),
  http.get(`${BASE}/admin/notices`, ({ request }) => cursorPage(adminNotices, request)),
  http.post(`${BASE}/admin/notices`, () => ok({ id: 100 })),
  http.put(`${BASE}/admin/notices/:noticeId`, () => ok(null)),
  http.delete(`${BASE}/admin/notices/:noticeId`, () => ok(null)),
  http.get(`${BASE}/admin/inquiries`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const type = url.searchParams.get('type');
    let list = adminInquiries;
    if (status) list = list.filter((i) => i.status === status);
    if (type) list = list.filter((i) => i.type === type);
    return cursorPage(list, request);
  }),
  http.post(`${BASE}/admin/inquiries/:inquiryId/reply`, () => ok(null)),
  http.get(`${BASE}/admin/requests`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const type = url.searchParams.get('type');
    let list = adminRequests;
    if (status) list = list.filter((r) => r.status === status);
    if (type) list = list.filter((r) => r.type === type);
    return cursorPage(list, request);
  }),
  http.put(`${BASE}/admin/requests/:requestId`, () => ok(null)),
];
