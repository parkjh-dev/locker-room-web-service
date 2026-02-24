# Locker Room Web - 라우팅 명세

> 소스: `src/app/router.tsx`
> 모든 페이지는 `React.lazy`로 코드 스플리팅됨

---

## 라우트 가드

| 가드 | 파일 | 동작 |
|------|------|------|
| ProtectedRoute | `guards/ProtectedRoute.tsx` | 비인증 → `/auth/login?returnUrl={현재경로}` 리다이렉트 |
| AdminRoute | `guards/AdminRoute.tsx` | 비인증 → `/auth/login`, role ≠ ADMIN → `/403` |
| ProfileGuard | `guards/ProfileGuard.tsx` | GET /users/me 404 → `/auth/profile/complete` 리다이렉트 |

---

## 1. Public Routes

> 레이아웃: `PublicLayout` (Header + Content + Footer)
> 인증: 불필요

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | HomePage | 메인/홈 |
| `/auth/login` | LoginPage | 로그인 |
| `/auth/signup` | SignupPage | 회원가입 |
| `/auth/password/find` | PasswordFindPage | 비밀번호 찾기 (Keycloak 리다이렉트) |
| `/auth/oauth/callback` | OAuthCallbackPage | OAuth 콜백 (토큰 수령 → 분기) |
| `/boards/:boardId` | BoardPostListPage | 게시판별 게시글 목록 |
| `/posts/:postId` | PostDetailPage | 게시글 상세 |
| `/notices` | NoticeListPage | 공지사항 목록 |
| `/notices/:noticeId` | NoticeDetailPage | 공지사항 상세 |

---

## 2. Protected Routes

> 레이아웃: `SidebarLayout` (Header + Sidebar + Content + Footer)
> 가드: `ProtectedRoute` → `ProfileGuard`
> 인증: 필수 + 프로필 보완 완료 필수

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/boards` | BoardListPage | 전체 게시판 목록 |
| `/posts/new` | PostCreatePage | 게시글 작성 |
| `/posts/:postId/edit` | PostEditPage | 게시글 수정 |
| `/mypage` | MyProfilePage | 마이페이지 (프로필 정보) |
| `/mypage/edit` | EditProfilePage | 내 정보 수정 |
| `/mypage/posts` | MyPostsPage | 내가 쓴 글 |
| `/mypage/comments` | MyCommentsPage | 내가 쓴 댓글 |
| `/mypage/likes` | MyLikesPage | 좋아요한 글 |
| `/mypage/withdraw` | WithdrawPage | 회원 탈퇴 |
| `/notifications` | NotificationListPage | 알림 목록 |
| `/inquiries` | InquiryListPage | 내 문의 목록 |
| `/inquiries/new` | InquiryCreatePage | 문의 작성 |
| `/inquiries/:inquiryId` | InquiryDetailPage | 문의 상세 |
| `/requests` | RequestListPage | 내 요청 목록 |
| `/requests/new` | RequestCreatePage | 요청 작성 |
| `/requests/:requestId` | RequestDetailPage | 요청 상세 |

---

## 3. Auth 보완 Route

> 레이아웃: `PublicLayout`
> 가드: `ProtectedRoute`
> 인증: 필수 (프로필 미완성 유저 전용)

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/auth/profile/complete` | ProfileCompletePage | SSO 신규 회원 프로필 보완 (닉네임 + 팀 선택) |

---

## 4. Admin Routes

> 레이아웃: `AdminLayout` (Admin Header + Admin Sidebar + Content)
> 가드: `AdminRoute`
> 인증: 필수 + role=ADMIN 필수

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/admin` | AdminDashboardPage | 관리자 대시보드 |
| `/admin/users` | AdminUsersPage | 회원 관리 |
| `/admin/reports` | AdminReportsPage | 신고 관리 |
| `/admin/notices` | AdminNoticesPage | 공지 관리 |
| `/admin/inquiries` | AdminInquiriesPage | 문의 관리 |
| `/admin/requests` | AdminRequestsPage | 요청 관리 |

---

## 5. Error Pages

> 레이아웃: 없음 (전체 화면)
> 인증: 불필요

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/suspended` | SuspendedPage | 계정 정지 안내 |
| `/403` | ForbiddenPage | 접근 권한 없음 |
| `*` | NotFoundPage | 404 페이지 |

---

## 개정 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2026-02-24 | 초안 작성 (Phase 5 라우터 기준, 전체 35개 라우트) |
