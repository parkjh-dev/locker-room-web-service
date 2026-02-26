/**
 * MSW Mock Data
 * 한국어 스포츠 커뮤니티 맥락의 현실적 데이터
 */

import type { Sport, Team } from '@/features/auth/types/auth';
import type { Board } from '@/features/boards/types/board';
import type { PostListItem, PostDetail } from '@/features/posts/types/post';
import type { Comment } from '@/features/comments/types/comment';
import type { NoticeListItem, NoticeDetail } from '@/features/notices/types/notice';
import type { NotificationItem } from '@/features/notifications/types/notification';
import type {
  UserProfile,
  MyPostItem,
  MyCommentItem,
  MyLikeItem,
} from '@/features/mypage/types/user';
import type { InquiryListItem, InquiryDetail } from '@/features/inquiries/types/inquiry';
import type { RequestListItem, RequestDetail } from '@/features/requests/types/request';
import type {
  AdminDashboardSummary,
  AdminUser,
  AdminReport,
  AdminNotice,
  AdminInquiry,
  AdminRequest,
} from '@/features/admin/types/admin';

// ──────────────────────────────────────────────
// 종목 & 팀
// ──────────────────────────────────────────────

export const sports: Sport[] = [
  { id: 1, name: '축구', isActive: true },
  { id: 2, name: '야구', isActive: true },
  { id: 3, name: '농구', isActive: true },
  { id: 4, name: '배구', isActive: true },
];

export const teamsBySport: Record<number, Team[]> = {
  1: [
    { id: 101, name: '전북 현대 모터스', logoUrl: null, isActive: true },
    { id: 102, name: '울산 HD FC', logoUrl: null, isActive: true },
    { id: 103, name: 'FC 서울', logoUrl: null, isActive: true },
    { id: 104, name: '수원 삼성 블루윙즈', logoUrl: null, isActive: true },
    { id: 105, name: '포항 스틸러스', logoUrl: null, isActive: true },
  ],
  2: [
    { id: 201, name: 'LG 트윈스', logoUrl: null, isActive: true },
    { id: 202, name: '삼성 라이온즈', logoUrl: null, isActive: true },
    { id: 203, name: 'KIA 타이거즈', logoUrl: null, isActive: true },
    { id: 204, name: '두산 베어스', logoUrl: null, isActive: true },
    { id: 205, name: 'SSG 랜더스', logoUrl: null, isActive: true },
  ],
  3: [
    { id: 301, name: '서울 SK 나이츠', logoUrl: null, isActive: true },
    { id: 302, name: '원주 DB 프로미', logoUrl: null, isActive: true },
    { id: 303, name: '안양 KGC 인삼공사', logoUrl: null, isActive: true },
    { id: 304, name: '울산 현대모비스 피버스', logoUrl: null, isActive: true },
  ],
  4: [
    { id: 401, name: '대전 삼성화재 블루팡스', logoUrl: null, isActive: true },
    { id: 402, name: '인천 대한항공 점보스', logoUrl: null, isActive: true },
    { id: 403, name: '수원 한국전력 빅스톰', logoUrl: null, isActive: true },
  ],
};

// ──────────────────────────────────────────────
// 게시판
// ──────────────────────────────────────────────

export const boards: Board[] = [
  { id: 1, name: '자유게시판', type: 'COMMON', teamId: null, teamName: null },
  { id: 2, name: 'Q&A', type: 'QNA', teamId: null, teamName: null },
  {
    id: 3,
    name: 'LG 트윈스 게시판',
    type: 'TEAM',
    teamId: 201,
    teamName: 'LG 트윈스',
  },
  {
    id: 4,
    name: '전북 현대 게시판',
    type: 'TEAM',
    teamId: 101,
    teamName: '전북 현대 모터스',
  },
  { id: 5, name: '뉴스', type: 'NEWS', teamId: null, teamName: null },
];

// ──────────────────────────────────────────────
// 게시글
// ──────────────────────────────────────────────

export const postListItems: PostListItem[] = [
  {
    id: 1,
    title: '이번 시즌 전북 전력 분석',
    authorNickname: '축구광팬',
    viewCount: 342,
    likeCount: 28,
    commentCount: 15,
    isAiGenerated: false,
    createdAt: '2026-02-24T14:30:00',
  },
  {
    id: 2,
    title: 'LG 트윈스 올해 로스터 어떻게 보시나요?',
    authorNickname: '야구좋아',
    viewCount: 521,
    likeCount: 45,
    commentCount: 32,
    isAiGenerated: false,
    createdAt: '2026-02-24T12:00:00',
  },
  {
    id: 3,
    title: '[AI 분석] K리그 1R 주요 경기 프리뷰',
    authorNickname: 'AI 어시스턴트',
    viewCount: 1024,
    likeCount: 89,
    commentCount: 41,
    isAiGenerated: true,
    createdAt: '2026-02-23T18:00:00',
  },
  {
    id: 4,
    title: '농구 시즌 MVP 후보 정리',
    authorNickname: '슬램덩크',
    viewCount: 198,
    likeCount: 12,
    commentCount: 8,
    isAiGenerated: false,
    createdAt: '2026-02-23T10:15:00',
  },
  {
    id: 5,
    title: '배구 올스타전 하이라이트 모음',
    authorNickname: '배구매니아',
    viewCount: 456,
    likeCount: 37,
    commentCount: 19,
    isAiGenerated: false,
    createdAt: '2026-02-22T20:45:00',
  },
  {
    id: 6,
    title: '신입 팬인데 야구 규칙 좀 알려주세요',
    authorNickname: '야구초보',
    viewCount: 287,
    likeCount: 15,
    commentCount: 24,
    isAiGenerated: false,
    createdAt: '2026-02-22T09:30:00',
  },
  {
    id: 7,
    title: '오늘 직관 후기 (울산 vs 서울)',
    authorNickname: '축구광팬',
    viewCount: 634,
    likeCount: 52,
    commentCount: 27,
    isAiGenerated: false,
    createdAt: '2026-02-21T22:10:00',
  },
  {
    id: 8,
    title: 'KIA 타이거즈 신인 드래프트 분석',
    authorNickname: '야구좋아',
    viewCount: 412,
    likeCount: 33,
    commentCount: 18,
    isAiGenerated: false,
    createdAt: '2026-02-21T18:30:00',
  },
  {
    id: 9,
    title: '[AI 분석] V리그 플레이오프 전망',
    authorNickname: 'AI 어시스턴트',
    viewCount: 876,
    likeCount: 67,
    commentCount: 29,
    isAiGenerated: true,
    createdAt: '2026-02-21T15:00:00',
  },
  {
    id: 10,
    title: '울산 HD FC 새 외국인 선수 어떤가요?',
    authorNickname: '축구전문가',
    viewCount: 589,
    likeCount: 41,
    commentCount: 35,
    isAiGenerated: false,
    createdAt: '2026-02-21T11:20:00',
  },
  {
    id: 11,
    title: 'DB 프로미 올시즌 로테이션 예상',
    authorNickname: '슬램덩크',
    viewCount: 231,
    likeCount: 19,
    commentCount: 11,
    isAiGenerated: false,
    createdAt: '2026-02-20T21:45:00',
  },
  {
    id: 12,
    title: '직관 꿀팁 정리 (좌석, 먹거리, 교통)',
    authorNickname: '야구초보',
    viewCount: 1523,
    likeCount: 124,
    commentCount: 56,
    isAiGenerated: false,
    createdAt: '2026-02-20T16:00:00',
  },
  {
    id: 13,
    title: '삼성 라이온즈 캠프 소식 총정리',
    authorNickname: '야구좋아',
    viewCount: 378,
    likeCount: 25,
    commentCount: 13,
    isAiGenerated: false,
    createdAt: '2026-02-20T13:30:00',
  },
  {
    id: 14,
    title: '[AI 분석] KBO 개막전 선발 투수 비교',
    authorNickname: 'AI 어시스턴트',
    viewCount: 945,
    likeCount: 72,
    commentCount: 38,
    isAiGenerated: true,
    createdAt: '2026-02-20T10:00:00',
  },
  {
    id: 15,
    title: 'FC 서울 시즌권 같이 살 분?',
    authorNickname: '축구광팬',
    viewCount: 267,
    likeCount: 8,
    commentCount: 42,
    isAiGenerated: false,
    createdAt: '2026-02-19T22:30:00',
  },
  {
    id: 16,
    title: '삼성화재 블루팡스 외국인 선수 근황',
    authorNickname: '배구매니아',
    viewCount: 334,
    likeCount: 22,
    commentCount: 9,
    isAiGenerated: false,
    createdAt: '2026-02-19T19:15:00',
  },
  {
    id: 17,
    title: 'SSG 랜더스 올해 불펜 전력 어떻게 보시나요',
    authorNickname: '야구좋아',
    viewCount: 489,
    likeCount: 38,
    commentCount: 21,
    isAiGenerated: false,
    createdAt: '2026-02-19T15:00:00',
  },
  {
    id: 18,
    title: '현대모비스 피버스 신인 선수 기대평',
    authorNickname: '슬램덩크',
    viewCount: 176,
    likeCount: 14,
    commentCount: 7,
    isAiGenerated: false,
    createdAt: '2026-02-19T11:30:00',
  },
  {
    id: 19,
    title: '[AI 분석] 2026 K리그 우승 후보 TOP 3',
    authorNickname: 'AI 어시스턴트',
    viewCount: 2134,
    likeCount: 156,
    commentCount: 87,
    isAiGenerated: true,
    createdAt: '2026-02-19T09:00:00',
  },
  {
    id: 20,
    title: '두산 베어스 캠프 직관 다녀왔습니다',
    authorNickname: '야구초보',
    viewCount: 543,
    likeCount: 47,
    commentCount: 23,
    isAiGenerated: false,
    createdAt: '2026-02-18T20:00:00',
  },
  {
    id: 21,
    title: '포항 스틸러스 유스 출신 선수들 근황',
    authorNickname: '축구전문가',
    viewCount: 298,
    likeCount: 21,
    commentCount: 10,
    isAiGenerated: false,
    createdAt: '2026-02-18T17:30:00',
  },
  {
    id: 22,
    title: '대한항공 점보스 응원가 모음',
    authorNickname: '배구매니아',
    viewCount: 687,
    likeCount: 55,
    commentCount: 14,
    isAiGenerated: false,
    createdAt: '2026-02-18T14:00:00',
  },
  {
    id: 23,
    title: '스포츠 직관 카메라 추천해주세요',
    authorNickname: '야구초보',
    viewCount: 432,
    likeCount: 31,
    commentCount: 28,
    isAiGenerated: false,
    createdAt: '2026-02-18T10:45:00',
  },
  {
    id: 24,
    title: '[AI 분석] KBL 득점 효율 TOP 10 선수',
    authorNickname: 'AI 어시스턴트',
    viewCount: 756,
    likeCount: 58,
    commentCount: 22,
    isAiGenerated: true,
    createdAt: '2026-02-17T20:00:00',
  },
  {
    id: 25,
    title: '수원 삼성 새 감독 체제 전망',
    authorNickname: '축구광팬',
    viewCount: 445,
    likeCount: 36,
    commentCount: 19,
    isAiGenerated: false,
    createdAt: '2026-02-17T16:30:00',
  },
  {
    id: 26,
    title: 'LG 트윈스 시즌권 후기',
    authorNickname: '야구좋아',
    viewCount: 812,
    likeCount: 63,
    commentCount: 34,
    isAiGenerated: false,
    createdAt: '2026-02-17T13:00:00',
  },
  {
    id: 27,
    title: 'SK 나이츠 홈경기 좌석 추천',
    authorNickname: '슬램덩크',
    viewCount: 356,
    likeCount: 27,
    commentCount: 16,
    isAiGenerated: false,
    createdAt: '2026-02-17T09:30:00',
  },
  {
    id: 28,
    title: '한국전력 빅스톰 올시즌 전력 분석',
    authorNickname: '배구매니아',
    viewCount: 223,
    likeCount: 16,
    commentCount: 6,
    isAiGenerated: false,
    createdAt: '2026-02-16T21:00:00',
  },
  {
    id: 29,
    title: '[AI 분석] KBO 팀별 타선 파워랭킹',
    authorNickname: 'AI 어시스턴트',
    viewCount: 1876,
    likeCount: 132,
    commentCount: 64,
    isAiGenerated: true,
    createdAt: '2026-02-16T18:00:00',
  },
  {
    id: 30,
    title: '올해 ACL 진출팀 예상',
    authorNickname: '축구전문가',
    viewCount: 567,
    likeCount: 44,
    commentCount: 31,
    isAiGenerated: false,
    createdAt: '2026-02-16T14:30:00',
  },
  {
    id: 31,
    title: 'KGC 인삼공사 치어리더 응원 후기',
    authorNickname: '슬램덩크',
    viewCount: 923,
    likeCount: 78,
    commentCount: 25,
    isAiGenerated: false,
    createdAt: '2026-02-16T11:00:00',
  },
  {
    id: 32,
    title: '야구장 먹거리 맛집 TOP 5',
    authorNickname: '야구초보',
    viewCount: 2456,
    likeCount: 189,
    commentCount: 72,
    isAiGenerated: false,
    createdAt: '2026-02-16T08:00:00',
  },
  {
    id: 33,
    title: '전북 vs 울산 클래식 명경기 모음',
    authorNickname: '축구광팬',
    viewCount: 1345,
    likeCount: 98,
    commentCount: 45,
    isAiGenerated: false,
    createdAt: '2026-02-15T22:00:00',
  },
  {
    id: 34,
    title: '[AI 분석] V리그 서브 에이스 효율 비교',
    authorNickname: 'AI 어시스턴트',
    viewCount: 634,
    likeCount: 48,
    commentCount: 17,
    isAiGenerated: true,
    createdAt: '2026-02-15T18:30:00',
  },
  {
    id: 35,
    title: '이번 주말 직관 가실 분 모집',
    authorNickname: '야구좋아',
    viewCount: 387,
    likeCount: 15,
    commentCount: 53,
    isAiGenerated: false,
    createdAt: '2026-02-15T15:00:00',
  },
  {
    id: 36,
    title: '농구 입문자를 위한 포지션 가이드',
    authorNickname: '슬램덩크',
    viewCount: 876,
    likeCount: 67,
    commentCount: 20,
    isAiGenerated: false,
    createdAt: '2026-02-15T11:30:00',
  },
  {
    id: 37,
    title: '배구 경기 규칙 변경 사항 정리 (2026)',
    authorNickname: '배구매니아',
    viewCount: 534,
    likeCount: 42,
    commentCount: 11,
    isAiGenerated: false,
    createdAt: '2026-02-15T08:00:00',
  },
  {
    id: 38,
    title: '스포츠 유니폼 세탁 꿀팁',
    authorNickname: '야구초보',
    viewCount: 1123,
    likeCount: 91,
    commentCount: 33,
    isAiGenerated: false,
    createdAt: '2026-02-14T20:00:00',
  },
  {
    id: 39,
    title: '[AI 분석] K리그 팀별 패스 성공률 비교',
    authorNickname: 'AI 어시스턴트',
    viewCount: 789,
    likeCount: 56,
    commentCount: 24,
    isAiGenerated: true,
    createdAt: '2026-02-14T16:00:00',
  },
  {
    id: 40,
    title: '올 시즌 기대되는 외국인 선수 BEST 5',
    authorNickname: '축구전문가',
    viewCount: 1678,
    likeCount: 121,
    commentCount: 58,
    isAiGenerated: false,
    createdAt: '2026-02-14T12:00:00',
  },
];

export const postDetail: PostDetail = {
  id: 1,
  boardId: 1,
  boardName: '자유게시판',
  author: { id: 10, nickname: '축구광팬', teamName: '전북 현대 모터스', profileImageUrl: null },
  title: '이번 시즌 전북 전력 분석',
  content: `안녕하세요, 이번 시즌 전북 현대 모터스의 전력을 분석해보려 합니다.

## 공격진
올해 새로 영입한 외국인 공격수의 활약이 기대됩니다. 지난 시즌 득점왕 경쟁에서 아쉽게 2위를 차지했지만, 올해는 더 강력한 지원사격이 예상됩니다.

## 수비진
센터백 라인이 탄탄해졌습니다. 특히 유스 출신 선수들의 성장이 눈에 띕니다.

## 전망
개인적으로 올해 최소 ACL 진출권은 확보할 수 있을 것으로 보입니다.

여러분의 의견은 어떠신가요?`,
  viewCount: 342,
  likeCount: 28,
  commentCount: 15,
  isAiGenerated: false,
  isLiked: false,
  files: [],
  createdAt: '2026-02-24T14:30:00',
  updatedAt: '2026-02-24T14:30:00',
};

// ──────────────────────────────────────────────
// 댓글
// ──────────────────────────────────────────────

export const comments: Comment[] = [
  {
    id: 1,
    author: { id: 11, nickname: '야구좋아', teamName: 'LG 트윈스', profileImageUrl: null },
    content: '전북 올해 진짜 기대됩니다. 새 외국인 선수 영입이 신의 한 수인 것 같아요.',
    isAiGenerated: false,
    createdAt: '2026-02-24T15:00:00',
    replies: [
      {
        id: 2,
        author: {
          id: 10,
          nickname: '축구광팬',
          teamName: '전북 현대 모터스',
          profileImageUrl: null,
        },
        content: '@야구좋아 감사합니다! 저도 그렇게 생각합니다. 특히 빌드업 능력이 출중하더라고요.',
        isAiGenerated: false,
        createdAt: '2026-02-24T15:10:00',
        replies: [],
      },
    ],
  },
  {
    id: 3,
    author: { id: 12, nickname: '슬램덩크', profileImageUrl: null },
    content: '수비 보강이 잘 된 것 같네요. ACL 충분히 가능할 듯!',
    isAiGenerated: false,
    createdAt: '2026-02-24T16:20:00',
    replies: [],
  },
  {
    id: 4,
    author: { id: 13, nickname: '배구매니아', profileImageUrl: null },
    content: '전북 유스 시스템은 진짜 대한민국 최고인 것 같습니다. 매년 좋은 선수가 올라오네요.',
    isAiGenerated: false,
    createdAt: '2026-02-24T17:30:00',
    replies: [
      {
        id: 5,
        author: { id: 14, nickname: '축구전문가', profileImageUrl: null },
        content: '@배구매니아 맞아요. 특히 이번에 올라온 CB가 정말 기대됩니다.',
        isAiGenerated: false,
        createdAt: '2026-02-24T18:00:00',
        replies: [],
      },
    ],
  },
];

// ──────────────────────────────────────────────
// 공지사항
// ──────────────────────────────────────────────

export const noticeListItems: NoticeListItem[] = [
  {
    id: 1,
    title: '라커룸 서비스 오픈 안내',
    isPinned: true,
    scope: 'ALL',
    teamName: null,
    createdAt: '2026-02-20T10:00:00',
  },
  {
    id: 2,
    title: '커뮤니티 이용 규칙 안내',
    isPinned: true,
    scope: 'ALL',
    teamName: null,
    createdAt: '2026-02-20T10:00:00',
  },
  {
    id: 3,
    title: '2026 시즌 게시판 개편 안내',
    isPinned: false,
    scope: 'ALL',
    teamName: null,
    createdAt: '2026-02-22T14:00:00',
  },
  {
    id: 4,
    title: 'LG 트윈스 게시판 개설 안내',
    isPinned: false,
    scope: 'TEAM',
    teamName: 'LG 트윈스',
    createdAt: '2026-02-21T16:00:00',
  },
  {
    id: 5,
    title: '서버 점검 안내 (2/28 02:00~06:00)',
    isPinned: false,
    scope: 'ALL',
    teamName: null,
    createdAt: '2026-02-25T09:00:00',
  },
];

export const noticeDetail: NoticeDetail = {
  id: 1,
  title: '라커룸 서비스 오픈 안내',
  content: `안녕하세요, 스포츠 커뮤니티 **라커룸**이 정식 오픈했습니다!

## 주요 기능
- 종목별/팀별 게시판
- AI 게시글 분석
- 실시간 알림
- 1:1 문의

많은 이용 부탁드립니다. 감사합니다.`,
  isPinned: true,
  scope: 'ALL',
  teamId: null,
  teamName: null,
  adminNickname: '관리자',
  createdAt: '2026-02-20T10:00:00',
  updatedAt: '2026-02-20T10:00:00',
};

// ──────────────────────────────────────────────
// 유저 프로필 & 마이페이지
// ──────────────────────────────────────────────

export const userProfile: UserProfile = {
  id: 10,
  email: 'soccer_fan@example.com',
  nickname: '축구광팬',
  role: 'USER',
  provider: null,
  profileImageUrl: null,
  teams: [
    {
      teamId: 101,
      teamName: '전북 현대 모터스',
      sportId: 1,
      sportName: '축구',
    },
    { teamId: 201, teamName: 'LG 트윈스', sportId: 2, sportName: '야구' },
  ],
  createdAt: '2026-01-15T08:30:00',
};

export const adminProfile: UserProfile = {
  id: 1,
  email: 'admin@lockerroom.kr',
  nickname: '관리자',
  role: 'ADMIN',
  provider: null,
  profileImageUrl: null,
  teams: [],
  createdAt: '2026-01-01T00:00:00',
};

export const myPosts: MyPostItem[] = [
  {
    id: 1,
    boardId: 1,
    boardName: '자유게시판',
    title: '이번 시즌 전북 전력 분석',
    viewCount: 342,
    likeCount: 28,
    commentCount: 15,
    createdAt: '2026-02-24T14:30:00',
  },
  {
    id: 7,
    boardId: 1,
    boardName: '자유게시판',
    title: '오늘 직관 후기 (울산 vs 서울)',
    viewCount: 634,
    likeCount: 52,
    commentCount: 27,
    createdAt: '2026-02-21T22:10:00',
  },
  {
    id: 8,
    boardId: 4,
    boardName: '전북 현대 게시판',
    title: '전북 시즌권 구매 후기',
    viewCount: 156,
    likeCount: 11,
    commentCount: 5,
    createdAt: '2026-02-19T13:00:00',
  },
];

export const myComments: MyCommentItem[] = [
  {
    id: 10,
    postId: 2,
    postTitle: 'LG 트윈스 올해 로스터 어떻게 보시나요?',
    content: '올해 LG 진짜 기대됩니다. 투타 밸런스가 좋아졌어요.',
    createdAt: '2026-02-24T13:00:00',
  },
  {
    id: 11,
    postId: 3,
    postTitle: '[AI 분석] K리그 1R 주요 경기 프리뷰',
    content: 'AI 분석 퀄리티가 점점 좋아지네요. 유용한 정보 감사합니다.',
    createdAt: '2026-02-23T19:00:00',
  },
  {
    id: 12,
    postId: 5,
    postTitle: '배구 올스타전 하이라이트 모음',
    content: '배구 올스타전도 축구 못지않게 재미있더라고요!',
    createdAt: '2026-02-22T21:00:00',
  },
];

export const myLikes: MyLikeItem[] = [
  {
    id: 2,
    boardId: 1,
    boardName: '자유게시판',
    title: 'LG 트윈스 올해 로스터 어떻게 보시나요?',
    authorNickname: '야구좋아',
    viewCount: 521,
    likeCount: 45,
    commentCount: 32,
    createdAt: '2026-02-24T12:00:00',
  },
  {
    id: 3,
    boardId: 1,
    boardName: '자유게시판',
    title: '[AI 분석] K리그 1R 주요 경기 프리뷰',
    authorNickname: 'AI 어시스턴트',
    viewCount: 1024,
    likeCount: 89,
    commentCount: 41,
    createdAt: '2026-02-23T18:00:00',
  },
];

// ──────────────────────────────────────────────
// 알림
// ──────────────────────────────────────────────

export const notifications: NotificationItem[] = [
  {
    id: 1,
    type: 'COMMENT',
    targetType: 'POST',
    targetId: 1,
    message: '야구좋아님이 회원님의 게시글에 댓글을 남겼습니다.',
    isRead: false,
    readAt: null,
    createdAt: '2026-02-24T15:00:00',
  },
  {
    id: 2,
    type: 'NOTICE',
    targetType: 'NOTICE',
    targetId: 5,
    message: '새로운 공지사항이 등록되었습니다: 서버 점검 안내',
    isRead: false,
    readAt: null,
    createdAt: '2026-02-25T09:00:00',
  },
  {
    id: 3,
    type: 'REPLY',
    targetType: 'COMMENT',
    targetId: 2,
    message: '축구전문가님이 회원님의 댓글에 답글을 남겼습니다.',
    isRead: true,
    readAt: '2026-02-24T19:00:00',
    createdAt: '2026-02-24T18:00:00',
  },
];

// ──────────────────────────────────────────────
// 문의
// ──────────────────────────────────────────────

export const inquiryListItems: InquiryListItem[] = [
  {
    id: 1,
    type: 'BUG',
    title: '게시글 작성 시 이미지가 업로드되지 않습니다',
    status: 'ANSWERED',
    createdAt: '2026-02-20T11:00:00',
  },
  {
    id: 2,
    type: 'SUGGESTION',
    title: '다크모드 지원 요청',
    status: 'PENDING',
    createdAt: '2026-02-23T08:30:00',
  },
  {
    id: 3,
    type: 'GENERAL',
    title: '닉네임 변경 관련 문의',
    status: 'ANSWERED',
    createdAt: '2026-02-18T15:00:00',
  },
];

export const inquiryDetail: InquiryDetail = {
  id: 1,
  type: 'BUG',
  title: '게시글 작성 시 이미지가 업로드되지 않습니다',
  content:
    '안녕하세요, 게시글 작성 페이지에서 이미지 파일(jpg, png)을 첨부하려고 하면 업로드가 되지 않습니다. 크롬 브라우저 최신 버전 사용 중이고, 파일 크기는 2MB 이하입니다. 확인 부탁드립니다.',
  status: 'ANSWERED',
  files: [],
  replies: [
    {
      id: 1,
      adminNickname: '관리자',
      content:
        '안녕하세요, 문의 주셔서 감사합니다. 해당 이슈를 확인하여 수정 완료했습니다. 현재는 정상적으로 업로드가 가능합니다. 동일한 문제가 반복되면 다시 문의 부탁드립니다.',
      createdAt: '2026-02-21T10:00:00',
    },
  ],
  createdAt: '2026-02-20T11:00:00',
};

// ──────────────────────────────────────────────
// 요청
// ──────────────────────────────────────────────

export const requestListItems: RequestListItem[] = [
  {
    id: 1,
    type: 'TEAM',
    name: '인천 유나이티드 FC',
    status: 'APPROVED',
    createdAt: '2026-02-15T10:00:00',
  },
  {
    id: 2,
    type: 'SPORT',
    name: '핸드볼',
    status: 'PENDING',
    createdAt: '2026-02-22T14:00:00',
  },
  {
    id: 3,
    type: 'TEAM',
    name: '한화 이글스',
    status: 'REJECTED',
    createdAt: '2026-02-10T09:00:00',
  },
];

export const requestDetail: RequestDetail = {
  id: 2,
  type: 'SPORT',
  name: '핸드볼',
  reason:
    '국내 핸드볼 리그가 활성화되고 있어 커뮤니티 게시판이 있으면 좋겠습니다. 핸드볼 팬들이 모여서 경기 이야기를 나눌 수 있는 공간이 필요합니다.',
  status: 'PENDING',
  rejectReason: null,
  processedAt: null,
  createdAt: '2026-02-22T14:00:00',
};

// ──────────────────────────────────────────────
// 관리자
// ──────────────────────────────────────────────

export const adminDashboard: AdminDashboardSummary = {
  pendingReportCount: 3,
  pendingInquiryCount: 1,
  pendingRequestCount: 1,
};

export const adminUsers: AdminUser[] = [
  {
    id: 10,
    email: 'soccer_fan@example.com',
    nickname: '축구광팬',
    role: 'USER',
    provider: null,
    isSuspended: false,
    createdAt: '2026-01-15T08:30:00',
  },
  {
    id: 11,
    email: 'baseball_love@example.com',
    nickname: '야구좋아',
    role: 'USER',
    provider: null,
    isSuspended: false,
    createdAt: '2026-01-16T10:00:00',
  },
  {
    id: 12,
    email: 'slam_dunk@example.com',
    nickname: '슬램덩크',
    role: 'USER',
    provider: 'GOOGLE',
    isSuspended: false,
    createdAt: '2026-01-20T15:00:00',
  },
  {
    id: 13,
    email: 'volleyball@example.com',
    nickname: '배구매니아',
    role: 'USER',
    provider: 'KAKAO',
    isSuspended: false,
    createdAt: '2026-01-22T09:00:00',
  },
  {
    id: 14,
    email: 'football_pro@example.com',
    nickname: '축구전문가',
    role: 'USER',
    provider: null,
    isSuspended: true,
    createdAt: '2026-01-25T12:00:00',
  },
  {
    id: 15,
    email: 'newbie@example.com',
    nickname: '야구초보',
    role: 'USER',
    provider: 'NAVER',
    isSuspended: false,
    createdAt: '2026-02-01T08:00:00',
  },
];

export const adminReports: AdminReport[] = [
  {
    id: 1,
    postId: 20,
    postTitle: '도배글 제목 1',
    reporterNickname: '축구광팬',
    reason: '도배성 게시글입니다.',
    status: 'PENDING',
    createdAt: '2026-02-24T10:00:00',
  },
  {
    id: 2,
    postId: 21,
    postTitle: '욕설이 포함된 게시글',
    reporterNickname: '야구좋아',
    reason: '심한 욕설과 비방이 포함되어 있습니다.',
    status: 'PENDING',
    createdAt: '2026-02-24T11:00:00',
  },
  {
    id: 3,
    postId: 22,
    postTitle: '광고 게시글',
    reporterNickname: '배구매니아',
    reason: '스팸/광고 게시글입니다.',
    status: 'PENDING',
    createdAt: '2026-02-24T14:00:00',
  },
  {
    id: 4,
    postId: 15,
    postTitle: '불건전한 내용',
    reporterNickname: '슬램덩크',
    reason: '불건전한 내용이 포함되어 있습니다.',
    status: 'APPROVED',
    createdAt: '2026-02-22T09:00:00',
  },
];

export const adminNotices: AdminNotice[] = [
  {
    id: 1,
    title: '라커룸 서비스 오픈 안내',
    isPinned: true,
    scope: 'ALL',
    teamName: null,
    createdAt: '2026-02-20T10:00:00',
  },
  {
    id: 2,
    title: '커뮤니티 이용 규칙 안내',
    isPinned: true,
    scope: 'ALL',
    teamName: null,
    createdAt: '2026-02-20T10:00:00',
  },
  {
    id: 3,
    title: '2026 시즌 게시판 개편 안내',
    isPinned: false,
    scope: 'ALL',
    teamName: null,
    createdAt: '2026-02-22T14:00:00',
  },
  {
    id: 4,
    title: 'LG 트윈스 게시판 개설 안내',
    isPinned: false,
    scope: 'TEAM',
    teamName: 'LG 트윈스',
    createdAt: '2026-02-21T16:00:00',
  },
  {
    id: 5,
    title: '서버 점검 안내 (2/28 02:00~06:00)',
    isPinned: false,
    scope: 'ALL',
    teamName: null,
    createdAt: '2026-02-25T09:00:00',
  },
];

export const adminInquiries: AdminInquiry[] = [
  {
    id: 1,
    type: 'BUG',
    title: '게시글 작성 시 이미지가 업로드되지 않습니다',
    userNickname: '축구광팬',
    status: 'ANSWERED',
    createdAt: '2026-02-20T11:00:00',
  },
  {
    id: 2,
    type: 'SUGGESTION',
    title: '다크모드 지원 요청',
    userNickname: '야구좋아',
    status: 'PENDING',
    createdAt: '2026-02-23T08:30:00',
  },
  {
    id: 3,
    type: 'GENERAL',
    title: '닉네임 변경 관련 문의',
    userNickname: '슬램덩크',
    status: 'ANSWERED',
    createdAt: '2026-02-18T15:00:00',
  },
];

export const adminRequests: AdminRequest[] = [
  {
    id: 1,
    userNickname: '축구광팬',
    type: 'TEAM',
    name: '인천 유나이티드 FC',
    reason: '인천 유나이티드 팬들을 위한 게시판이 필요합니다.',
    status: 'APPROVED',
    createdAt: '2026-02-15T10:00:00',
  },
  {
    id: 2,
    userNickname: '배구매니아',
    type: 'SPORT',
    name: '핸드볼',
    reason: '국내 핸드볼 리그가 활성화되고 있어 커뮤니티 게시판이 있으면 좋겠습니다.',
    status: 'PENDING',
    createdAt: '2026-02-22T14:00:00',
  },
  {
    id: 3,
    userNickname: '야구좋아',
    type: 'TEAM',
    name: '한화 이글스',
    reason: '한화 이글스 전용 게시판 개설을 요청합니다.',
    status: 'REJECTED',
    createdAt: '2026-02-10T09:00:00',
  },
];
