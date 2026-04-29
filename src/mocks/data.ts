/**
 * MSW Mock Data
 * 한국 스포츠 커뮤니티 맥락의 현실적이고 풍부한 더미 데이터.
 *
 * 페이지네이션·무한스크롤·필터·상세 라우팅 검증을 위해
 *  - 게시글 80개 + 상세 12개를 id로 매핑
 *  - 댓글은 post별로 분리
 *  - 공지/문의/요청도 id 기반 상세 조회
 *  - 알림 15+개, 관리자 회원 25+, 신고 12+ 등으로 확장
 */

import type { Sport, Team, Continent, Country, League } from '@/features/auth/types/auth';
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
// 종목 / 대륙 / 국가 / 리그 / 팀 (글로벌 4단계)
// ──────────────────────────────────────────────

export const sports: Sport[] = [
  { id: 1, name: '축구', isActive: true },
  { id: 2, name: '야구', isActive: true },
  { id: 3, name: '농구', isActive: true },
  { id: 4, name: '배구', isActive: true },
];

export const continents: Continent[] = [
  { id: 1, nameKo: '아시아', code: 'AS' },
  { id: 2, nameKo: '유럽', code: 'EU' },
  { id: 3, nameKo: '북미', code: 'NA' },
];

export const countries: Country[] = [
  { id: 1, nameKo: '대한민국', code: 'KR', continentId: 1 },
  { id: 2, nameKo: '일본', code: 'JP', continentId: 1 },
  { id: 3, nameKo: '미국', code: 'US', continentId: 3 },
  { id: 4, nameKo: '잉글랜드', code: 'GB-ENG', continentId: 2 },
  { id: 5, nameKo: '스페인', code: 'ES', continentId: 2 },
  { id: 6, nameKo: '독일', code: 'DE', continentId: 2 },
  { id: 7, nameKo: '이탈리아', code: 'IT', continentId: 2 },
  { id: 8, nameKo: '프랑스', code: 'FR', continentId: 2 },
];

export const leagues: League[] = [
  // 축구 (sportId=1)
  { id: 1, nameKo: 'K리그1', sportId: 1, countryId: 1, tier: 1 },
  { id: 2, nameKo: 'J1리그', sportId: 1, countryId: 2, tier: 1 },
  { id: 3, nameKo: '프리미어리그', sportId: 1, countryId: 4, tier: 1 },
  { id: 4, nameKo: '라리가', sportId: 1, countryId: 5, tier: 1 },
  { id: 5, nameKo: '분데스리가', sportId: 1, countryId: 6, tier: 1 },
  { id: 6, nameKo: '세리에 A', sportId: 1, countryId: 7, tier: 1 },
  { id: 7, nameKo: '리그 1', sportId: 1, countryId: 8, tier: 1 },
  { id: 8, nameKo: 'MLS', sportId: 1, countryId: 3, tier: 1 },
  // 야구 (sportId=2)
  { id: 9, nameKo: 'KBO 리그', sportId: 2, countryId: 1, tier: 1 },
  { id: 10, nameKo: 'NPB 센트럴', sportId: 2, countryId: 2, tier: 1 },
  { id: 11, nameKo: 'NPB 퍼시픽', sportId: 2, countryId: 2, tier: 1 },
  { id: 12, nameKo: 'MLB 아메리칸', sportId: 2, countryId: 3, tier: 1 },
  { id: 13, nameKo: 'MLB 내셔널', sportId: 2, countryId: 3, tier: 1 },
  // 농구 (sportId=3)
  { id: 14, nameKo: 'KBL', sportId: 3, countryId: 1, tier: 1 },
  { id: 15, nameKo: 'NBA', sportId: 3, countryId: 3, tier: 1 },
  { id: 16, nameKo: 'B.League', sportId: 3, countryId: 2, tier: 1 },
  // 배구 (sportId=4)
  { id: 17, nameKo: 'V-리그 남자부', sportId: 4, countryId: 1, tier: 1 },
  { id: 18, nameKo: 'V-리그 여자부', sportId: 4, countryId: 1, tier: 1 },
  { id: 19, nameKo: 'SV.리그', sportId: 4, countryId: 2, tier: 1 },
];

// 리그별 팀 (게시판 매핑 호환을 위해 한국 팀의 기존 ID 유지)
export const teamsByLeague: Record<number, Team[]> = {
  // 1: K리그1 (한국, sport=1)
  1: [
    { id: 101, name: '전북 현대 모터스', logoUrl: null, isActive: true, leagueId: 1 },
    { id: 102, name: '울산 HD FC', logoUrl: null, isActive: true, leagueId: 1 },
    { id: 103, name: 'FC 서울', logoUrl: null, isActive: true, leagueId: 1 },
    { id: 104, name: '수원 삼성 블루윙즈', logoUrl: null, isActive: true, leagueId: 1 },
    { id: 105, name: '포항 스틸러스', logoUrl: null, isActive: true, leagueId: 1 },
    { id: 106, name: '대구 FC', logoUrl: null, isActive: true, leagueId: 1 },
    { id: 107, name: '강원 FC', logoUrl: null, isActive: true, leagueId: 1 },
    { id: 108, name: '광주 FC', logoUrl: null, isActive: true, leagueId: 1 },
    { id: 109, name: '제주 유나이티드', logoUrl: null, isActive: true, leagueId: 1 },
    { id: 110, name: '인천 유나이티드', logoUrl: null, isActive: true, leagueId: 1 },
    { id: 111, name: '김천 상무', logoUrl: null, isActive: true, leagueId: 1 },
    { id: 112, name: '대전 하나 시티즌', logoUrl: null, isActive: true, leagueId: 1 },
  ],
  // 2: J1리그 (일본)
  2: [
    { id: 1001, name: '우라와 레드 다이아몬즈', logoUrl: null, isActive: true, leagueId: 2 },
    { id: 1002, name: 'FC 도쿄', logoUrl: null, isActive: true, leagueId: 2 },
    { id: 1003, name: '카시마 앤틀러스', logoUrl: null, isActive: true, leagueId: 2 },
    { id: 1004, name: '요코하마 F. 마리노스', logoUrl: null, isActive: true, leagueId: 2 },
    { id: 1005, name: '비셀 고베', logoUrl: null, isActive: true, leagueId: 2 },
    { id: 1006, name: '카와사키 프론탈레', logoUrl: null, isActive: true, leagueId: 2 },
  ],
  // 3: 프리미어리그 (잉글랜드)
  3: [
    { id: 1101, name: '맨체스터 시티', logoUrl: null, isActive: true, leagueId: 3 },
    { id: 1102, name: '맨체스터 유나이티드', logoUrl: null, isActive: true, leagueId: 3 },
    { id: 1103, name: '리버풀', logoUrl: null, isActive: true, leagueId: 3 },
    { id: 1104, name: '첼시', logoUrl: null, isActive: true, leagueId: 3 },
    { id: 1105, name: '아스널', logoUrl: null, isActive: true, leagueId: 3 },
    { id: 1106, name: '토트넘 홋스퍼', logoUrl: null, isActive: true, leagueId: 3 },
    { id: 1107, name: '뉴캐슬 유나이티드', logoUrl: null, isActive: true, leagueId: 3 },
    { id: 1108, name: '아스턴 빌라', logoUrl: null, isActive: true, leagueId: 3 },
  ],
  // 4: 라리가 (스페인)
  4: [
    { id: 1201, name: '레알 마드리드', logoUrl: null, isActive: true, leagueId: 4 },
    { id: 1202, name: 'FC 바르셀로나', logoUrl: null, isActive: true, leagueId: 4 },
    { id: 1203, name: '아틀레티코 마드리드', logoUrl: null, isActive: true, leagueId: 4 },
    { id: 1204, name: '세비야', logoUrl: null, isActive: true, leagueId: 4 },
    { id: 1205, name: '레알 소시에다드', logoUrl: null, isActive: true, leagueId: 4 },
  ],
  // 5: 분데스리가 (독일)
  5: [
    { id: 1301, name: '바이에른 뮌헨', logoUrl: null, isActive: true, leagueId: 5 },
    { id: 1302, name: '보루시아 도르트문트', logoUrl: null, isActive: true, leagueId: 5 },
    { id: 1303, name: 'RB 라이프치히', logoUrl: null, isActive: true, leagueId: 5 },
    { id: 1304, name: '바이어 04 레버쿠젠', logoUrl: null, isActive: true, leagueId: 5 },
  ],
  // 6: 세리에 A (이탈리아)
  6: [
    { id: 1401, name: '인터 밀란', logoUrl: null, isActive: true, leagueId: 6 },
    { id: 1402, name: '유벤투스', logoUrl: null, isActive: true, leagueId: 6 },
    { id: 1403, name: 'AC 밀란', logoUrl: null, isActive: true, leagueId: 6 },
    { id: 1404, name: '나폴리', logoUrl: null, isActive: true, leagueId: 6 },
    { id: 1405, name: 'AS 로마', logoUrl: null, isActive: true, leagueId: 6 },
  ],
  // 7: 리그 1 (프랑스)
  7: [
    { id: 1501, name: '파리 생제르맹', logoUrl: null, isActive: true, leagueId: 7 },
    { id: 1502, name: '올림피크 리옹', logoUrl: null, isActive: true, leagueId: 7 },
    { id: 1503, name: '올림피크 마르세유', logoUrl: null, isActive: true, leagueId: 7 },
    { id: 1504, name: 'AS 모나코', logoUrl: null, isActive: true, leagueId: 7 },
  ],
  // 8: MLS (미국 — 축구)
  8: [
    { id: 1601, name: '인터 마이애미 CF', logoUrl: null, isActive: true, leagueId: 8 },
    { id: 1602, name: 'LA 갤럭시', logoUrl: null, isActive: true, leagueId: 8 },
    { id: 1603, name: 'NYCFC', logoUrl: null, isActive: true, leagueId: 8 },
    { id: 1604, name: '시애틀 사운더스', logoUrl: null, isActive: true, leagueId: 8 },
  ],
  // 9: KBO 리그 (한국 — 야구)
  9: [
    { id: 201, name: 'LG 트윈스', logoUrl: null, isActive: true, leagueId: 9 },
    { id: 202, name: '삼성 라이온즈', logoUrl: null, isActive: true, leagueId: 9 },
    { id: 203, name: 'KIA 타이거즈', logoUrl: null, isActive: true, leagueId: 9 },
    { id: 204, name: '두산 베어스', logoUrl: null, isActive: true, leagueId: 9 },
    { id: 205, name: 'SSG 랜더스', logoUrl: null, isActive: true, leagueId: 9 },
    { id: 206, name: 'KT 위즈', logoUrl: null, isActive: true, leagueId: 9 },
    { id: 207, name: 'NC 다이노스', logoUrl: null, isActive: true, leagueId: 9 },
    { id: 208, name: '롯데 자이언츠', logoUrl: null, isActive: true, leagueId: 9 },
    { id: 209, name: '한화 이글스', logoUrl: null, isActive: true, leagueId: 9 },
    { id: 210, name: '키움 히어로즈', logoUrl: null, isActive: true, leagueId: 9 },
  ],
  // 10: NPB 센트럴 (일본)
  10: [
    { id: 1701, name: '요미우리 자이언츠', logoUrl: null, isActive: true, leagueId: 10 },
    { id: 1702, name: '한신 타이거스', logoUrl: null, isActive: true, leagueId: 10 },
    { id: 1703, name: '히로시마 도요 카프', logoUrl: null, isActive: true, leagueId: 10 },
    { id: 1704, name: '도쿄 야쿠르트 스왈로스', logoUrl: null, isActive: true, leagueId: 10 },
    { id: 1705, name: '요코하마 DeNA 베이스타스', logoUrl: null, isActive: true, leagueId: 10 },
    { id: 1706, name: '주니치 드래곤스', logoUrl: null, isActive: true, leagueId: 10 },
  ],
  // 11: NPB 퍼시픽 (일본)
  11: [
    { id: 1801, name: '후쿠오카 소프트뱅크 호크스', logoUrl: null, isActive: true, leagueId: 11 },
    { id: 1802, name: '도호쿠 라쿠텐 골든이글스', logoUrl: null, isActive: true, leagueId: 11 },
    { id: 1803, name: '홋카이도 닛폰햄 파이터스', logoUrl: null, isActive: true, leagueId: 11 },
    { id: 1804, name: '사이타마 세이부 라이온스', logoUrl: null, isActive: true, leagueId: 11 },
    { id: 1805, name: '치바 롯데 마린스', logoUrl: null, isActive: true, leagueId: 11 },
    { id: 1806, name: '오릭스 버팔로스', logoUrl: null, isActive: true, leagueId: 11 },
  ],
  // 12: MLB 아메리칸 리그 (미국)
  12: [
    { id: 1901, name: '뉴욕 양키스', logoUrl: null, isActive: true, leagueId: 12 },
    { id: 1902, name: '보스턴 레드삭스', logoUrl: null, isActive: true, leagueId: 12 },
    { id: 1903, name: '휴스턴 애스트로스', logoUrl: null, isActive: true, leagueId: 12 },
    { id: 1904, name: '시애틀 매리너스', logoUrl: null, isActive: true, leagueId: 12 },
    { id: 1905, name: '토론토 블루제이스', logoUrl: null, isActive: true, leagueId: 12 },
  ],
  // 13: MLB 내셔널 리그 (미국)
  13: [
    { id: 2001, name: 'LA 다저스', logoUrl: null, isActive: true, leagueId: 13 },
    { id: 2002, name: '샌프란시스코 자이언츠', logoUrl: null, isActive: true, leagueId: 13 },
    { id: 2003, name: '뉴욕 메츠', logoUrl: null, isActive: true, leagueId: 13 },
    { id: 2004, name: '샌디에이고 파드리스', logoUrl: null, isActive: true, leagueId: 13 },
    { id: 2005, name: '애틀랜타 브레이브스', logoUrl: null, isActive: true, leagueId: 13 },
  ],
  // 14: KBL (한국 — 농구)
  14: [
    { id: 301, name: '서울 SK 나이츠', logoUrl: null, isActive: true, leagueId: 14 },
    { id: 302, name: '원주 DB 프로미', logoUrl: null, isActive: true, leagueId: 14 },
    { id: 303, name: '안양 정관장', logoUrl: null, isActive: true, leagueId: 14 },
    { id: 304, name: '울산 현대모비스 피버스', logoUrl: null, isActive: true, leagueId: 14 },
    { id: 305, name: '서울 삼성 썬더스', logoUrl: null, isActive: true, leagueId: 14 },
    { id: 306, name: '창원 LG 세이커스', logoUrl: null, isActive: true, leagueId: 14 },
    { id: 307, name: '수원 KT 소닉붐', logoUrl: null, isActive: true, leagueId: 14 },
    { id: 308, name: '대구 한국가스공사 페가수스', logoUrl: null, isActive: true, leagueId: 14 },
    { id: 309, name: '고양 소노 스카이거너스', logoUrl: null, isActive: true, leagueId: 14 },
    { id: 310, name: '부산 KCC 이지스', logoUrl: null, isActive: true, leagueId: 14 },
  ],
  // 15: NBA (미국)
  15: [
    { id: 2101, name: '보스턴 셀틱스', logoUrl: null, isActive: true, leagueId: 15 },
    { id: 2102, name: '뉴욕 닉스', logoUrl: null, isActive: true, leagueId: 15 },
    { id: 2103, name: '필라델피아 76ers', logoUrl: null, isActive: true, leagueId: 15 },
    { id: 2104, name: '밀워키 벅스', logoUrl: null, isActive: true, leagueId: 15 },
    { id: 2105, name: '마이애미 히트', logoUrl: null, isActive: true, leagueId: 15 },
    { id: 2106, name: 'LA 레이커스', logoUrl: null, isActive: true, leagueId: 15 },
    { id: 2107, name: '골든스테이트 워리어스', logoUrl: null, isActive: true, leagueId: 15 },
    { id: 2108, name: '피닉스 선스', logoUrl: null, isActive: true, leagueId: 15 },
    { id: 2109, name: '덴버 너기츠', logoUrl: null, isActive: true, leagueId: 15 },
    { id: 2110, name: '댈러스 매버릭스', logoUrl: null, isActive: true, leagueId: 15 },
  ],
  // 16: B.League (일본)
  16: [
    { id: 2201, name: '치바 제츠', logoUrl: null, isActive: true, leagueId: 16 },
    { id: 2202, name: '류큐 골든킹스', logoUrl: null, isActive: true, leagueId: 16 },
    { id: 2203, name: '알바르크 도쿄', logoUrl: null, isActive: true, leagueId: 16 },
    { id: 2204, name: '카와사키 브레이브 썬더스', logoUrl: null, isActive: true, leagueId: 16 },
  ],
  // 17: V-리그 남자부 (한국 — 배구)
  17: [
    { id: 401, name: '대전 삼성화재 블루팡스', logoUrl: null, isActive: true, leagueId: 17 },
    { id: 402, name: '인천 대한항공 점보스', logoUrl: null, isActive: true, leagueId: 17 },
    { id: 403, name: '수원 한국전력 빅스톰', logoUrl: null, isActive: true, leagueId: 17 },
    { id: 404, name: '의정부 KB손해보험 스타즈', logoUrl: null, isActive: true, leagueId: 17 },
    { id: 405, name: '서울 우리카드 우리WON', logoUrl: null, isActive: true, leagueId: 17 },
    { id: 406, name: '안산 OK금융그룹 읏맨', logoUrl: null, isActive: true, leagueId: 17 },
    { id: 407, name: '천안 현대캐피탈 스카이워커스', logoUrl: null, isActive: true, leagueId: 17 },
  ],
  // 18: V-리그 여자부 (한국)
  18: [
    { id: 411, name: '수원 현대건설 힐스테이트', logoUrl: null, isActive: true, leagueId: 18 },
    { id: 412, name: '인천 흥국생명 핑크스파이더스', logoUrl: null, isActive: true, leagueId: 18 },
    { id: 413, name: '대전 정관장 레드스파크스', logoUrl: null, isActive: true, leagueId: 18 },
    { id: 414, name: '서울 GS칼텍스 KIXX', logoUrl: null, isActive: true, leagueId: 18 },
    { id: 415, name: '화성 IBK기업은행 알토스', logoUrl: null, isActive: true, leagueId: 18 },
    { id: 416, name: '김천 한국도로공사 하이패스', logoUrl: null, isActive: true, leagueId: 18 },
    { id: 417, name: '광주 페퍼저축은행 AI 페퍼스', logoUrl: null, isActive: true, leagueId: 18 },
  ],
  // 19: SV.리그 (일본)
  19: [
    { id: 2301, name: '산토리 선버즈', logoUrl: null, isActive: true, leagueId: 19 },
    { id: 2302, name: '파나소닉 팬서스', logoUrl: null, isActive: true, leagueId: 19 },
    { id: 2303, name: 'JT 선더스 히로시마', logoUrl: null, isActive: true, leagueId: 19 },
  ],
};

/**
 * 종목별 팀 전체 (게시판 매핑 등 sport 단위 조회 용도로만 사용).
 * TeamSelector는 4단계 cascading API(`/leagues/:id/teams`)를 사용하므로
 * 가능하면 이 매핑 대신 leagues + teamsByLeague 조합을 우선 사용.
 */
export const teamsBySport: Record<number, Team[]> = {
  1: leagues.filter((l) => l.sportId === 1).flatMap((l) => teamsByLeague[l.id] ?? []),
  2: leagues.filter((l) => l.sportId === 2).flatMap((l) => teamsByLeague[l.id] ?? []),
  3: leagues.filter((l) => l.sportId === 3).flatMap((l) => teamsByLeague[l.id] ?? []),
  4: leagues.filter((l) => l.sportId === 4).flatMap((l) => teamsByLeague[l.id] ?? []),
};

// ──────────────────────────────────────────────
// 게시판
// ──────────────────────────────────────────────

export const boards: Board[] = [
  { id: 1, name: '자유게시판', type: 'COMMON', teamId: null, teamName: null },
  { id: 2, name: 'Q&A', type: 'QNA', teamId: null, teamName: null },
  { id: 3, name: '뉴스', type: 'NEWS', teamId: null, teamName: null },
  { id: 4, name: 'LG 트윈스 게시판', type: 'TEAM', teamId: 201, teamName: 'LG 트윈스' },
  { id: 5, name: '전북 현대 게시판', type: 'TEAM', teamId: 101, teamName: '전북 현대 모터스' },
  { id: 6, name: 'KIA 타이거즈 게시판', type: 'TEAM', teamId: 203, teamName: 'KIA 타이거즈' },
  { id: 7, name: 'SK 나이츠 게시판', type: 'TEAM', teamId: 301, teamName: '서울 SK 나이츠' },
  {
    id: 8,
    name: '대한항공 점보스 게시판',
    type: 'TEAM',
    teamId: 402,
    teamName: '인천 대한항공 점보스',
  },
];

// ──────────────────────────────────────────────
// 게시글 목록 (80개)
// ──────────────────────────────────────────────

const AUTHORS = [
  '축구광팬',
  '야구좋아',
  '슬램덩크',
  '배구매니아',
  '축구전문가',
  '야구초보',
  'AI 어시스턴트',
  '스포츠일기',
  '직관러',
  '응원단장',
  '구단주꿈나무',
  '벤치워머',
  '데이터분석',
  '클래식팬',
  '신입팬',
] as const;

function makePost(
  id: number,
  title: string,
  authorIdx: number,
  daysAgo: number,
  hour: number,
  minute: number,
  views: number,
  likes: number,
  comments: number,
  isAi = false,
): PostListItem {
  const date = new Date(2026, 1, 26 - daysAgo, hour, minute);
  return {
    id,
    title,
    authorNickname: AUTHORS[authorIdx],
    viewCount: views,
    likeCount: likes,
    commentCount: comments,
    isAiGenerated: isAi,
    createdAt: date.toISOString().slice(0, 19),
  };
}

export const postListItems: PostListItem[] = [
  makePost(1, '이번 시즌 전북 전력 분석', 0, 0, 14, 30, 342, 28, 15),
  makePost(2, 'LG 트윈스 올해 로스터 어떻게 보시나요?', 1, 0, 12, 0, 521, 45, 32),
  makePost(3, '[AI 분석] K리그 1R 주요 경기 프리뷰', 6, 1, 18, 0, 1024, 89, 41, true),
  makePost(4, '농구 시즌 MVP 후보 정리', 2, 1, 10, 15, 198, 12, 8),
  makePost(5, '배구 올스타전 하이라이트 모음', 3, 2, 20, 45, 456, 37, 19),
  makePost(6, '신입 팬인데 야구 규칙 좀 알려주세요', 5, 2, 9, 30, 287, 15, 24),
  makePost(7, '오늘 직관 후기 (울산 vs 서울)', 0, 3, 22, 10, 634, 52, 27),
  makePost(8, 'KIA 타이거즈 신인 드래프트 분석', 1, 3, 18, 30, 412, 33, 18),
  makePost(9, '[AI 분석] V리그 플레이오프 전망', 6, 3, 15, 0, 876, 67, 29, true),
  makePost(10, '울산 HD FC 새 외국인 선수 어떤가요?', 4, 3, 11, 20, 589, 41, 35),
  makePost(11, 'DB 프로미 올시즌 로테이션 예상', 2, 4, 21, 45, 231, 19, 11),
  makePost(12, '직관 꿀팁 정리 (좌석, 먹거리, 교통)', 5, 4, 16, 0, 1523, 124, 56),
  makePost(13, '삼성 라이온즈 캠프 소식 총정리', 1, 4, 13, 30, 378, 25, 13),
  makePost(14, '[AI 분석] KBO 개막전 선발 투수 비교', 6, 4, 10, 0, 945, 72, 38, true),
  makePost(15, 'FC 서울 시즌권 같이 살 분?', 0, 5, 22, 30, 267, 8, 42),
  makePost(16, '삼성화재 블루팡스 외국인 선수 근황', 3, 5, 19, 15, 334, 22, 9),
  makePost(17, 'SSG 랜더스 올해 불펜 전력 어떻게 보시나요', 1, 5, 15, 0, 489, 38, 21),
  makePost(18, '현대모비스 피버스 신인 선수 기대평', 2, 5, 11, 30, 176, 14, 7),
  makePost(19, '[AI 분석] 2026 K리그 우승 후보 TOP 3', 6, 5, 9, 0, 2134, 156, 87, true),
  makePost(20, '두산 베어스 캠프 직관 다녀왔습니다', 5, 6, 20, 0, 543, 47, 23),
  makePost(21, '포항 스틸러스 유스 출신 선수들 근황', 4, 6, 17, 30, 298, 21, 10),
  makePost(22, '대한항공 점보스 응원가 모음', 3, 6, 14, 0, 687, 55, 14),
  makePost(23, '스포츠 직관 카메라 추천해주세요', 5, 6, 10, 45, 432, 31, 28),
  makePost(24, '[AI 분석] KBL 득점 효율 TOP 10 선수', 6, 7, 20, 0, 756, 58, 22, true),
  makePost(25, '수원 삼성 새 감독 체제 전망', 0, 7, 16, 30, 445, 36, 19),
  makePost(26, 'LG 트윈스 시즌권 후기', 1, 7, 13, 0, 812, 63, 34),
  makePost(27, 'SK 나이츠 홈경기 좌석 추천', 2, 7, 9, 30, 356, 27, 16),
  makePost(28, '한국전력 빅스톰 올시즌 전력 분석', 3, 8, 21, 0, 223, 16, 6),
  makePost(29, '[AI 분석] KBO 팀별 타선 파워랭킹', 6, 8, 18, 0, 1876, 132, 64, true),
  makePost(30, '올해 ACL 진출팀 예상', 4, 8, 14, 30, 567, 44, 31),
  makePost(31, '정관장 치어리더 응원 후기', 2, 8, 11, 0, 923, 78, 25),
  makePost(32, '야구장 먹거리 맛집 TOP 5', 5, 8, 8, 0, 2456, 189, 72),
  makePost(33, '전북 vs 울산 클래식 명경기 모음', 0, 9, 22, 0, 1345, 98, 45),
  makePost(34, '[AI 분석] V리그 서브 에이스 효율 비교', 6, 9, 18, 30, 634, 48, 17, true),
  makePost(35, '이번 주말 직관 가실 분 모집', 1, 9, 15, 0, 387, 15, 53),
  makePost(36, '농구 입문자를 위한 포지션 가이드', 2, 9, 11, 30, 876, 67, 20),
  makePost(37, '배구 경기 규칙 변경 사항 정리 (2026)', 3, 9, 8, 0, 534, 42, 11),
  makePost(38, '스포츠 유니폼 세탁 꿀팁', 5, 10, 20, 0, 1123, 91, 33),
  makePost(39, '[AI 분석] K리그 팀별 패스 성공률 비교', 6, 10, 16, 0, 789, 56, 24, true),
  makePost(40, '올 시즌 기대되는 외국인 선수 BEST 5', 4, 10, 12, 0, 1678, 121, 58),
  makePost(41, 'KBO 외인 투수 영입 트렌드 분석', 12, 10, 9, 30, 432, 35, 15),
  makePost(42, '안양 정관장 새 시즌 컨텐더 가능성', 2, 11, 21, 30, 287, 23, 9),
  makePost(43, '울산 현대모비스 피버스 백투백 우승 도전', 9, 11, 18, 0, 654, 48, 22),
  makePost(44, '제주 유나이티드 홈구장 분위기 미쳤습니다', 8, 11, 14, 30, 421, 36, 18),
  makePost(45, '[AI 분석] KBL 팀별 3점슛 성공률 비교', 6, 11, 10, 0, 567, 41, 14, true),
  makePost(46, '강원 FC 도민구단 응원 후기', 14, 11, 8, 0, 198, 12, 5),
  makePost(47, '키움 히어로즈 신인 외야수 주목할 만한가요?', 1, 12, 22, 0, 387, 28, 19),
  makePost(48, '광주 FC 응원단 모집 공지', 10, 12, 19, 30, 156, 9, 7),
  makePost(49, '인천 대한항공 점보스 V리그 우승 갈 수 있을까', 3, 12, 15, 30, 723, 56, 31),
  makePost(50, '이번 주 KBO 주요 매치업 리뷰', 12, 12, 12, 0, 845, 67, 28),
  makePost(51, '대구 FC 새 외국인 공격수 영입', 4, 12, 9, 0, 312, 24, 11),
  makePost(52, '롯데 자이언츠 사직야구장 직관 후기', 5, 13, 21, 0, 989, 78, 41),
  makePost(53, '[AI 분석] 2026 KBL 컨퍼런스 PO 진출 예상', 6, 13, 17, 0, 1234, 95, 47, true),
  makePost(54, '부산 KCC 이지스 새 시즌 라인업', 2, 13, 13, 30, 445, 33, 16),
  makePost(55, '한화 이글스 류현진 복귀 효과 어떻게 보시나요', 1, 13, 10, 0, 1567, 132, 78),
  makePost(56, '서울 삼성 썬더스 영입 시장 평가', 11, 13, 8, 30, 287, 21, 8),
  makePost(57, 'NC 다이노스 캠프 분위기 좋네요', 13, 14, 22, 30, 456, 38, 17),
  makePost(58, '창원 LG 세이커스 응원 다녀왔습니다', 9, 14, 19, 0, 234, 18, 6),
  makePost(59, 'KT 위즈 마운드 보강 어떤가요', 1, 14, 15, 0, 612, 47, 25),
  makePost(60, '[AI 분석] KBO 타격왕 후보 TOP 5', 6, 14, 11, 0, 1789, 145, 63, true),
  makePost(61, '대전 하나시티즌 시민구단 정신 응원합니다', 14, 14, 8, 0, 167, 10, 4),
  makePost(62, '수원 KT 소닉붐 프런트 영입 평가', 11, 15, 21, 0, 298, 22, 9),
  makePost(63, '의정부 KB손해보험 스타즈 토종 거포 등장', 3, 15, 18, 0, 423, 31, 13),
  makePost(64, '서울 우리카드 우리WON 새 시즌 키플레이어', 3, 15, 14, 30, 367, 28, 11),
  makePost(65, '안산 OK금융그룹 읏맨 외국인 새 얼굴', 3, 15, 11, 0, 312, 24, 8),
  makePost(66, '천안 현대캐피탈 스카이워커스 토너먼트 강팀', 13, 15, 8, 0, 456, 34, 15),
  makePost(67, '김천 상무 군 복무 선수 명단 정리', 4, 16, 21, 30, 521, 41, 19),
  makePost(68, '[AI 분석] V리그 여자부 미디어 데이 정리', 6, 16, 17, 0, 689, 52, 21, true),
  makePost(69, '고양 소노 스카이거너스 홈경기 응원 인상적', 9, 16, 13, 0, 198, 14, 5),
  makePost(70, '대구 한국가스공사 페가수스 영입 시장 평가', 11, 16, 9, 0, 245, 18, 7),
  makePost(71, '직관 갈 때 들고 가는 필수품 정리', 5, 17, 22, 0, 1456, 112, 48),
  makePost(72, '응원가 따라부르기 초보 가이드', 14, 17, 19, 30, 678, 54, 22),
  makePost(73, '경기장 화장실 줄 안 서는 꿀팁', 5, 17, 15, 30, 1023, 87, 34),
  makePost(74, '시즌권 양도 시 주의사항', 8, 17, 12, 0, 432, 33, 18),
  makePost(75, '[AI 분석] KBO 도루왕 후보 분석', 6, 17, 9, 0, 567, 42, 16, true),
  makePost(76, '구단 굿즈 어디서 구매하나요?', 5, 18, 21, 0, 387, 28, 31),
  makePost(77, '응원봉 가격 정리해 봤습니다', 3, 18, 17, 30, 445, 35, 14),
  makePost(78, '직관 후 사진 잘 찍는 법', 8, 18, 14, 0, 612, 48, 19),
  makePost(79, '시즌 종료 후 코치진 변화 정리', 12, 18, 10, 30, 734, 58, 27),
  makePost(80, '[AI 분석] 신인 선수 영향력 종합 평가', 6, 18, 8, 0, 1234, 92, 41, true),
];

// ──────────────────────────────────────────────
// 게시글 상세 (id별 매핑, 12개 풍부한 콘텐츠)
// ──────────────────────────────────────────────

const POST_AUTHORS_BY_NICKNAME: Record<string, { id: number; teamName?: string }> = {
  축구광팬: { id: 10, teamName: '전북 현대 모터스' },
  야구좋아: { id: 11, teamName: 'LG 트윈스' },
  슬램덩크: { id: 12, teamName: '서울 SK 나이츠' },
  배구매니아: { id: 13, teamName: '인천 대한항공 점보스' },
  축구전문가: { id: 14, teamName: '울산 HD FC' },
  야구초보: { id: 15, teamName: '두산 베어스' },
  'AI 어시스턴트': { id: 99 },
  스포츠일기: { id: 16, teamName: '롯데 자이언츠' },
  직관러: { id: 17 },
  응원단장: { id: 18, teamName: 'KIA 타이거즈' },
  구단주꿈나무: { id: 19 },
  벤치워머: { id: 20 },
  데이터분석: { id: 21 },
  클래식팬: { id: 22 },
  신입팬: { id: 23 },
};

function makePostDetail(
  listItem: PostListItem,
  boardId: number,
  boardName: string,
  content: string,
  isLiked = false,
): PostDetail {
  const author = POST_AUTHORS_BY_NICKNAME[listItem.authorNickname] ?? { id: 99 };
  return {
    id: listItem.id,
    boardId,
    boardName,
    author: {
      id: author.id,
      nickname: listItem.authorNickname,
      teamName: author.teamName,
      profileImageUrl: null,
    },
    title: listItem.title,
    content,
    viewCount: listItem.viewCount,
    likeCount: listItem.likeCount,
    commentCount: listItem.commentCount,
    isAiGenerated: listItem.isAiGenerated,
    isLiked,
    files: [],
    createdAt: listItem.createdAt,
    updatedAt: listItem.createdAt,
  };
}

export const postDetailsById: Record<number, PostDetail> = {
  1: makePostDetail(
    postListItems[0],
    5,
    '전북 현대 게시판',
    `안녕하세요, 이번 시즌 전북 현대 모터스의 전력을 분석해보려 합니다.

## 공격진
올해 새로 영입한 외국인 공격수의 활약이 기대됩니다. 지난 시즌 득점왕 경쟁에서 아쉽게 2위를 차지했지만, 올해는 더 강력한 지원사격이 예상됩니다.

## 수비진
센터백 라인이 탄탄해졌습니다. 특히 유스 출신 선수들의 성장이 눈에 띕니다.

## 전망
개인적으로 올해 최소 ACL 진출권은 확보할 수 있을 것으로 보입니다.

여러분의 의견은 어떠신가요?`,
  ),
  2: makePostDetail(
    postListItems[1],
    4,
    'LG 트윈스 게시판',
    `LG 트윈스 올해 로스터 보고 느낀 점 공유합니다.

선발진은 작년보다 한층 두꺼워졌고, 불펜도 베테랑 + 영건 조합이 잘 짜였다고 봅니다.
타선은 1번부터 9번까지 빈자리가 거의 없는 느낌이고요.

문제는 부상 변수인데, 캠프 보면서 컨디션 체크 중입니다.
다들 어떻게 보시는지 궁금합니다!`,
  ),
  3: makePostDetail(
    postListItems[2],
    3,
    '뉴스',
    `K리그 1라운드 주요 경기를 AI로 분석해 봤습니다.

## 전북 vs 울산
- 최근 5경기 상대 전적: 전북 2승 2무 1패
- 키 매치업: 양 팀 외국인 공격수의 득점 경쟁
- 예상 스코어: 2-1 (전북)

## FC서울 vs 수원
- 최근 5경기 상대 전적: FC서울 3승 1무 1패
- 키 매치업: 서울 미드필더 라인의 빌드업 vs 수원 압박
- 예상 스코어: 1-1

분석은 최근 3시즌 데이터 기반으로 진행했습니다.`,
    true,
  ),
  5: makePostDetail(
    postListItems[4],
    1,
    '자유게시판',
    `이번 V리그 올스타전 다녀왔습니다.
하이라이트 영상으로 정리해두려고 합니다.

1쿼터: 양 팀 워밍업이 미친 듯 화려해서 놀랐습니다
2쿼터: 서브 에이스 대결, 진짜 명장면이 많이 나왔어요
3쿼터: 박빙의 디그 + 블로킹 응수
4쿼터: 마지막 5점이 정말 짜릿했습니다

직관 못 가신 분들 위해 곧 영상 링크 공유해드릴게요!`,
  ),
  7: makePostDetail(
    postListItems[6],
    1,
    '자유게시판',
    `오늘 울산 vs 서울 직관 다녀왔습니다.
울산 홈인데 서울 원정팬이 진짜 많이 와서 분위기 미쳤어요.

전반은 서울이 압도적이었는데, 후반 60분 이후 울산이 살아나면서 결국 2-1 역전승.
울산 외국인 공격수 결승골이 정말 환상적이었습니다.

직관 가시는 분들 참고로 좌석 추천도 함께 남겨둡니다.`,
  ),
  12: makePostDetail(
    postListItems[11],
    1,
    '자유게시판',
    `직관 처음 가시는 분들을 위해 꿀팁 정리합니다.

## 좌석
- 외야: 응원이 가장 뜨거움, 가족 단위는 비추천
- 내야 1층: 가성비 좋고 시야 무난
- 테이블석: 식음료 편하지만 응원 분위기는 약함

## 먹거리
- 야구장: 외부 음식 반입 가능 (주류 제외)
- 축구장: 일부 구장은 외부 음식 제한 있음 → 미리 확인

## 교통
- 잠실: 2호선 종합운동장역
- 사직: 1호선 사직역 도보 15분
- 전주월드컵: 시내버스 환승 필요

질문 있으시면 댓글로 남겨주세요!`,
  ),
  19: makePostDetail(
    postListItems[18],
    3,
    '뉴스',
    `2026 K리그 우승 후보 AI 분석 결과입니다.

## TOP 3
1. **울산 HD FC** — 작년 우승팀, 외국인 공격수 유지
2. **전북 현대** — 새 감독 효과 + 신예 + 베테랑 균형
3. **포항 스틸러스** — 유스 시스템에서 올라온 자원이 풍부

## 다크호스
- 강원 FC: 시즌 후반 폼 유지하면 충분히 가능
- 김천 상무: 군 복무 선수들의 컨디션 관건

## 분석 방법
최근 5시즌 데이터 + 이적시장 영입/방출 + 캠프 데이터 종합.`,
    true,
  ),
  29: makePostDetail(
    postListItems[28],
    3,
    '뉴스',
    `KBO 10개 구단 타선을 종합 점수화해 봤습니다.

## 1~3위
1. KIA 타이거즈 — 최강 타선, 1번~9번 누구든 한방 가능
2. LG 트윈스 — 클러치 능력 + 출루율 균형
3. 두산 베어스 — 거포 라인업 보강

## 4~7위
삼성 / SSG / KT / 키움

## 8~10위
NC / 롯데 / 한화

지표: wRC+, OPS, 클러치 ISO, 득점권 타율 종합
시즌 진행되며 변동 가능성 큽니다.`,
    true,
  ),
  32: makePostDetail(
    postListItems[31],
    1,
    '자유게시판',
    `야구장 먹거리 추천 TOP 5 정리합니다.

1. **잠실 - 평양냉면**: 줄 기본 30분
2. **사직 - 부산어묵**: 직관에 빠질 수 없음
3. **광주 - 떡갈비 도시락**: 5회말 전에 사야 함
4. **고척 - 핫도그**: 어린이 인기
5. **수원 - 치킨박스**: 가장 호불호 적음

여러분 최애 구장 먹거리는 무엇인가요?`,
  ),
  55: makePostDetail(
    postListItems[54],
    6,
    'KIA 타이거즈 게시판',
    `한화 이글스에 류현진이 합류한 효과 어떻게 보시나요?

선발 1선발이 확실해진 것만 해도 시즌 흐름을 크게 바꿀 수 있다고 봅니다.
다만 부상 관리 + 이닝 분배가 관건이겠죠.

마운드 운영이 잘 풀리면 가을야구 진출도 충분히 가능하다고 봅니다.
다른 분들 의견 듣고 싶습니다.`,
  ),
  60: makePostDetail(
    postListItems[59],
    3,
    '뉴스',
    `KBO 타격왕 후보 5명을 데이터로 비교해 봤습니다.

## 후보 5인
- KIA A선수 (작년 0.340)
- LG B선수 (작년 0.328)
- 두산 C선수 (작년 0.319)
- 삼성 D선수 (외인, 데뷔)
- KT E선수 (포지션 변경 후 폼 상승)

## 분석 포인트
- 컨택 능력
- 타격 기대값(BABIP, xBA)
- 부상 이력
- 라인업 구성

올 시즌 가장 안정적으로 0.330+ 유지할 가능성이 높은 선수를 1순위로 꼽았습니다.`,
    true,
  ),
  71: makePostDetail(
    postListItems[70],
    1,
    '자유게시판',
    `직관 갈 때 챙기는 필수품 정리합니다.

## 필수
- 응원봉 / 수건
- 보조배터리
- 우비 (야외 구장 필수)
- 쿠션

## 권장
- 망원경 (외야석)
- 휴지/물티슈
- 간단한 간식
- 멀티탭(테이블석)

## 사양
- 외부 음식(축구장 일부 제한)
- 큰 가방 (수하물 검사 시 시간 소요)

여러분만의 필수품도 댓글로 공유해주세요!`,
  ),
};

// ──────────────────────────────────────────────
// 댓글 (post별 분리, postId가 매핑에 없으면 빈 배열)
// ──────────────────────────────────────────────

function comment(
  id: number,
  authorId: number,
  nickname: string,
  teamName: string | undefined,
  content: string,
  daysAgo: number,
  hour: number,
  minute: number,
  isAi = false,
  replies: Comment[] = [],
): Comment {
  return {
    id,
    author: { id: authorId, nickname, teamName, profileImageUrl: null },
    content,
    isAiGenerated: isAi,
    createdAt: new Date(2026, 1, 26 - daysAgo, hour, minute).toISOString().slice(0, 19),
    replies,
  };
}

export const commentsByPost: Record<number, Comment[]> = {
  1: [
    comment(
      101,
      11,
      '야구좋아',
      'LG 트윈스',
      '전북 올해 진짜 기대됩니다. 새 외국인 선수 영입이 신의 한 수인 것 같아요.',
      0,
      15,
      0,
      false,
      [
        comment(
          102,
          10,
          '축구광팬',
          '전북 현대 모터스',
          '@야구좋아 감사합니다! 저도 그렇게 생각합니다. 특히 빌드업 능력이 출중하더라고요.',
          0,
          15,
          10,
        ),
      ],
    ),
    comment(
      103,
      12,
      '슬램덩크',
      '서울 SK 나이츠',
      '수비 보강이 잘 된 것 같네요. ACL 충분히 가능할 듯!',
      0,
      16,
      20,
    ),
    comment(
      104,
      13,
      '배구매니아',
      '인천 대한항공 점보스',
      '전북 유스 시스템은 진짜 대한민국 최고인 것 같습니다. 매년 좋은 선수가 올라오네요.',
      0,
      17,
      30,
      false,
      [
        comment(
          105,
          14,
          '축구전문가',
          '울산 HD FC',
          '@배구매니아 맞아요. 특히 이번에 올라온 CB가 정말 기대됩니다.',
          0,
          18,
          0,
        ),
      ],
    ),
    comment(
      106,
      18,
      '응원단장',
      'KIA 타이거즈',
      '전북 직관 한번 가보고 싶네요. 분위기 좋다고 들었어요.',
      0,
      19,
      12,
    ),
  ],
  2: [
    comment(
      110,
      10,
      '축구광팬',
      '전북 현대 모터스',
      'LG 올해 진짜 강할 것 같아요. 마운드 보강이 인상적입니다.',
      0,
      12,
      30,
    ),
    comment(
      111,
      15,
      '야구초보',
      '두산 베어스',
      '이번에 영입한 외국인 투수 어떤가요? 작년 캠프 영상 보면 슬라이더가 일품이던데.',
      0,
      13,
      5,
      false,
      [
        comment(
          112,
          11,
          '야구좋아',
          'LG 트윈스',
          '@야구초보 슬라이더 + 체인지업 조합이 좋습니다. 다만 이닝 소화가 관건이겠어요.',
          0,
          13,
          22,
        ),
      ],
    ),
    comment(
      113,
      21,
      '데이터분석',
      undefined,
      'OPS 기반으로 보면 LG 타선이 작년보다 평균 0.025 정도 상승할 가능성이 큽니다.',
      0,
      14,
      1,
    ),
    comment(
      114,
      22,
      '클래식팬',
      undefined,
      '잠실 직관 잘 가는데 분위기 진짜 좋더라고요. 응원가 따라부르는 재미가 있어요.',
      0,
      14,
      50,
    ),
  ],
  3: [
    comment(
      120,
      11,
      '야구좋아',
      'LG 트윈스',
      'AI 분석 퀄리티 점점 좋아지네요. 다음 분석도 기대합니다.',
      1,
      19,
      5,
    ),
    comment(
      121,
      14,
      '축구전문가',
      '울산 HD FC',
      '울산 vs 전북 매치업 분석은 살짝 보수적인 듯. 전북 우세 더 강할 듯요.',
      1,
      19,
      33,
    ),
    comment(
      122,
      10,
      '축구광팬',
      '전북 현대 모터스',
      '@축구전문가 동감입니다. 그래도 다양한 시각이라 좋네요.',
      1,
      19,
      47,
    ),
  ],
  5: [
    comment(
      130,
      13,
      '배구매니아',
      '인천 대한항공 점보스',
      '저도 직관 갔었는데 진짜 명장면 많았어요!',
      2,
      21,
      5,
    ),
    comment(131, 17, '직관러', undefined, '영상 빠르게 공유 부탁드립니다 ㅎㅎ', 2, 21, 30),
    comment(
      132,
      19,
      '구단주꿈나무',
      undefined,
      '5쿼터에 디그 막 들어가는 거 보고 소름 돋았네요.',
      2,
      22,
      0,
    ),
  ],
  7: [
    comment(
      140,
      14,
      '축구전문가',
      '울산 HD FC',
      '울산 후반 살아난 게 결정적이었죠. 외인 결승골 두고두고 회자될 듯.',
      3,
      22,
      30,
    ),
    comment(
      141,
      18,
      '응원단장',
      'KIA 타이거즈',
      '서울 원정팬도 정말 많았다고 들었어요. 분위기 부럽습니다.',
      3,
      22,
      50,
    ),
  ],
  12: [
    comment(
      150,
      15,
      '야구초보',
      '두산 베어스',
      '이거 진짜 도움 많이 됩니다. 첫 직관 앞두고 있는데 참고할게요!',
      4,
      16,
      30,
    ),
    comment(
      151,
      23,
      '신입팬',
      undefined,
      '잠실 외야 응원이 가장 뜨겁다고 들었는데 사실인가요?',
      4,
      17,
      0,
      false,
      [
        comment(
          152,
          15,
          '야구초보',
          '두산 베어스',
          '@신입팬 네, 외야가 진짜 응원 분위기 끝판왕입니다.',
          4,
          17,
          25,
        ),
      ],
    ),
    comment(
      153,
      17,
      '직관러',
      undefined,
      '테이블석 처음 가봤는데 식음료 편한 건 진짜 장점이지만 응원은 좀 약하네요.',
      4,
      18,
      12,
    ),
  ],
  19: [
    comment(
      160,
      14,
      '축구전문가',
      '울산 HD FC',
      '강원이 다크호스라는 분석 동의합니다. 시즌 후반 폼 유지가 진짜 관건이에요.',
      5,
      9,
      30,
    ),
    comment(
      161,
      10,
      '축구광팬',
      '전북 현대 모터스',
      '전북이 2위라는 게 약간 보수적이네요. 1위 기대해볼게요!',
      5,
      9,
      45,
    ),
    comment(
      162,
      21,
      '데이터분석',
      undefined,
      'AI 모델이 캠프 데이터까지 반영했으면 더 정밀했을 것 같네요.',
      5,
      10,
      5,
    ),
  ],
  29: [
    comment(
      170,
      18,
      '응원단장',
      'KIA 타이거즈',
      'KIA 1위 인정합니다 ㅎㅎ 작년 우승은 거저 얻은 게 아니에요.',
      8,
      18,
      30,
    ),
    comment(
      171,
      11,
      '야구좋아',
      'LG 트윈스',
      'LG가 2위인 건 살짝 아쉽지만, 동의합니다. 시즌 흐름이 관건이겠죠.',
      8,
      18,
      50,
    ),
    comment(
      172,
      16,
      '스포츠일기',
      '롯데 자이언츠',
      '롯데 9위...ㅠㅠ 그래도 응원합니다.',
      8,
      19,
      12,
    ),
  ],
  32: [
    comment(
      180,
      18,
      '응원단장',
      'KIA 타이거즈',
      '광주 떡갈비 도시락 진짜 5회말 전 안 사면 줄 길어서 못 사요!',
      8,
      8,
      30,
    ),
    comment(
      181,
      17,
      '직관러',
      undefined,
      '잠실 평양냉면 줄 진짜 미친듯이 길어요... 6회 들어가면 매진.',
      8,
      8,
      50,
    ),
    comment(
      182,
      22,
      '클래식팬',
      undefined,
      '사직 부산어묵 인정합니다. 야구 보러 가는 게 아니라 어묵 먹으러 가는 수준.',
      8,
      9,
      15,
    ),
  ],
  55: [
    comment(
      190,
      11,
      '야구좋아',
      'LG 트윈스',
      '류현진 효과는 진짜 클 것 같습니다. 다만 부상 관리가 핵심이겠죠.',
      13,
      10,
      30,
    ),
    comment(
      191,
      18,
      '응원단장',
      'KIA 타이거즈',
      'KIA로 와줬으면 좋았을 텐데 ㅋㅋㅋ 한화 팬분들 부럽네요.',
      13,
      10,
      50,
    ),
    comment(
      192,
      21,
      '데이터분석',
      undefined,
      'WAR 기준으로 +3.5 ~ +4.0 정도 시즌 기여 예상됩니다.',
      13,
      11,
      12,
    ),
  ],
  60: [
    comment(
      200,
      18,
      '응원단장',
      'KIA 타이거즈',
      'KIA A선수 1순위 이의 없습니다. 작년에도 0.340 찍었으니까요.',
      14,
      11,
      30,
    ),
    comment(
      201,
      11,
      '야구좋아',
      'LG 트윈스',
      'LG B선수도 충분히 가능합니다. 출루율도 좋아서 평균 더 끌어올릴 수 있어요.',
      14,
      11,
      50,
    ),
  ],
  71: [
    comment(
      210,
      15,
      '야구초보',
      '두산 베어스',
      '쿠션은 진짜 필수입니다. 4시간 앉아 있으면 엉덩이가 ㅠㅠ',
      17,
      22,
      30,
    ),
    comment(
      211,
      17,
      '직관러',
      undefined,
      '비 올 때 우비 안 챙기면 진짜 후회합니다. 야구장은 더더욱.',
      17,
      22,
      50,
    ),
  ],
};

// ──────────────────────────────────────────────
// 공지사항 (id별 매핑)
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
  {
    id: 6,
    title: '신고 처리 정책 강화 안내',
    isPinned: false,
    scope: 'ALL',
    teamName: null,
    createdAt: '2026-02-19T11:00:00',
  },
  {
    id: 7,
    title: '전북 현대 게시판 개설 안내',
    isPinned: false,
    scope: 'TEAM',
    teamName: '전북 현대 모터스',
    createdAt: '2026-02-18T15:00:00',
  },
  {
    id: 8,
    title: 'AI 게시글 분석 베타 오픈',
    isPinned: false,
    scope: 'ALL',
    teamName: null,
    createdAt: '2026-02-17T10:00:00',
  },
  {
    id: 9,
    title: '모바일 앱 출시 일정 안내',
    isPinned: false,
    scope: 'ALL',
    teamName: null,
    createdAt: '2026-02-15T09:00:00',
  },
  {
    id: 10,
    title: '응원팀 변경 정책 변경 사항',
    isPinned: false,
    scope: 'ALL',
    teamName: null,
    createdAt: '2026-02-14T13:00:00',
  },
  {
    id: 11,
    title: 'KIA 타이거즈 게시판 개설 안내',
    isPinned: false,
    scope: 'TEAM',
    teamName: 'KIA 타이거즈',
    createdAt: '2026-02-13T14:00:00',
  },
  {
    id: 12,
    title: '회원가입/로그인 SSO 도입 안내',
    isPinned: false,
    scope: 'ALL',
    teamName: null,
    createdAt: '2026-02-10T10:00:00',
  },
];

export const noticeDetailsById: Record<number, NoticeDetail> = {
  1: {
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
  },
  2: {
    id: 2,
    title: '커뮤니티 이용 규칙 안내',
    content: `라커룸 커뮤니티는 모든 스포츠 팬이 즐겁게 이용할 수 있는 공간을 지향합니다.

## 금지 행위
1. 욕설, 비방, 인신공격
2. 도배 / 광고 게시글
3. 타 구단/선수 비하
4. 음란성 / 폭력성 콘텐츠
5. 개인정보 노출

위반 시 신고 시스템에 따라 게시글 삭제 / 정지 등의 조치가 이루어질 수 있습니다.`,
    isPinned: true,
    scope: 'ALL',
    teamId: null,
    teamName: null,
    adminNickname: '관리자',
    createdAt: '2026-02-20T10:00:00',
    updatedAt: '2026-02-20T10:00:00',
  },
  3: {
    id: 3,
    title: '2026 시즌 게시판 개편 안내',
    content: `2026 시즌을 맞아 게시판 구조를 일부 개편합니다.

- 종목별 게시판 + 팀별 게시판으로 이원화
- 뉴스 게시판은 관리자/AI만 작성 가능
- Q&A 게시판은 답변 인센티브 시스템 적용 (예정)

자세한 내용은 차후 별도 공지로 안내드립니다.`,
    isPinned: false,
    scope: 'ALL',
    teamId: null,
    teamName: null,
    adminNickname: '관리자',
    createdAt: '2026-02-22T14:00:00',
    updatedAt: '2026-02-22T14:00:00',
  },
  4: {
    id: 4,
    title: 'LG 트윈스 게시판 개설 안내',
    content: `LG 트윈스 팬분들의 요청에 따라 전용 게시판을 개설했습니다.

해당 게시판에서는 LG 트윈스 관련 글만 작성 부탁드립니다.
다른 구단 비방성 글은 신고 대상이 됩니다.`,
    isPinned: false,
    scope: 'TEAM',
    teamId: 201,
    teamName: 'LG 트윈스',
    adminNickname: '관리자',
    createdAt: '2026-02-21T16:00:00',
    updatedAt: '2026-02-21T16:00:00',
  },
  5: {
    id: 5,
    title: '서버 점검 안내 (2/28 02:00~06:00)',
    content: `정기 서버 점검을 다음과 같이 시행합니다.

- 일시: 2026년 2월 28일 02:00 ~ 06:00 (4시간)
- 영향: 서비스 일시 중단

이용에 불편을 끼쳐 죄송합니다.`,
    isPinned: false,
    scope: 'ALL',
    teamId: null,
    teamName: null,
    adminNickname: '관리자',
    createdAt: '2026-02-25T09:00:00',
    updatedAt: '2026-02-25T09:00:00',
  },
  6: {
    id: 6,
    title: '신고 처리 정책 강화 안내',
    content: `허위 신고/악성 신고에 대한 처리를 강화합니다.

- 명백한 허위 신고가 누적될 경우 신고 권한 일시 제한
- 신고 사유는 구체적으로 작성 부탁드립니다.

건전한 커뮤니티 운영에 협조 부탁드립니다.`,
    isPinned: false,
    scope: 'ALL',
    teamId: null,
    teamName: null,
    adminNickname: '관리자',
    createdAt: '2026-02-19T11:00:00',
    updatedAt: '2026-02-19T11:00:00',
  },
  7: {
    id: 7,
    title: '전북 현대 게시판 개설 안내',
    content: `전북 현대 모터스 팬분들의 요청에 따라 전용 게시판을 개설했습니다.
신규 게시판에서 활발한 활동 부탁드립니다.`,
    isPinned: false,
    scope: 'TEAM',
    teamId: 101,
    teamName: '전북 현대 모터스',
    adminNickname: '관리자',
    createdAt: '2026-02-18T15:00:00',
    updatedAt: '2026-02-18T15:00:00',
  },
  8: {
    id: 8,
    title: 'AI 게시글 분석 베타 오픈',
    content: `AI 어시스턴트가 작성하는 분석 글을 베타로 오픈합니다.

- 매주 수요일 / 토요일 정기 업로드
- 데이터 기반 통계 + 예측 모델 활용
- 피드백은 1:1 문의를 통해 받습니다`,
    isPinned: false,
    scope: 'ALL',
    teamId: null,
    teamName: null,
    adminNickname: '관리자',
    createdAt: '2026-02-17T10:00:00',
    updatedAt: '2026-02-17T10:00:00',
  },
  9: {
    id: 9,
    title: '모바일 앱 출시 일정 안내',
    content: `iOS / Android 모바일 앱을 곧 출시합니다.

- 1차 베타: 2026 Q2
- 정식 출시: 2026 Q3
- 알림 / 검색 / 댓글 등 핵심 기능 우선 지원`,
    isPinned: false,
    scope: 'ALL',
    teamId: null,
    teamName: null,
    adminNickname: '관리자',
    createdAt: '2026-02-15T09:00:00',
    updatedAt: '2026-02-15T09:00:00',
  },
  10: {
    id: 10,
    title: '응원팀 변경 정책 변경 사항',
    content: `응원팀은 한 번 등록 후 30일에 한 번까지만 변경 가능합니다.
이는 대량 변경 → 도배 / 어뷰징을 방지하기 위함입니다.`,
    isPinned: false,
    scope: 'ALL',
    teamId: null,
    teamName: null,
    adminNickname: '관리자',
    createdAt: '2026-02-14T13:00:00',
    updatedAt: '2026-02-14T13:00:00',
  },
  11: {
    id: 11,
    title: 'KIA 타이거즈 게시판 개설 안내',
    content: `KIA 타이거즈 팬분들의 요청에 따라 전용 게시판을 개설했습니다.`,
    isPinned: false,
    scope: 'TEAM',
    teamId: 203,
    teamName: 'KIA 타이거즈',
    adminNickname: '관리자',
    createdAt: '2026-02-13T14:00:00',
    updatedAt: '2026-02-13T14:00:00',
  },
  12: {
    id: 12,
    title: '회원가입/로그인 SSO 도입 안내',
    content: `Google / Kakao / Naver 계정으로 간편 로그인 / 회원가입이 가능합니다.
기존 이메일 회원가입도 그대로 사용 가능합니다.`,
    isPinned: false,
    scope: 'ALL',
    teamId: null,
    teamName: null,
    adminNickname: '관리자',
    createdAt: '2026-02-10T10:00:00',
    updatedAt: '2026-02-10T10:00:00',
  },
};

// ──────────────────────────────────────────────
// 유저 프로필 & 마이페이지
// ──────────────────────────────────────────────

export const userProfile: UserProfile = {
  id: 10,
  email: 'soccer_fan@example.com',
  emailVerified: false,
  nickname: '축구광팬',
  role: 'USER',
  provider: null,
  profileImageUrl: null,
  teams: [],
  onboardingCompletedAt: null,
  createdAt: '2026-01-15T08:30:00',
};

export const adminProfile: UserProfile = {
  id: 1,
  email: 'admin@lockerroom.kr',
  emailVerified: true,
  nickname: '관리자',
  role: 'ADMIN',
  provider: null,
  profileImageUrl: null,
  teams: [],
  onboardingCompletedAt: '2026-01-01T00:00:00',
  createdAt: '2026-01-01T00:00:00',
};

export const myPosts: MyPostItem[] = [
  {
    id: 1,
    boardId: 5,
    boardName: '전북 현대 게시판',
    title: '이번 시즌 전북 전력 분석',
    viewCount: 342,
    likeCount: 28,
    commentCount: 15,
    createdAt: '2026-02-26T14:30:00',
  },
  {
    id: 7,
    boardId: 1,
    boardName: '자유게시판',
    title: '오늘 직관 후기 (울산 vs 서울)',
    viewCount: 634,
    likeCount: 52,
    commentCount: 27,
    createdAt: '2026-02-23T22:10:00',
  },
  {
    id: 15,
    boardId: 1,
    boardName: '자유게시판',
    title: 'FC 서울 시즌권 같이 살 분?',
    viewCount: 267,
    likeCount: 8,
    commentCount: 42,
    createdAt: '2026-02-21T22:30:00',
  },
  {
    id: 25,
    boardId: 1,
    boardName: '자유게시판',
    title: '수원 삼성 새 감독 체제 전망',
    viewCount: 445,
    likeCount: 36,
    commentCount: 19,
    createdAt: '2026-02-19T16:30:00',
  },
  {
    id: 33,
    boardId: 5,
    boardName: '전북 현대 게시판',
    title: '전북 vs 울산 클래식 명경기 모음',
    viewCount: 1345,
    likeCount: 98,
    commentCount: 45,
    createdAt: '2026-02-17T22:00:00',
  },
  {
    id: 41,
    boardId: 1,
    boardName: '자유게시판',
    title: '전북 직관 응원가 정리',
    viewCount: 412,
    likeCount: 33,
    commentCount: 14,
    createdAt: '2026-02-15T20:00:00',
  },
  {
    id: 42,
    boardId: 5,
    boardName: '전북 현대 게시판',
    title: '전북 시즌권 구매 후기',
    viewCount: 156,
    likeCount: 11,
    commentCount: 5,
    createdAt: '2026-02-13T13:00:00',
  },
  {
    id: 43,
    boardId: 1,
    boardName: '자유게시판',
    title: '직관 카메라 추천 부탁드립니다',
    viewCount: 234,
    likeCount: 14,
    commentCount: 23,
    createdAt: '2026-02-11T17:30:00',
  },
  {
    id: 44,
    boardId: 1,
    boardName: '자유게시판',
    title: '경기 후 소감',
    viewCount: 87,
    likeCount: 5,
    commentCount: 4,
    createdAt: '2026-02-09T22:30:00',
  },
  {
    id: 45,
    boardId: 5,
    boardName: '전북 현대 게시판',
    title: '신예 윙어 영입 제안',
    viewCount: 312,
    likeCount: 18,
    commentCount: 17,
    createdAt: '2026-02-07T14:00:00',
  },
  {
    id: 46,
    boardId: 1,
    boardName: '자유게시판',
    title: '시즌 개막 카운트다운',
    viewCount: 198,
    likeCount: 22,
    commentCount: 9,
    createdAt: '2026-02-05T10:00:00',
  },
  {
    id: 47,
    boardId: 5,
    boardName: '전북 현대 게시판',
    title: '응원팀 첫 직관 후기',
    viewCount: 423,
    likeCount: 35,
    commentCount: 21,
    createdAt: '2026-02-03T19:00:00',
  },
];

export const myComments: MyCommentItem[] = [
  {
    id: 1010,
    postId: 2,
    postTitle: 'LG 트윈스 올해 로스터 어떻게 보시나요?',
    content: '올해 LG 진짜 기대됩니다. 투타 밸런스가 좋아졌어요.',
    createdAt: '2026-02-26T13:00:00',
  },
  {
    id: 1011,
    postId: 3,
    postTitle: '[AI 분석] K리그 1R 주요 경기 프리뷰',
    content: 'AI 분석 퀄리티가 점점 좋아지네요. 유용한 정보 감사합니다.',
    createdAt: '2026-02-25T19:00:00',
  },
  {
    id: 1012,
    postId: 5,
    postTitle: '배구 올스타전 하이라이트 모음',
    content: '배구 올스타전도 축구 못지않게 재미있더라고요!',
    createdAt: '2026-02-24T21:00:00',
  },
  {
    id: 1013,
    postId: 19,
    postTitle: '[AI 분석] 2026 K리그 우승 후보 TOP 3',
    content: '전북이 2위라는 게 약간 보수적이네요. 1위 기대해볼게요!',
    createdAt: '2026-02-21T09:45:00',
  },
  {
    id: 1014,
    postId: 29,
    postTitle: '[AI 분석] KBO 팀별 타선 파워랭킹',
    content: 'LG 2위 인정합니다. 시즌 흐름이 관건이겠죠.',
    createdAt: '2026-02-18T18:50:00',
  },
  {
    id: 1015,
    postId: 32,
    postTitle: '야구장 먹거리 맛집 TOP 5',
    content: '잠실 평양냉면 진짜 인정합니다.',
    createdAt: '2026-02-18T08:50:00',
  },
  {
    id: 1016,
    postId: 55,
    postTitle: '한화 이글스 류현진 복귀 효과',
    content: '확실히 1선발 한 명이 시즌 흐름을 바꿉니다.',
    createdAt: '2026-02-13T11:30:00',
  },
  {
    id: 1017,
    postId: 60,
    postTitle: '[AI 분석] KBO 타격왕 후보 분석',
    content: 'KIA A선수 1순위 동의합니다.',
    createdAt: '2026-02-12T11:50:00',
  },
  {
    id: 1018,
    postId: 71,
    postTitle: '직관 갈 때 들고 가는 필수품',
    content: '쿠션은 진짜 필수입니다 ㅠㅠ',
    createdAt: '2026-02-09T22:30:00',
  },
  {
    id: 1019,
    postId: 50,
    postTitle: '이번 주 KBO 주요 매치업 리뷰',
    content: '롯데 vs 두산 매치업 기대됩니다.',
    createdAt: '2026-02-14T13:30:00',
  },
  {
    id: 1020,
    postId: 7,
    postTitle: '오늘 직관 후기 (울산 vs 서울)',
    content: '울산 후반 살아난 게 진짜 결정적이었어요.',
    createdAt: '2026-02-23T23:00:00',
  },
  {
    id: 1021,
    postId: 12,
    postTitle: '직관 꿀팁 정리',
    content: '잠실 외야 응원 분위기 진짜 끝판왕이에요.',
    createdAt: '2026-02-22T17:30:00',
  },
];

export const myLikes: MyLikeItem[] = [
  {
    id: 2,
    boardId: 4,
    boardName: 'LG 트윈스 게시판',
    title: 'LG 트윈스 올해 로스터 어떻게 보시나요?',
    authorNickname: '야구좋아',
    viewCount: 521,
    likeCount: 45,
    commentCount: 32,
    createdAt: '2026-02-26T12:00:00',
  },
  {
    id: 3,
    boardId: 3,
    boardName: '뉴스',
    title: '[AI 분석] K리그 1R 주요 경기 프리뷰',
    authorNickname: 'AI 어시스턴트',
    viewCount: 1024,
    likeCount: 89,
    commentCount: 41,
    createdAt: '2026-02-25T18:00:00',
  },
  {
    id: 12,
    boardId: 1,
    boardName: '자유게시판',
    title: '직관 꿀팁 정리 (좌석, 먹거리, 교통)',
    authorNickname: '야구초보',
    viewCount: 1523,
    likeCount: 124,
    commentCount: 56,
    createdAt: '2026-02-22T16:00:00',
  },
  {
    id: 19,
    boardId: 3,
    boardName: '뉴스',
    title: '[AI 분석] 2026 K리그 우승 후보 TOP 3',
    authorNickname: 'AI 어시스턴트',
    viewCount: 2134,
    likeCount: 156,
    commentCount: 87,
    createdAt: '2026-02-21T09:00:00',
  },
  {
    id: 29,
    boardId: 3,
    boardName: '뉴스',
    title: '[AI 분석] KBO 팀별 타선 파워랭킹',
    authorNickname: 'AI 어시스턴트',
    viewCount: 1876,
    likeCount: 132,
    commentCount: 64,
    createdAt: '2026-02-18T18:00:00',
  },
  {
    id: 32,
    boardId: 1,
    boardName: '자유게시판',
    title: '야구장 먹거리 맛집 TOP 5',
    authorNickname: '야구초보',
    viewCount: 2456,
    likeCount: 189,
    commentCount: 72,
    createdAt: '2026-02-18T08:00:00',
  },
  {
    id: 55,
    boardId: 6,
    boardName: 'KIA 타이거즈 게시판',
    title: '한화 이글스 류현진 복귀 효과 어떻게 보시나요',
    authorNickname: '야구좋아',
    viewCount: 1567,
    likeCount: 132,
    commentCount: 78,
    createdAt: '2026-02-13T10:00:00',
  },
  {
    id: 60,
    boardId: 3,
    boardName: '뉴스',
    title: '[AI 분석] KBO 타격왕 후보 TOP 5',
    authorNickname: 'AI 어시스턴트',
    viewCount: 1789,
    likeCount: 145,
    commentCount: 63,
    createdAt: '2026-02-12T11:00:00',
  },
  {
    id: 71,
    boardId: 1,
    boardName: '자유게시판',
    title: '직관 갈 때 들고 가는 필수품 정리',
    authorNickname: '야구초보',
    viewCount: 1456,
    likeCount: 112,
    commentCount: 48,
    createdAt: '2026-02-09T22:00:00',
  },
  {
    id: 80,
    boardId: 3,
    boardName: '뉴스',
    title: '[AI 분석] 신인 선수 영향력 종합 평가',
    authorNickname: 'AI 어시스턴트',
    viewCount: 1234,
    likeCount: 92,
    commentCount: 41,
    createdAt: '2026-02-08T08:00:00',
  },
];

// ──────────────────────────────────────────────
// 알림 (15개, 5개 타입 다 등장, 미읽음/읽음 다양)
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
    createdAt: '2026-02-26T15:00:00',
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
    targetId: 102,
    message: '축구전문가님이 회원님의 댓글에 답글을 남겼습니다.',
    isRead: false,
    readAt: null,
    createdAt: '2026-02-26T18:00:00',
  },
  {
    id: 4,
    type: 'COMMENT',
    targetType: 'POST',
    targetId: 7,
    message: '응원단장님이 회원님의 게시글에 댓글을 남겼습니다.',
    isRead: false,
    readAt: null,
    createdAt: '2026-02-23T22:50:00',
  },
  {
    id: 5,
    type: 'INQUIRY_REPLY',
    targetType: 'INQUIRY',
    targetId: 1,
    message: '문의에 답변이 등록되었습니다: 게시글 작성 시 이미지 업로드',
    isRead: false,
    readAt: null,
    createdAt: '2026-02-21T10:00:00',
  },
  {
    id: 6,
    type: 'REPORT_PROCESSED',
    targetType: 'POST',
    targetId: 20,
    message: '신고하신 게시글이 검토되어 처리되었습니다.',
    isRead: true,
    readAt: '2026-02-20T11:00:00',
    createdAt: '2026-02-20T10:00:00',
  },
  {
    id: 7,
    type: 'REPLY',
    targetType: 'COMMENT',
    targetId: 152,
    message: '야구초보님이 회원님의 댓글에 답글을 남겼습니다.',
    isRead: true,
    readAt: '2026-02-22T18:00:00',
    createdAt: '2026-02-22T17:25:00',
  },
  {
    id: 8,
    type: 'COMMENT',
    targetType: 'POST',
    targetId: 33,
    message: '클래식팬님이 회원님의 게시글에 댓글을 남겼습니다.',
    isRead: true,
    readAt: '2026-02-17T22:30:00',
    createdAt: '2026-02-17T22:20:00',
  },
  {
    id: 9,
    type: 'NOTICE',
    targetType: 'NOTICE',
    targetId: 7,
    message: '새로운 공지사항이 등록되었습니다: 전북 현대 게시판 개설',
    isRead: true,
    readAt: '2026-02-18T16:00:00',
    createdAt: '2026-02-18T15:00:00',
  },
  {
    id: 10,
    type: 'COMMENT',
    targetType: 'POST',
    targetId: 15,
    message: '직관러님이 회원님의 게시글에 댓글을 남겼습니다.',
    isRead: true,
    readAt: '2026-02-22T08:00:00',
    createdAt: '2026-02-21T23:00:00',
  },
  {
    id: 11,
    type: 'INQUIRY_REPLY',
    targetType: 'INQUIRY',
    targetId: 3,
    message: '문의에 답변이 등록되었습니다: 닉네임 변경 관련',
    isRead: true,
    readAt: '2026-02-19T08:00:00',
    createdAt: '2026-02-19T07:30:00',
  },
  {
    id: 12,
    type: 'NOTICE',
    targetType: 'NOTICE',
    targetId: 8,
    message: '새로운 공지사항이 등록되었습니다: AI 게시글 분석 베타 오픈',
    isRead: true,
    readAt: '2026-02-17T11:00:00',
    createdAt: '2026-02-17T10:00:00',
  },
  {
    id: 13,
    type: 'REPORT_PROCESSED',
    targetType: 'POST',
    targetId: 21,
    message: '신고하신 게시글이 검토되어 처리되었습니다.',
    isRead: true,
    readAt: '2026-02-16T14:00:00',
    createdAt: '2026-02-16T13:00:00',
  },
  {
    id: 14,
    type: 'COMMENT',
    targetType: 'POST',
    targetId: 25,
    message: '벤치워머님이 회원님의 게시글에 댓글을 남겼습니다.',
    isRead: true,
    readAt: '2026-02-19T17:00:00',
    createdAt: '2026-02-19T16:50:00',
  },
  {
    id: 15,
    type: 'NOTICE',
    targetType: 'NOTICE',
    targetId: 9,
    message: '새로운 공지사항이 등록되었습니다: 모바일 앱 출시 일정',
    isRead: true,
    readAt: '2026-02-15T10:00:00',
    createdAt: '2026-02-15T09:00:00',
  },
];

// ──────────────────────────────────────────────
// 문의 (id별 매핑, 8개 + 상세)
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
  {
    id: 4,
    type: 'BUG',
    title: '알림이 가끔 누락되는 것 같습니다',
    status: 'PENDING',
    createdAt: '2026-02-25T11:00:00',
  },
  {
    id: 5,
    type: 'SUGGESTION',
    title: '응원팀 다중 선택 시 주 응원팀 표시 기능',
    status: 'PENDING',
    createdAt: '2026-02-24T16:00:00',
  },
  {
    id: 6,
    type: 'GENERAL',
    title: '비밀번호 재설정 메일 안 옵니다',
    status: 'ANSWERED',
    createdAt: '2026-02-19T20:00:00',
  },
  {
    id: 7,
    type: 'BUG',
    title: 'iOS Safari에서 무한 스크롤 끊김',
    status: 'ANSWERED',
    createdAt: '2026-02-15T14:00:00',
  },
  {
    id: 8,
    type: 'SUGGESTION',
    title: '게시글 임시저장 기능 요청',
    status: 'PENDING',
    createdAt: '2026-02-22T10:00:00',
  },
];

export const inquiryDetailsById: Record<number, InquiryDetail> = {
  1: {
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
  },
  2: {
    id: 2,
    type: 'SUGGESTION',
    title: '다크모드 지원 요청',
    content:
      '밤에 라커룸 자주 보는데 화면이 너무 밝습니다. 다크 모드 토글이 있으면 정말 좋겠습니다.',
    status: 'PENDING',
    files: [],
    replies: [],
    createdAt: '2026-02-23T08:30:00',
  },
  3: {
    id: 3,
    type: 'GENERAL',
    title: '닉네임 변경 관련 문의',
    content: '닉네임을 변경하고 싶은데 어디서 가능한가요?',
    status: 'ANSWERED',
    files: [],
    replies: [
      {
        id: 2,
        adminNickname: '관리자',
        content:
          '마이페이지 > 내 정보 수정에서 닉네임 변경이 가능합니다. 단, 30일에 한 번만 변경 가능한 점 참고 부탁드립니다.',
        createdAt: '2026-02-19T07:30:00',
      },
    ],
    createdAt: '2026-02-18T15:00:00',
  },
  4: {
    id: 4,
    type: 'BUG',
    title: '알림이 가끔 누락되는 것 같습니다',
    content:
      '댓글 알림이 와야 하는데 안 오는 경우가 가끔 있습니다. 헤더 알림 아이콘에는 표시되는데 알림 목록에서는 안 보일 때도 있어요.',
    status: 'PENDING',
    files: [],
    replies: [],
    createdAt: '2026-02-25T11:00:00',
  },
  5: {
    id: 5,
    type: 'SUGGESTION',
    title: '응원팀 다중 선택 시 주 응원팀 표시 기능',
    content:
      '여러 종목 응원하다 보니 주 응원팀을 별도로 표시할 수 있는 기능이 있으면 좋겠습니다. 프로필에 대표로 표시할 수 있게요.',
    status: 'PENDING',
    files: [],
    replies: [],
    createdAt: '2026-02-24T16:00:00',
  },
  6: {
    id: 6,
    type: 'GENERAL',
    title: '비밀번호 재설정 메일 안 옵니다',
    content: '비밀번호 찾기 요청했는데 메일이 안 옵니다. 5분 정도 기다렸는데도 안 와요.',
    status: 'ANSWERED',
    files: [],
    replies: [
      {
        id: 3,
        adminNickname: '관리자',
        content:
          '스팸 메일함을 확인해 주시고, 그래도 못 받으셨다면 가입 시 사용한 이메일 주소를 다시 확인해 주세요. 추가 문의는 별도로 부탁드립니다.',
        createdAt: '2026-02-19T20:30:00',
      },
    ],
    createdAt: '2026-02-19T20:00:00',
  },
  7: {
    id: 7,
    type: 'BUG',
    title: 'iOS Safari에서 무한 스크롤 끊김',
    content:
      'iPhone 14 Pro / iOS 17.4 / Safari에서 게시글 목록 무한 스크롤 시 가끔 멈춤 현상이 있습니다.',
    status: 'ANSWERED',
    files: [],
    replies: [
      {
        id: 4,
        adminNickname: '관리자',
        content:
          'iOS Safari에서 IntersectionObserver 동작 이슈가 확인되어 수정 배포했습니다. 다시 한 번 시도해주시고 동일 증상 시 추가 제보 부탁드립니다.',
        createdAt: '2026-02-16T11:00:00',
      },
    ],
    createdAt: '2026-02-15T14:00:00',
  },
  8: {
    id: 8,
    type: 'SUGGESTION',
    title: '게시글 임시저장 기능 요청',
    content:
      '긴 글을 작성하다가 새로고침되거나 페이지 이동되면 본문이 사라져 너무 안타깝습니다. 자동 임시저장 기능이 있으면 좋겠습니다.',
    status: 'PENDING',
    files: [],
    replies: [],
    createdAt: '2026-02-22T10:00:00',
  },
};

// ──────────────────────────────────────────────
// 요청 (id별 매핑, 6개 + 상세)
// ──────────────────────────────────────────────

export const requestListItems: RequestListItem[] = [
  {
    id: 1,
    type: 'TEAM',
    name: '인천 유나이티드 FC',
    status: 'APPROVED',
    createdAt: '2026-02-15T10:00:00',
  },
  { id: 2, type: 'SPORT', name: '핸드볼', status: 'PENDING', createdAt: '2026-02-22T14:00:00' },
  {
    id: 3,
    type: 'TEAM',
    name: '한화 이글스',
    status: 'REJECTED',
    createdAt: '2026-02-10T09:00:00',
  },
  {
    id: 4,
    type: 'TEAM',
    name: '안양 정관장',
    status: 'APPROVED',
    createdAt: '2026-02-12T13:00:00',
  },
  { id: 5, type: 'SPORT', name: 'e스포츠', status: 'REJECTED', createdAt: '2026-02-08T15:00:00' },
  { id: 6, type: 'TEAM', name: '강원 FC', status: 'APPROVED', createdAt: '2026-02-06T11:00:00' },
];

export const requestDetailsById: Record<number, RequestDetail> = {
  1: {
    id: 1,
    type: 'TEAM',
    name: '인천 유나이티드 FC',
    reason:
      '인천 유나이티드 팬들을 위한 전용 게시판이 필요합니다. 도민구단/시민구단 팬덤이 강해서 활성화 가능성이 높습니다.',
    status: 'APPROVED',
    rejectReason: null,
    processedAt: '2026-02-16T14:00:00',
    createdAt: '2026-02-15T10:00:00',
  },
  2: {
    id: 2,
    type: 'SPORT',
    name: '핸드볼',
    reason:
      '국내 핸드볼 리그가 활성화되고 있어 커뮤니티 게시판이 있으면 좋겠습니다. 핸드볼 팬들이 모여서 경기 이야기를 나눌 수 있는 공간이 필요합니다.',
    status: 'PENDING',
    rejectReason: null,
    processedAt: null,
    createdAt: '2026-02-22T14:00:00',
  },
  3: {
    id: 3,
    type: 'TEAM',
    name: '한화 이글스',
    reason: '한화 이글스 전용 게시판 개설을 요청합니다.',
    status: 'REJECTED',
    rejectReason:
      '이미 야구 종목 자유게시판에서 충분히 활성화되어 있어 별도 개설은 보류합니다. 시즌 후 재검토 예정입니다.',
    processedAt: '2026-02-11T15:00:00',
    createdAt: '2026-02-10T09:00:00',
  },
  4: {
    id: 4,
    type: 'TEAM',
    name: '안양 정관장',
    reason:
      '안양 정관장 팬덤이 빠르게 커지고 있습니다. 전용 게시판이 있으면 응원 시너지가 강해질 것 같습니다.',
    status: 'APPROVED',
    rejectReason: null,
    processedAt: '2026-02-13T10:00:00',
    createdAt: '2026-02-12T13:00:00',
  },
  5: {
    id: 5,
    type: 'SPORT',
    name: 'e스포츠',
    reason: 'LCK / LCS 등 e스포츠 팬을 위한 전용 카테고리가 있으면 좋겠습니다.',
    status: 'REJECTED',
    rejectReason:
      '서비스 정체성(전통 스포츠 커뮤니티)과 맞지 않아 우선순위에서 제외됩니다. 별도 조사 후 추후 검토 예정입니다.',
    processedAt: '2026-02-09T18:00:00',
    createdAt: '2026-02-08T15:00:00',
  },
  6: {
    id: 6,
    type: 'TEAM',
    name: '강원 FC',
    reason: '도민구단 응원 분위기가 활성화되고 있어 강원 FC 전용 게시판이 필요합니다.',
    status: 'APPROVED',
    rejectReason: null,
    processedAt: '2026-02-07T13:00:00',
    createdAt: '2026-02-06T11:00:00',
  },
};

// ──────────────────────────────────────────────
// 관리자 (대시보드/회원 25명/신고 12건/문의/요청)
// ──────────────────────────────────────────────

export const adminDashboard: AdminDashboardSummary = {
  pendingReportCount: 6,
  pendingInquiryCount: 4,
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
  {
    id: 16,
    email: 'sports_diary@example.com',
    nickname: '스포츠일기',
    role: 'USER',
    provider: null,
    isSuspended: false,
    createdAt: '2026-02-03T11:00:00',
  },
  {
    id: 17,
    email: 'live_fan@example.com',
    nickname: '직관러',
    role: 'USER',
    provider: 'GOOGLE',
    isSuspended: false,
    createdAt: '2026-02-04T14:00:00',
  },
  {
    id: 18,
    email: 'cheerleader@example.com',
    nickname: '응원단장',
    role: 'USER',
    provider: 'KAKAO',
    isSuspended: false,
    createdAt: '2026-02-05T16:00:00',
  },
  {
    id: 19,
    email: 'owner_dream@example.com',
    nickname: '구단주꿈나무',
    role: 'USER',
    provider: null,
    isSuspended: false,
    createdAt: '2026-02-06T09:00:00',
  },
  {
    id: 20,
    email: 'bench_warmer@example.com',
    nickname: '벤치워머',
    role: 'USER',
    provider: 'NAVER',
    isSuspended: true,
    createdAt: '2026-02-07T10:00:00',
  },
  {
    id: 21,
    email: 'data_analytics@example.com',
    nickname: '데이터분석',
    role: 'USER',
    provider: 'GOOGLE',
    isSuspended: false,
    createdAt: '2026-02-08T13:00:00',
  },
  {
    id: 22,
    email: 'classic_fan@example.com',
    nickname: '클래식팬',
    role: 'USER',
    provider: null,
    isSuspended: false,
    createdAt: '2026-02-09T15:00:00',
  },
  {
    id: 23,
    email: 'rookie_fan@example.com',
    nickname: '신입팬',
    role: 'USER',
    provider: 'KAKAO',
    isSuspended: false,
    createdAt: '2026-02-10T08:00:00',
  },
  {
    id: 24,
    email: 'spam_account_1@example.com',
    nickname: '스팸계정1',
    role: 'USER',
    provider: null,
    isSuspended: true,
    createdAt: '2026-02-11T20:00:00',
  },
  {
    id: 25,
    email: 'troll_account@example.com',
    nickname: '도배유저',
    role: 'USER',
    provider: null,
    isSuspended: true,
    createdAt: '2026-02-12T22:00:00',
  },
  {
    id: 26,
    email: 'kbo_fan@example.com',
    nickname: 'KBO마니아',
    role: 'USER',
    provider: 'NAVER',
    isSuspended: false,
    createdAt: '2026-02-13T11:00:00',
  },
  {
    id: 27,
    email: 'kleague_fan@example.com',
    nickname: 'K리그러버',
    role: 'USER',
    provider: 'GOOGLE',
    isSuspended: false,
    createdAt: '2026-02-14T14:00:00',
  },
  {
    id: 28,
    email: 'kbl_watcher@example.com',
    nickname: 'KBL왓처',
    role: 'USER',
    provider: 'KAKAO',
    isSuspended: false,
    createdAt: '2026-02-15T09:00:00',
  },
  {
    id: 29,
    email: 'vleague_pro@example.com',
    nickname: 'V리그프로',
    role: 'USER',
    provider: null,
    isSuspended: false,
    createdAt: '2026-02-16T16:00:00',
  },
  {
    id: 30,
    email: 'foreign_player@example.com',
    nickname: '외인러',
    role: 'USER',
    provider: 'GOOGLE',
    isSuspended: false,
    createdAt: '2026-02-17T13:00:00',
  },
  {
    id: 31,
    email: 'season_ticket@example.com',
    nickname: '시즌권홀더',
    role: 'USER',
    provider: null,
    isSuspended: false,
    createdAt: '2026-02-18T10:00:00',
  },
  {
    id: 32,
    email: 'rookie_drafter@example.com',
    nickname: '드래프트관찰자',
    role: 'USER',
    provider: 'NAVER',
    isSuspended: false,
    createdAt: '2026-02-19T08:00:00',
  },
  {
    id: 33,
    email: 'goods_collector@example.com',
    nickname: '굿즈콜렉터',
    role: 'USER',
    provider: 'KAKAO',
    isSuspended: false,
    createdAt: '2026-02-20T17:00:00',
  },
  {
    id: 1,
    email: 'admin@lockerroom.kr',
    nickname: '관리자',
    role: 'ADMIN',
    provider: null,
    isSuspended: false,
    createdAt: '2026-01-01T00:00:00',
  },
];

export const adminReports: AdminReport[] = [
  {
    id: 1,
    postId: 20,
    postTitle: '두산 베어스 캠프 직관 다녀왔습니다',
    reporterNickname: '축구광팬',
    reason: '도배성 게시글입니다.',
    status: 'PENDING',
    createdAt: '2026-02-26T10:00:00',
  },
  {
    id: 2,
    postId: 21,
    postTitle: '포항 스틸러스 유스 출신 선수들 근황',
    reporterNickname: '야구좋아',
    reason: '심한 욕설과 비방이 포함되어 있습니다.',
    status: 'PENDING',
    createdAt: '2026-02-26T11:00:00',
  },
  {
    id: 3,
    postId: 22,
    postTitle: '대한항공 점보스 응원가 모음',
    reporterNickname: '배구매니아',
    reason: '스팸/광고 게시글입니다.',
    status: 'PENDING',
    createdAt: '2026-02-26T14:00:00',
  },
  {
    id: 4,
    postId: 15,
    postTitle: 'FC 서울 시즌권 같이 살 분?',
    reporterNickname: '슬램덩크',
    reason: '불건전한 내용이 포함되어 있습니다.',
    status: 'APPROVED',
    createdAt: '2026-02-22T09:00:00',
  },
  {
    id: 5,
    postId: 35,
    postTitle: '이번 주말 직관 가실 분 모집',
    reporterNickname: '직관러',
    reason: '개인정보 노출 우려가 있습니다.',
    status: 'PENDING',
    createdAt: '2026-02-25T17:00:00',
  },
  {
    id: 6,
    postId: 41,
    postTitle: 'KBO 외인 투수 영입 트렌드 분석',
    reporterNickname: '응원단장',
    reason: '근거 없는 추측 + 비방.',
    status: 'PENDING',
    createdAt: '2026-02-25T15:00:00',
  },
  {
    id: 7,
    postId: 17,
    postTitle: 'SSG 랜더스 올해 불펜 전력 어떻게 보시나요',
    reporterNickname: '클래식팬',
    reason: '댓글에 욕설/비방 다수.',
    status: 'PENDING',
    createdAt: '2026-02-24T18:00:00',
  },
  {
    id: 8,
    postId: 50,
    postTitle: '이번 주 KBO 주요 매치업 리뷰',
    reporterNickname: '데이터분석',
    reason: '잘못된 정보 + 어뷰징.',
    status: 'REJECTED',
    createdAt: '2026-02-21T16:00:00',
  },
  {
    id: 9,
    postId: 42,
    postTitle: '안양 정관장 새 시즌 컨텐더 가능성',
    reporterNickname: '야구초보',
    reason: '타 팀 비방.',
    status: 'APPROVED',
    createdAt: '2026-02-20T11:00:00',
  },
  {
    id: 10,
    postId: 33,
    postTitle: '전북 vs 울산 클래식 명경기 모음',
    reporterNickname: '신입팬',
    reason: '저작권 의심 영상 링크.',
    status: 'PENDING',
    createdAt: '2026-02-19T14:00:00',
  },
  {
    id: 11,
    postId: 76,
    postTitle: '구단 굿즈 어디서 구매하나요?',
    reporterNickname: '굿즈콜렉터',
    reason: '광고 스팸.',
    status: 'REJECTED',
    createdAt: '2026-02-18T22:00:00',
  },
  {
    id: 12,
    postId: 23,
    postTitle: '스포츠 직관 카메라 추천해주세요',
    reporterNickname: '벤치워머',
    reason: '부적절한 외부 링크.',
    status: 'APPROVED',
    createdAt: '2026-02-18T09:00:00',
  },
];

export const adminNotices: AdminNotice[] = noticeListItems.map((n) => ({
  id: n.id,
  title: n.title,
  isPinned: n.isPinned,
  scope: n.scope,
  teamName: n.teamName,
  createdAt: n.createdAt,
}));

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
  {
    id: 4,
    type: 'BUG',
    title: '알림이 가끔 누락되는 것 같습니다',
    userNickname: '데이터분석',
    status: 'PENDING',
    createdAt: '2026-02-25T11:00:00',
  },
  {
    id: 5,
    type: 'SUGGESTION',
    title: '응원팀 다중 선택 시 주 응원팀 표시',
    userNickname: '구단주꿈나무',
    status: 'PENDING',
    createdAt: '2026-02-24T16:00:00',
  },
  {
    id: 6,
    type: 'GENERAL',
    title: '비밀번호 재설정 메일 안 옵니다',
    userNickname: '벤치워머',
    status: 'ANSWERED',
    createdAt: '2026-02-19T20:00:00',
  },
  {
    id: 7,
    type: 'BUG',
    title: 'iOS Safari에서 무한 스크롤 끊김',
    userNickname: '직관러',
    status: 'ANSWERED',
    createdAt: '2026-02-15T14:00:00',
  },
  {
    id: 8,
    type: 'SUGGESTION',
    title: '게시글 임시저장 기능 요청',
    userNickname: '응원단장',
    status: 'PENDING',
    createdAt: '2026-02-22T10:00:00',
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
  {
    id: 4,
    userNickname: '슬램덩크',
    type: 'TEAM',
    name: '안양 정관장',
    reason: '팬덤이 빠르게 커지고 있어 전용 게시판이 필요합니다.',
    status: 'APPROVED',
    createdAt: '2026-02-12T13:00:00',
  },
  {
    id: 5,
    userNickname: '신입팬',
    type: 'SPORT',
    name: 'e스포츠',
    reason: 'LCK / LCS 팬을 위한 카테고리 요청.',
    status: 'REJECTED',
    createdAt: '2026-02-08T15:00:00',
  },
  {
    id: 6,
    userNickname: '클래식팬',
    type: 'TEAM',
    name: '강원 FC',
    reason: '도민구단 응원 분위기 활성화로 인한 요청.',
    status: 'APPROVED',
    createdAt: '2026-02-06T11:00:00',
  },
];
