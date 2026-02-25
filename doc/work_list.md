# Locker Room Web - 작업 목록

> 참고: `web/srs.md`, `web/sds.md`, `web/decide.md`
> 각 작업은 AI에게 지시 → 확인 → 다음 작업 순서로 진행한다.
> 체크박스를 완료 시 `[x]`로 표시한다.

---

## Phase 1. 프로젝트 초기 설정

- [x] 1-1. Vite + React 19 + TypeScript 프로젝트 생성 (yarn create vite)
- [x] 1-2. 핵심 의존성 설치 (react-router-dom, axios, zustand, @tanstack/react-query, react-hook-form, zod, @hookform/resolvers, keycloak-js, sonner)
- [x] 1-3. 경로 별칭 설정 (`@/` → `src/`, tsconfig.json paths + vite.config.ts alias)
- [x] 1-4. 환경변수 설정 (.env.local 파일 + vite-env.d.ts 타입 선언)
- [x] 1-5. ESLint + Prettier 설정
- [x] 1-6. Tailwind CSS 설치 및 설정 (tailwind.config.ts 커스텀 컬러/폰트)
- [x] 1-7. shadcn/ui 초기화 및 기본 컴포넌트 설치 (Button, Input, Dialog, Select, Form, Label, DropdownMenu, Sheet, Skeleton, Badge, Textarea, Tabs, Table, Separator, Tooltip)
- [x] 1-8. Pretendard 웹폰트 적용
- [x] 1-9. globals.css 작성 (CSS 변수, Tailwind 지시어)
- [x] 1-10. SDS 기준 디렉토리 구조 스캐폴딩 생성 (빈 폴더/index.ts 뼈대)

---

## Phase 2. 핵심 인프라 모듈

- [x] 2-1. 공통 타입 정의 (`types/api.ts` - ApiResponse, CursorPageResponse, FieldError, CursorPageParams, SearchParams)
- [x] 2-2. 공통 타입 정의 (`types/common.ts` - 공통 유틸리티 타입)
- [x] 2-3. Axios 인스턴스 생성 (`lib/axios.ts` - baseURL, timeout, Content-Type)
- [x] 2-4. Axios Request 인터셉터 (Authorization 헤더 자동 첨부, POST 멱등성 키 자동 생성)
- [x] 2-5. Axios Response 인터셉터 (401 토큰 갱신 재시도, 403 USER_SUSPENDED 처리, 429/500 Toast, 에러 코드 메시지 매핑)
- [x] 2-6. TanStack Query 설정 (`lib/queryClient.ts` - staleTime, gcTime, retry)
- [x] 2-7. Keycloak 초기화 설정 (`lib/keycloak.ts`)
- [x] 2-8. Auth Store (`features/auth/stores/authStore.ts` - Zustand, 토큰/유저/인증상태 관리)
- [x] 2-9. UI Store (`stores/uiStore.ts` - 사이드바 토글 등 UI 상태)
- [x] 2-10. KeycloakProvider (`app/providers/KeycloakProvider.tsx` - 초기화, silent check-sso, 토큰 만료 콜백)
- [x] 2-11. QueryProvider (`app/providers/QueryProvider.tsx`)
- [x] 2-12. AppProvider (`app/providers/AppProvider.tsx` - 모든 프로바이더 조합)
- [x] 2-13. Sonner Toaster 전역 설정

---

## Phase 3. 공통 컴포넌트

- [x] 3-1. ErrorBoundary (`components/common/ErrorBoundary.tsx` - 글로벌 + fallback UI)
- [x] 3-2. SkeletonLoader (`components/common/SkeletonLoader.tsx` - 게시글/카드/목록 스켈레톤)
- [x] 3-3. EmptyState (`components/common/EmptyState.tsx` - 아이콘 + 메시지 + 액션 버튼)
- [x] 3-4. ConfirmDialog (`components/common/ConfirmDialog.tsx` - 삭제/탈퇴 등 파괴적 액션 확인)
- [x] 3-5. FullScreenLoader (Keycloak 초기화/라우트 전환 시 전체화면 로딩)
- [x] 3-6. useInfiniteScroll 훅 (`hooks/useInfiniteScroll.ts` - IntersectionObserver 기반)
- [x] 3-7. useDebounce 훅 (`hooks/useDebounce.ts` - 검색 입력 디바운스)
- [x] 3-8. useMediaQuery 훅 (`hooks/useMediaQuery.ts` - 반응형 분기)

---

## Phase 4. 레이아웃

- [x] 4-1. Header 컴포넌트 (`components/layout/Header.tsx` - 로고, 비로그인: 로그인/회원가입 버튼, 로그인: 알림아이콘+프로필 드롭다운)
- [x] 4-2. Sidebar 컴포넌트 (`components/layout/Sidebar.tsx` - 게시판 목록, 마이페이지/고객센터/요청 링크, 모바일 Sheet 토글)
- [x] 4-3. Footer 컴포넌트 (`components/layout/Footer.tsx`)
- [x] 4-4. PublicLayout (`components/layout/PublicLayout.tsx` - Header + Outlet)
- [x] 4-5. SidebarLayout (`components/layout/SidebarLayout.tsx` - Header + Sidebar + Outlet, 반응형)
- [x] 4-6. AdminLayout (`components/layout/AdminLayout.tsx` - Admin Header + Admin Sidebar + Outlet)

---

## Phase 5. 라우트 가드 & 라우터

- [x] 5-1. ProtectedRoute (`guards/ProtectedRoute.tsx` - 비로그인 → /auth/login?returnUrl 리다이렉트)
- [x] 5-2. AdminRoute (`guards/AdminRoute.tsx` - role ≠ ADMIN → /403)
- [x] 5-3. ProfileGuard (`guards/ProfileGuard.tsx` - GET /users/me 404 → /auth/profile/complete)
- [x] 5-4. 에러 페이지 (NotFoundPage, ForbiddenPage, SuspendedPage)
- [x] 5-5. 라우터 설정 (`app/router.tsx` - 전체 라우트 등록, lazy loading, 레이아웃 배치)
- [x] 5-6. App.tsx + main.tsx 진입점 조합 (RouterProvider + AppProvider + ErrorBoundary)

---

## Phase 6. 인증 (Auth) 기능

- [x] 6-1. Auth 타입 정의 (`features/auth/types/auth.ts`)
- [x] 6-2. Auth API 함수 (`features/auth/api/authApi.ts` - signup, profileComplete)
- [x] 6-3. useAuth 훅 (`features/auth/hooks/useAuth.ts` - login, logout, SSO login)
- [x] 6-4. 회원가입 Zod 스키마 (`features/auth/schemas/signupSchema.ts`)
- [x] 6-5. 프로필 보완 Zod 스키마 (`features/auth/schemas/profileCompleteSchema.ts`)
- [x] 6-6. TeamSelector 공통 컴포넌트 (`components/common/TeamSelector.tsx` - 종목→팀 2단계 선택, GET /sports, GET /sports/{id}/teams)
- [x] 6-7. SsoButtons 컴포넌트 (`features/auth/components/SsoButtons.tsx` - Google, Kakao, Naver 버튼)
- [x] 6-8. LoginPage (`/auth/login` - Keycloak 리다이렉트 + SSO 버튼)
- [x] 6-9. SignupPage (`/auth/signup` - SignupForm + TeamSelector)
- [x] 6-10. OAuthCallbackPage (`/auth/oauth/callback` - 토큰 수령 → GET /users/me → 분기)
- [x] 6-11. ProfileCompletePage (`/auth/profile/complete` - 닉네임 + 팀 선택)
- [x] 6-12. PasswordFindPage (`/auth/password/find` - Keycloak Forgot Password 리다이렉트)

---

## Phase 7. 게시판 & 게시글 기능

- [x] 7-1. Board 타입 정의 (`features/boards/types/board.ts`)
- [x] 7-2. Board API 함수 (`features/boards/api/boardApi.ts` - getBoards)
- [x] 7-3. useBoards 훅 (`features/boards/hooks/useBoards.ts`)
- [x] 7-4. Sidebar 게시판 목록 연동 (boards API 데이터로 사이드바 게시판 링크 렌더링)
- [x] 7-5. Post 타입 정의 (`features/posts/types/post.ts` - PostListItem, PostDetail, CreatePostRequest, UpdatePostRequest)
- [x] 7-6. Post API 함수 (`features/posts/api/postApi.ts` - getList, getDetail, create, update, delete, toggleLike, report)
- [x] 7-7. usePostList 훅 (useInfiniteQuery, Cursor 페이지네이션)
- [x] 7-8. usePostDetail 훅
- [x] 7-9. useCreatePost 훅 (useMutation + 캐시 무효화)
- [x] 7-10. useUpdatePost 훅
- [x] 7-11. useToggleLike 훅 (낙관적 업데이트 + 롤백)
- [x] 7-12. Post Zod 스키마 (`features/posts/schemas/postSchema.ts` - 제목 1~200, 내용 1~10000)
- [x] 7-13. FileUpload 공통 컴포넌트 (`components/common/FileUpload.tsx` - 파일 선택/업로드/삭제, 크기/타입/개수 검증)
- [x] 7-14. PostSearchBar 컴포넌트 (keyword + searchType 선택 + 디바운스)
- [x] 7-15. PostListItem 컴포넌트 (제목, 작성자, 조회수, 좋아요수, 댓글수, 작성일, AI 배지)
- [x] 7-16. PostList 컴포넌트 (PostListItem 반복 + 무한스크롤 + 정렬 + 빈 상태)
- [x] 7-17. BoardPostListPage (`/boards/:boardId` - PostSearchBar + PostList)
- [x] 7-18. LikeButton 컴포넌트 (좋아요 토글, 하트 아이콘 + 카운트)
- [x] 7-19. ReportModal 컴포넌트 (신고 사유 입력 다이얼로그)
- [x] 7-20. PostDetail 컴포넌트 (게시글 상세 표시 + 좋아요 + 신고 + 수정/삭제 버튼)
- [x] 7-21. PostDetailPage (`/posts/:postId` - PostDetail + 댓글 영역)
- [x] 7-22. PostForm 컴포넌트 (게시판 선택 + 제목 + 내용 + FileUpload, 작성/수정 공용)
- [x] 7-23. PostCreatePage (`/posts/new`)
- [x] 7-24. PostEditPage (`/posts/:postId/edit` - 기존 데이터 로드 + PostForm)
- [x] 7-25. BoardListPage (`/boards` - 전체 게시판 카드/리스트)

---

## Phase 8. 댓글 기능

- [x] 8-1. Comment 타입 정의 (`features/comments/types/comment.ts` - Comment, 대댓글 중첩)
- [x] 8-2. Comment API 함수 (`features/comments/api/commentApi.ts` - getComments, createComment, createReply, updateComment, deleteComment)
- [x] 8-3. useComments 훅 (useInfiniteQuery)
- [x] 8-4. useCreateComment 훅 (useMutation + 캐시 무효화)
- [x] 8-5. useCreateReply 훅
- [x] 8-6. Comment Zod 스키마 (content 1~1000자)
- [x] 8-7. CommentForm 컴포넌트 (댓글 입력)
- [x] 8-8. ReplyForm 컴포넌트 (인라인 대댓글 입력)
- [x] 8-9. CommentItem 컴포넌트 (댓글 1개 표시 + 대댓글 중첩 + 수정/삭제 + AI 배지)
- [x] 8-10. CommentList 컴포넌트 (CommentItem 반복 + 무한스크롤 + CommentForm)
- [x] 8-11. PostDetailPage에 CommentList 통합

---

## Phase 9. 공지사항 기능

- [x] 9-1. Notice 타입 정의 (`features/notices/types/notice.ts`)
- [x] 9-2. Notice API 함수 (`features/notices/api/noticeApi.ts` - getNotices, getNoticeDetail)
- [x] 9-3. useNotices 훅, useNoticeDetail 훅
- [x] 9-4. NoticeList 컴포넌트 (고정 공지 우선 + Cursor 페이지네이션)
- [x] 9-5. NoticeDetail 컴포넌트
- [x] 9-6. NoticeListPage (`/notices`)
- [x] 9-7. NoticeDetailPage (`/notices/:noticeId`)

---

## Phase 10. 마이페이지 기능

- [x] 10-1. User 타입 정의 (`features/mypage/types/user.ts` - UserProfile, UserTeam)
- [x] 10-2. User API 함수 (`features/mypage/api/userApi.ts` - getMe, updateMe, deleteMe, getMyPosts, getMyComments, getMyLikes)
- [x] 10-3. useMyProfile 훅, useUpdateProfile 훅, useWithdraw 훅
- [x] 10-4. Profile Zod 스키마 (닉네임 변경, 비밀번호 변경)
- [x] 10-5. MyProfile 컴포넌트 (프로필 정보 표시 - 이메일, 닉네임, 응원팀, 가입일)
- [x] 10-6. EditProfileForm 컴포넌트 (닉네임 변경 + 비밀번호 변경)
- [x] 10-7. MyPostList 컴포넌트 (내가 쓴 글 목록 + 무한스크롤)
- [x] 10-8. MyCommentList 컴포넌트 (내가 쓴 댓글 목록, 클릭 시 게시글 이동)
- [x] 10-9. MyLikeList 컴포넌트 (좋아요한 글 목록)
- [x] 10-10. WithdrawForm 컴포넌트 (비밀번호 확인 + 확인 다이얼로그)
- [x] 10-11. MyProfilePage (`/mypage`)
- [x] 10-12. EditProfilePage (`/mypage/edit`)
- [x] 10-13. MyPostsPage (`/mypage/posts`)
- [x] 10-14. MyCommentsPage (`/mypage/comments`)
- [x] 10-15. MyLikesPage (`/mypage/likes`)
- [x] 10-16. WithdrawPage (`/mypage/withdraw`)

---

## Phase 11. 알림 기능

- [x] 11-1. Notification 타입 정의 (`features/notifications/types/notification.ts`)
- [x] 11-2. Notification API 함수 (`features/notifications/api/notificationApi.ts` - getNotifications, getUnreadCount, markAsRead, markAllAsRead)
- [x] 11-3. useNotifications 훅, useUnreadCount 훅
- [x] 11-4. NotificationItem 컴포넌트 (유형 아이콘 + 메시지 + 읽음/안읽음 스타일)
- [x] 11-5. NotificationDropdown 컴포넌트 (헤더 알림 아이콘 → 드롭다운 미리보기)
- [x] 11-6. Header에 알림 드롭다운 통합 (미읽음 배지 + NotificationDropdown)
- [x] 11-7. NotificationList 컴포넌트 (전체 알림 목록 + 전체 읽음 버튼 + 무한스크롤)
- [x] 11-8. NotificationListPage (`/notifications`)

---

## Phase 12. 고객센터 (문의) 기능

- [x] 12-1. Inquiry 타입 정의 (`features/inquiries/types/inquiry.ts`)
- [x] 12-2. Inquiry API 함수 (`features/inquiries/api/inquiryApi.ts` - getInquiries, getInquiryDetail, createInquiry)
- [x] 12-3. useInquiries 훅, useCreateInquiry 훅
- [x] 12-4. Inquiry Zod 스키마 (type, title 1~200, content 1~5000)
- [x] 12-5. InquiryForm 컴포넌트 (유형 선택 + 제목 + 내용 + FileUpload)
- [x] 12-6. InquiryList 컴포넌트 (유형, 제목, 상태, 작성일)
- [x] 12-7. InquiryDetail 컴포넌트 (문의 내용 + 첨부파일 + 관리자 답변)
- [x] 12-8. InquiryListPage (`/inquiries`)
- [x] 12-9. InquiryCreatePage (`/inquiries/new`)
- [x] 12-10. InquiryDetailPage (`/inquiries/:inquiryId`)

---

## Phase 13. 요청 (종목/구단 추가) 기능

- [x] 13-1. Request 타입 정의 (`features/requests/types/request.ts`)
- [x] 13-2. Request API 함수 (`features/requests/api/requestApi.ts` - getRequests, getRequestDetail, createRequest)
- [x] 13-3. useRequests 훅, useCreateRequest 훅
- [x] 13-4. Request Zod 스키마 (type, name 1~100, reason 1~1000)
- [x] 13-5. RequestForm 컴포넌트 (유형 선택 + 이름 + 사유)
- [x] 13-6. RequestList 컴포넌트
- [x] 13-7. RequestDetail 컴포넌트 (처리 상태 + 반려 사유)
- [x] 13-8. RequestListPage (`/requests`)
- [x] 13-9. RequestCreatePage (`/requests/new`)
- [x] 13-10. RequestDetailPage (`/requests/:requestId`)

---

## Phase 14. 관리자 기능

- [x] 14-1. Admin 타입 정의 (`features/admin/types/admin.ts`)
- [x] 14-2. Admin API 함수 (`features/admin/api/adminApi.ts` - 회원/신고/공지/문의/요청 관리 API)
- [x] 14-3. Admin 훅 (useAdminUsers, useAdminReports, useAdminNotices, useAdminInquiries, useAdminRequests)
- [x] 14-4. Admin Zod 스키마 (공지 작성, 회원 정지 등)
- [x] 14-5. SuspendModal 컴포넌트 (정지 사유 + 기간 입력)
- [x] 14-6. Dashboard 컴포넌트 (미처리 신고/문의/요청 카운트 요약)
- [x] 14-7. UserManagement 컴포넌트 (회원 목록 검색 + 정지 처리)
- [x] 14-8. ReportManagement 컴포넌트 (신고 목록 + 상태 필터 + 승인/반려)
- [x] 14-9. NoticeManagement 컴포넌트 (공지 CRUD + 상단 고정 + 노출 범위)
- [x] 14-10. InquiryManagement 컴포넌트 (문의 목록 + 답변 작성)
- [x] 14-11. RequestManagement 컴포넌트 (요청 목록 + 승인/반려)
- [x] 14-12. AdminDashboardPage (`/admin`)
- [x] 14-13. AdminUsersPage (`/admin/users`)
- [x] 14-14. AdminReportsPage (`/admin/reports`)
- [x] 14-15. AdminNoticesPage (`/admin/notices`)
- [x] 14-16. AdminInquiriesPage (`/admin/inquiries`)
- [x] 14-17. AdminRequestsPage (`/admin/requests`)

---

## Phase 15. 홈페이지

- [x] 15-1. HomePage (`/` - 공지사항 미리보기 + 게시판 목록 + 인기 게시글)

---

## Phase 16. 마무리 & 품질

- [x] 16-1. 반응형 점검 (모바일 ↔ 데스크톱 전체 페이지 레이아웃 확인)
- [x] 16-2. 에러 핸들링 점검 (API 에러 Toast, 폼 필드 에러 표시, ErrorBoundary 동작)
- [x] 16-3. 로딩 상태 점검 (모든 데이터 로딩 시 스켈레톤/로딩 표시)
- [x] 16-4. 접근성 점검 (키보드 네비게이션, 포커스 관리, 시맨틱 HTML)
- [x] 16-5. 코드 정리 (미사용 import 제거, 네이밍 컨벤션 통일, console.log 제거)
- [x] 16-6. 빌드 테스트 (yarn build 성공 확인, 번들 사이즈 점검)

---

## Phase 17. SRS/SDS 누락 보완 — 높음 (기능적 결함)

- [x] 17-1. 헤더 검색바 기능 구현 (`components/layout/Header.tsx` - 검색 Input에 onChange/onSubmit 핸들러 연결, 검색 결과 페이지 라우트 추가 또는 게시판 내 검색으로 연동) [UI-LAYOUT-005]
- [x] 17-2. 응원팀 수정 불가 처리 (`features/mypage/components/EditProfileForm.tsx` - TeamSelector를 읽기 전용 표시로 변경, 수정 폼에서 팀 변경 차단) [PAGE-MYEDIT-003]
- [x] 17-3. 로그인 returnUrl 보존 (`features/auth/hooks/useAuth.ts` - login() 함수에 returnUrl 파라미터 추가, Keycloak redirectUri에 returnUrl 쿼리 포함 → OAuthCallbackPage에서 복원) [AUTH-GD-001]
- [x] 17-4. 게시글/댓글 삭제 캐시 무효화 (게시글 삭제: `useDeletePost` 훅 생성 → `['posts', boardId]`, `['users', 'me', 'posts']` 무효화 / 댓글 삭제: `useDeleteComment` 훅 생성 → `['comments', postId]`, `['posts', postId]` 무효화 / 게시글 수정: boardId 목록 추가 무효화) [SDS 9.4]

---

## Phase 18. SRS/SDS 누락 보완 — 중간 (사양 미충족)

- [x] 18-1. 탈퇴 사유 입력 필드 추가 (`features/mypage/components/WithdrawForm.tsx` + `schemas/profileSchema.ts` - 선택적 reason Textarea 추가) [PAGE-WITHDRAW-002]
- [x] 18-2. 정지 안내 페이지 상세 표시 (`pages/errors/SuspendedPage.tsx` - 정지 사유, 해제일 표시. axios 인터셉터에서 403 USER_SUSPENDED 응답 데이터를 쿼리 파라미터로 전달) [AUTH-GD-004]
- [x] 18-3. 서버 400 필드 에러 폼 매핑 확대 (PostForm, InquiryForm, RequestForm, EditProfileForm 등 주요 폼에서 서버 400 응답의 field error를 `form.setError()`로 매핑) [API-ERR-001, API-VALID-003]
- [x] 18-4. Axios 인터셉터 HTTP 상태코드별 분기 보완 (403 비정지 → "접근 권한이 없습니다" Toast, 409 → 에러 코드별 메시지, 429 → Rate limit Toast, 500 → 서버 오류 Toast 명시적 분기) [API-ERR-004, API-ERR-006, API-ERR-007, API-ERR-008]
- [x] 18-5. FileUpload 파일 타입/크기 제한 보완 (`components/common/FileUpload.tsx` - `text/plain` 추가, 일반 파일 20MB / 이미지 10MB 조건부 크기 검증) [SDS 12]
- [x] 18-6. 관리자 파괴적 액션 확인 다이얼로그 추가 (`features/admin/components/ReportManagement.tsx` - DELETE_POST, SUSPEND_USER 액션에 ConfirmDialog 적용) [UI-UX-003]

---

## Phase 19. SRS/SDS 누락 보완 — 낮음 (코드 품질/컨벤션)

- [x] 19-1. 이미지 lazy loading 적용 (코드베이스 내 `<img>` 태그에 `loading="lazy"` 속성 추가) [PERF-FE-006]
- [x] 19-2. useIntersectionObserver 훅 분리 (`hooks/useIntersectionObserver.ts` 생성, useInfiniteScroll에서 분리하여 범용 IntersectionObserver 훅 제공) [SDS 2.1]
- [x] 19-3. Feature barrel export 구현 (각 `features/*/index.ts`에서 hooks, components, types re-export) [SDS 3.2]
- [x] 19-4. 탈퇴 사용자 표시 처리 (PostDetail, CommentItem에서 탈퇴 사용자 닉네임을 "탈퇴한 사용자"로 표시하는 프론트엔드 로직 추가) [PAGE-POST-007]

---

## Phase 20. API 백엔드 서버 일치 여부 점검

> **백엔드 참조**: `/Users/park/Desktop/dev_personal/locker-room-resource-service`
> **점검 기준**: 백엔드 컨트롤러, DTO(request/response), ErrorCode.java

- [x] 20-1. API 엔드포인트 경로/메서드 일치 점검 → 불일치 1건 수정 (`/admin/inquiries/{id}/answer` → `/reply`)
- [x] 20-2. 요청 DTO 필드 일치 점검 → 불일치 6건 수정 (`attachmentIds`→`fileIds`, `SuspendRequest`, `ReportProcess`, `RequestProcess`, `AdminNotice`, `UserUpdate`)
- [x] 20-3. 응답 DTO 필드 일치 점검 → 불일치 18건 수정 (PostDetail author 객체화, Board 필드 변경, Notice/Notification/Inquiry/Admin 타입 전체 교정 등)
- [x] 20-4. 페이지네이션 파라미터 일치 점검 → sort 값 snake_case→camelCase 수정 (`created_at`→`createdAt`, `like_count`→`likeCount`)
- [x] 20-5. 에러 코드/메시지 매핑 일치 점검 → 백엔드 ErrorCode.java를 숫자 코드(USER_001)에서 의미적 코드(USER_SUSPENDED)로 변경, api.md와 프론트엔드 일치
- [x] 20-6. 인증/인가 헤더 일치 점검 → Authorization Bearer, Idempotency-Key 동일 확인 (일치)
- [x] 20-7. 불일치 항목 수정 및 빌드 검증 → 프론트엔드 타입 12개, API 2개, 컴포넌트 30+개 수정, `tsc -b` 통과

### 20-7 수정 상세

**백엔드 수정 (1건)**
- `ErrorCode.java`: 숫자 코드 → api.md 의미적 코드로 변경, 누락 코드 추가 (`FILE_TYPE_NOT_ALLOWED`, `FILE_COUNT_EXCEEDED`, `RATE_LIMIT_EXCEEDED`)

**프론트엔드 타입 수정 (12건)**
- `types/api.ts`: sort 값 camelCase 변경
- `types/common.ts`: UserTeam 필드를 백엔드 UserTeamInfo와 일치
- `features/auth/types/auth.ts`: Sport/Team에 isActive 추가, Team.logo → logoUrl
- `features/posts/types/post.ts`: AuthorInfo/FileInfo 타입 신설, PostDetail author 객체화, files 필드명 교정, CreatePost/UpdatePost에 fileIds 사용
- `features/comments/types/comment.ts`: Comment.author 객체화, 불필요 필드 제거
- `features/boards/types/board.ts`: BoardType 추가, type/teamId/teamName 필드로 변경
- `features/notices/types/notice.ts`: NoticeScope 추가, scope/teamName/adminNickname 필드 교정
- `features/notifications/types/notification.ts`: TargetType 추가, targetType/readAt 필드 추가, count→unreadCount
- `features/inquiries/types/inquiry.ts`: InquiryReply 타입 신설, files/replies 필드 교정, fileIds 사용
- `features/requests/types/request.ts`: processedAt 필드 추가
- `features/mypage/types/user.ts`: UserProfile.id 변경, MyPostItem/MyLikeItem 분리, ChangePasswordRequest 제거 → UpdateProfileRequest 통합
- `features/admin/types/admin.ts`: AdminUser.id 변경, SuspendRequest suspendedUntil, ReportProcess status+action, AdminNotice scope, AdminInquiry/Request userNickname

**프론트엔드 API 수정 (2건)**
- `features/mypage/api/userApi.ts`: changePassword 제거, MyPostItem/MyLikeItem 반환 타입
- `features/admin/api/adminApi.ts`: `/answer` → `/reply`

**프론트엔드 컴포넌트 수정 (30+건)**
- 게시글: PostListItem, PostDetail, PostForm, PostCreatePage, PostEditPage, FileUpload
- 댓글: CommentItem
- 게시판/공지: BoardListPage, HomePage, NoticeList, NoticeDetail
- 알림: NotificationList, NotificationDropdown
- 문의: InquiryDetail, InquiryForm
- 마이페이지: MyProfile, MyPostList, MyLikeList, EditProfileForm
- 관리자: UserManagement, InquiryManagement, RequestManagement, ReportManagement, SuspendModal, NoticeManagement, TeamSelector
- App.tsx (DevSimulator userId → id)

### 백엔드 추가 예정 사항 (별도 작업)

> 아래 항목은 프론트엔드에서 사용 중이나 현재 백엔드에 미구현된 사항. 백엔드에 추가 예정.

| 항목 | 프론트엔드 엔드포인트 | 현재 상태 |
|------|----------------------|----------|
| 관리자 대시보드 | `GET /admin/dashboard` | 백엔드 미구현 |
| 관리자 공지 목록 | `GET /admin/notices` | 백엔드 미구현 |
| 인기 게시글 | `GET /posts/popular` | 백엔드 미구현 |
| 회원 정지 해제 | `PUT /admin/users/{id}/unsuspend` | 백엔드 미구현 |
| 댓글 Cursor 페이지네이션 | `GET /posts/{postId}/comments` | 백엔드 List 반환 → Cursor 페이지네이션 추가 예정 |
| AuthorInfo.teamName | PostDetail/Comment author | 백엔드 AuthorInfo에 teamName 필드 추가 예정 |
| UserTeamInfo.teamLogoUrl | UserProfile teams | 백엔드 UserTeamInfo에 로고 URL 추가 예정 |

---

## 요약

| Phase | 영역 | 작업 수 |
|-------|------|---------|
| 1 | 프로젝트 초기 설정 | 10 |
| 2 | 핵심 인프라 모듈 | 13 |
| 3 | 공통 컴포넌트 | 8 |
| 4 | 레이아웃 | 6 |
| 5 | 라우트 가드 & 라우터 | 6 |
| 6 | 인증 (Auth) | 12 |
| 7 | 게시판 & 게시글 | 25 |
| 8 | 댓글 | 11 |
| 9 | 공지사항 | 7 |
| 10 | 마이페이지 | 16 |
| 11 | 알림 | 8 |
| 12 | 고객센터 (문의) | 10 |
| 13 | 요청 | 10 |
| 14 | 관리자 | 17 |
| 15 | 홈페이지 | 1 |
| 16 | 마무리 & 품질 | 6 |
| 17 | SRS/SDS 누락 보완 — 높음 | 4 |
| 18 | SRS/SDS 누락 보완 — 중간 | 6 |
| 19 | SRS/SDS 누락 보완 — 낮음 | 4 |
| 20 | API 백엔드 서버 일치 여부 점검 | 7 |
| **합계** | | **187** |
