# Locker Room Web - 소프트웨어 요구사항 명세서 (SRS)

> 참고 문서: `web/decide.md`, `back-end/api.md`, `back-end/srs.md`
> 본 문서는 프론트엔드 시스템 관점의 요구사항을 정의한다.

---

## 1. 개요

### 1.1 목적
본 문서는 Locker Room 웹 프론트엔드의 기능적/비기능적 요구사항을 정의한다. 페이지별 기능, 인증 흐름, API 통신, UI/UX 정책, 접근 제어 등 프론트엔드가 충족해야 할 요구사항을 기술한다.

### 1.2 시스템 범위

```
사용자 (브라우저)
    ├── Keycloak (인증: OIDC, Authorization Code Flow + PKCE)
    └── API Gateway (:8080) → Backend Services
```

### 1.3 기술 스택

| 구분 | 기술 | 비고 |
|------|------|------|
| Framework | React 19 | |
| Language | TypeScript ~5.9 | |
| Build Tool | Vite ^7 | |
| Package Manager | yarn 1.x (Classic) | |
| Styling | Tailwind CSS **v3** | v4 아닌 v3 사용 확정 |
| UI Components | shadcn/ui (Radix UI) | CLI v2.3.0 사용 |
| Server State | TanStack Query ^5 | |
| Client State | Zustand ^5 | |
| Form | React Hook Form ^7 + Zod **v4** | Zod v4는 v3과 일부 API 차이 |
| HTTP Client | Axios ^1.13 | |
| Auth | keycloak-js ^26 | |
| Toast | Sonner ^2 | |
| Linting | ESLint ^9 + Prettier ^3 | Flat config |

---

## 2. 인증/인가 요구사항

### 2.1 Keycloak 연동

| ID | 요구사항 | 상세 |
|----|----------|------|
| AUTH-FE-001 | 연동 방식 | keycloak-js 공식 어댑터로 Keycloak 연동 |
| AUTH-FE-002 | 인증 흐름 | Authorization Code Flow + PKCE |
| AUTH-FE-003 | SSO 지원 | `kc_idp_hint` 파라미터로 Google, Kakao, Naver IdP Brokering |
| AUTH-FE-004 | Client 설정 | Keycloak Public Client (locker-room-web), PKCE 활성화 |

### 2.2 토큰 관리

| ID | 요구사항 | 상세 |
|----|----------|------|
| AUTH-TK-001 | 토큰 저장 | 메모리(Zustand store)에 Access/Refresh Token 보관 (XSS 안전) |
| AUTH-TK-002 | 세션 복원 | 탭 새로고침 시 Keycloak silent check-sso로 세션 복원 |
| AUTH-TK-003 | 자동 갱신 | keycloak-js `onTokenExpired` 콜백으로 만료 전 백그라운드 갱신 |
| AUTH-TK-004 | Fallback 갱신 | Axios 인터셉터에서 401 응답 시 토큰 갱신 → 원래 요청 재시도 |
| AUTH-TK-005 | 갱신 실패 | Refresh Token 만료 시 로그인 페이지(`/auth/login`)로 리다이렉트 |
| AUTH-TK-006 | 로그아웃 | Keycloak logout endpoint 호출 → 메모리 토큰 제거 → `/auth/login` 이동 |

### 2.3 라우팅 가드

| ID | 요구사항 | 상세 |
|----|----------|------|
| AUTH-GD-001 | ProtectedRoute | 비로그인 시 `/auth/login?returnUrl={현재경로}` 리다이렉트, 로그인 후 원래 페이지 복귀 |
| AUTH-GD-002 | AdminRoute | role ≠ ADMIN이면 403 에러 페이지 표시 |
| AUTH-GD-003 | ProfileGuard | SSO 로그인 후 GET /users/me → 404이면 `/auth/profile/complete`로 강제 이동 |
| AUTH-GD-004 | 정지 계정 | API 403 (USER_SUSPENDED) 응답 시 전용 정지 안내 페이지 표시 (정지 사유, 해제일) |

### 2.4 인증 흐름

| ID | 흐름 | 상세 |
|----|------|------|
| AUTH-FL-001 | 로컬 로그인 | `/auth/login` → Keycloak 로그인 Redirect → `/auth/oauth/callback` → 토큰 수령 → 홈 이동 |
| AUTH-FL-002 | SSO 로그인 (기존 회원) | SSO 버튼 → Keycloak (kc_idp_hint) → 콜백 → 토큰 수령 → GET /users/me → 200 → 홈 |
| AUTH-FL-003 | SSO 로그인 (신규 회원) | SSO 버튼 → 콜백 → 토큰 수령 → GET /users/me → 404 → `/auth/profile/complete` |
| AUTH-FL-004 | 비밀번호 재설정 | `/auth/password/find` → Keycloak "Forgot Password" 페이지 Redirect |

---

## 3. 페이지별 기능 요구사항

### 3.1 메인/홈 (`/`)

| ID | 요구사항 | 상세 |
|----|----------|------|
| PAGE-HOME-001 | 인증 | 불필요 (비로그인 접근 가능) |
| PAGE-HOME-002 | 게시판 목록 | 공통 게시판 목록 표시 (인증 시 팀 전용 포함) |
| PAGE-HOME-003 | 공지사항 미리보기 | 상단 고정 공지사항 표시 |
| PAGE-HOME-004 | 인기 게시글 | 인기 게시글 미리보기 (선택적) |

### 3.2 회원가입 (`/auth/signup`)

| ID | 요구사항 | 상세 |
|----|----------|------|
| PAGE-SIGNUP-001 | 인증 | 불필요 |
| PAGE-SIGNUP-002 | 입력 필드 | 이메일, 비밀번호, 비밀번호 확인, 닉네임 |
| PAGE-SIGNUP-003 | 응원팀 선택 | 종목 선택 → 팀 목록 로드 → 팀 선택 (2단계) |
| PAGE-SIGNUP-004 | 이메일 검증 | 이메일 형식 검증, 최대 255자 |
| PAGE-SIGNUP-005 | 비밀번호 검증 | 8~20자, 영문+숫자+특수문자 포함 |
| PAGE-SIGNUP-006 | 닉네임 검증 | 2~20자, 특수문자 불가 |
| PAGE-SIGNUP-007 | 응원팀 필수 | 최소 1개 종목, 종목당 1팀 선택 필수 |
| PAGE-SIGNUP-008 | 에러 처리 | USER_EMAIL_DUPLICATED(409), USER_NICKNAME_DUPLICATED(409) → 필드별 에러 표시 |
| PAGE-SIGNUP-009 | 성공 후 | 로그인 페이지로 이동 또는 자동 로그인 |
| PAGE-SIGNUP-010 | API | POST /auth/signup, GET /sports, GET /sports/{id}/teams |

### 3.3 SSO 프로필 보완 (`/auth/profile/complete`)

| ID | 요구사항 | 상세 |
|----|----------|------|
| PAGE-PROFILE-001 | 인증 | 필수 (Keycloak Access Token) |
| PAGE-PROFILE-002 | 진입 조건 | GET /users/me → 404일 때만 접근 가능 |
| PAGE-PROFILE-003 | 입력 필드 | 닉네임, 응원팀 선택 (종목 → 팀 2단계) |
| PAGE-PROFILE-004 | 이메일 표시 | Keycloak에서 가져온 이메일 읽기 전용 표시 |
| PAGE-PROFILE-005 | API | POST /auth/profile/complete |

### 3.4 게시판 목록 (`/boards`)

| ID | 요구사항 | 상세 |
|----|----------|------|
| PAGE-BOARDS-001 | 인증 | 선택 (인증 시 팀 전용 게시판 포함) |
| PAGE-BOARDS-002 | 표시 정보 | 게시판명, 유형 (COMMON/TEAM/QNA/NEWS), 팀명 |
| PAGE-BOARDS-003 | 클릭 동작 | 게시판 클릭 → `/boards/:boardId` 이동 |
| PAGE-BOARDS-004 | API | GET /boards |

### 3.5 게시글 목록 (`/boards/:boardId`)

| ID | 요구사항 | 상세 |
|----|----------|------|
| PAGE-POSTLIST-001 | 인증 | 선택 (팀 전용 게시판은 해당 팀 회원만) |
| PAGE-POSTLIST-002 | 표시 정보 | 제목, 작성자 닉네임, 조회수, 좋아요수, 댓글수, 작성일 |
| PAGE-POSTLIST-003 | 페이지네이션 | Cursor 기반 무한스크롤 또는 "더보기" 버튼 |
| PAGE-POSTLIST-004 | 정렬 | createdAt(기본), likeCount (백엔드 CursorPageRequest 기준 camelCase) |
| PAGE-POSTLIST-005 | 검색 | keyword + searchType (TITLE, CONTENT, TITLE_CONTENT, NICKNAME) |
| PAGE-POSTLIST-006 | AI 게시글 표시 | isAiGenerated=true인 게시글에 AI 배지 표시 |
| PAGE-POSTLIST-007 | 접근 제어 | POST_ACCESS_DENIED(403) 시 접근 권한 없음 안내 |
| PAGE-POSTLIST-008 | API | GET /boards/{boardId}/posts |

### 3.6 게시글 상세 (`/posts/:postId`)

| ID | 요구사항 | 상세 |
|----|----------|------|
| PAGE-POST-001 | 인증 | 선택 (팀 전용은 인증 필수) |
| PAGE-POST-002 | 표시 정보 | 제목, 내용, 작성자(닉네임, 팀), 조회수, 좋아요수, 첨부파일, 작성일 |
| PAGE-POST-003 | 좋아요 | 인증 사용자만, 토글 방식, 낙관적 업데이트 |
| PAGE-POST-004 | 신고 | 인증 사용자만, 모달로 신고 사유 입력 |
| PAGE-POST-005 | 수정/삭제 | 작성자 본인만 수정/삭제 버튼 표시 |
| PAGE-POST-006 | 댓글 영역 | 게시글 하단에 댓글 목록 + 작성 폼 (3.7 참고) |
| PAGE-POST-007 | 탈퇴 사용자 | 작성자가 탈퇴한 경우 "탈퇴한 사용자"로 표시 |
| PAGE-POST-008 | API | GET /posts/{postId}, POST /posts/{postId}/like, POST /posts/{postId}/report |

### 3.7 댓글

| ID | 요구사항 | 상세 |
|----|----------|------|
| PAGE-CMT-001 | 댓글 목록 | 게시글 상세 하단에 Cursor 페이지네이션으로 표시 |
| PAGE-CMT-002 | 대댓글 | 부모 댓글 하위에 1단계 대댓글 중첩 표시 |
| PAGE-CMT-003 | 댓글 작성 | 인증 사용자만, 1~1000자 |
| PAGE-CMT-004 | 대댓글 작성 | "답글" 버튼 클릭 → 인라인 작성 폼 |
| PAGE-CMT-005 | 수정/삭제 | 작성자 본인만 |
| PAGE-CMT-006 | 삭제된 댓글 | 대댓글이 있는 삭제 댓글은 "삭제된 댓글입니다." 표시 |
| PAGE-CMT-007 | AI 댓글 | isAiGenerated=true인 댓글에 AI 배지 표시 |
| PAGE-CMT-008 | 멘션 자동삽입 | 대댓글 작성 시 `@닉네임 ` 텍스트를 입력 필드에 자동 프리필. content 문자열에 포함되는 순수 텍스트 방식 |
| PAGE-CMT-009 | 멘션 하이라이트 | 댓글 본문의 `@닉네임` 패턴을 시각적으로 구분하여 표시 (text-primary, font-medium) |
| PAGE-CMT-010 | API | GET /posts/{postId}/comments, POST /posts/{postId}/comments, POST /comments/{commentId}/replies, PUT /comments/{commentId}, DELETE /comments/{commentId} |

### 3.8 게시글 작성 (`/posts/new`)

| ID | 요구사항 | 상세 |
|----|----------|------|
| PAGE-WRITE-001 | 인증 | 필수 |
| PAGE-WRITE-002 | 게시판 선택 | 드롭다운으로 작성 가능한 게시판 선택 |
| PAGE-WRITE-003 | 제목 | 1~200자 |
| PAGE-WRITE-004 | 내용 | 1~10000자 |
| PAGE-WRITE-005 | 첨부파일 | 최대 5개, 이미지(10MB, jpeg/png/gif/webp), 일반(20MB, pdf/txt) |
| PAGE-WRITE-006 | 파일 업로드 | 게시글 작성 전 POST /files로 파일 개별 업로드 → fileIds 수집 → 게시글 작성 시 전달 |
| PAGE-WRITE-007 | 멱등성 | POST 요청 시 Idempotency-Key 자동 생성 |
| PAGE-WRITE-008 | 성공 후 | 작성된 게시글 상세 페이지로 이동 |
| PAGE-WRITE-009 | API | POST /posts, POST /files |

### 3.9 게시글 수정 (`/posts/:postId/edit`)

| ID | 요구사항 | 상세 |
|----|----------|------|
| PAGE-EDIT-001 | 인증 | 필수 (작성자 본인만) |
| PAGE-EDIT-002 | 기존 데이터 | 기존 제목, 내용, 첨부파일 로드 |
| PAGE-EDIT-003 | 파일 관리 | 기존 파일 삭제 + 새 파일 추가 가능 |
| PAGE-EDIT-004 | API | GET /posts/{postId}, PUT /posts/{postId}, POST /files, DELETE /files/{fileId} |

### 3.10 마이페이지 (`/mypage`)

| ID | 요구사항 | 상세 |
|----|----------|------|
| PAGE-MY-001 | 인증 | 필수 |
| PAGE-MY-002 | 프로필 | 이메일, 닉네임, 응원팀(종목+팀명+로고), 가입일 표시 |
| PAGE-MY-003 | 수정 링크 | `/mypage/edit` 이동 버튼 |
| PAGE-MY-004 | 내 활동 탭 | 내가 쓴 글(`/mypage/posts`), 쓴 댓글(`/mypage/comments`), 좋아요한 글(`/mypage/likes`) 탭 또는 링크 |
| PAGE-MY-005 | API | GET /users/me |

### 3.11 내 정보 수정 (`/mypage/edit`)

| ID | 요구사항 | 상세 |
|----|----------|------|
| PAGE-MYEDIT-001 | 닉네임 변경 | 2~20자, 특수문자 불가 |
| PAGE-MYEDIT-002 | 비밀번호 변경 | 현재 비밀번호 확인 필수, 새 비밀번호 8~20자 |
| PAGE-MYEDIT-003 | 응원팀 | 변경 불가 (읽기 전용 표시) |
| PAGE-MYEDIT-004 | API | PUT /users/me |

### 3.12 내 활동 (`/mypage/posts`, `/mypage/comments`, `/mypage/likes`)

| ID | 요구사항 | 상세 |
|----|----------|------|
| PAGE-MYACT-001 | 내가 쓴 글 | 게시글 목록 (게시판명, 제목, 조회수, 좋아요수, 댓글수, 작성일) |
| PAGE-MYACT-002 | 내가 쓴 댓글 | 댓글 목록 (게시글 제목, 댓글 내용, 작성일), 클릭 시 해당 게시글로 이동 |
| PAGE-MYACT-003 | 좋아요한 글 | 게시글 목록 (게시판명, 제목, 작성자, 좋아요수, 작성일) |
| PAGE-MYACT-004 | 페이지네이션 | Cursor 기반 |
| PAGE-MYACT-005 | API | GET /users/me/posts, GET /users/me/comments, GET /users/me/likes |

### 3.13 회원 탈퇴 (`/mypage/withdraw`)

| ID | 요구사항 | 상세 |
|----|----------|------|
| PAGE-WITHDRAW-001 | 비밀번호 확인 | 로컬 계정은 비밀번호 재입력 필수 |
| PAGE-WITHDRAW-002 | 탈퇴 사유 | 선택 입력 |
| PAGE-WITHDRAW-003 | 확인 절차 | "정말 탈퇴하시겠습니까?" 확인 다이얼로그 |
| PAGE-WITHDRAW-004 | 성공 후 | 로그아웃 + 홈 이동 |
| PAGE-WITHDRAW-005 | API | DELETE /users/me |

### 3.14 공지사항 (`/notices`, `/notices/:noticeId`)

| ID | 요구사항 | 상세 |
|----|----------|------|
| PAGE-NOTICE-001 | 인증 | 불필요 |
| PAGE-NOTICE-002 | 목록 | 상단 고정(isPinned) 우선 표시, Cursor 페이지네이션 |
| PAGE-NOTICE-003 | 상세 | 제목, 내용, 작성자(관리자), 작성일 |
| PAGE-NOTICE-004 | API | GET /notices, GET /notices/{noticeId} |

### 3.15 알림 (`/notifications`)

| ID | 요구사항 | 상세 |
|----|----------|------|
| PAGE-NOTI-001 | 인증 | 필수 |
| PAGE-NOTI-002 | 알림 목록 | 유형(COMMENT, REPLY, NOTICE, INQUIRY_REPLY), 메시지, 읽음 여부, 시간 |
| PAGE-NOTI-003 | 읽음/안읽음 | 안읽은 알림 시각적 구분, 클릭 시 읽음 처리 |
| PAGE-NOTI-004 | 전체 읽음 | "모두 읽음" 버튼 |
| PAGE-NOTI-005 | 클릭 동작 | 알림 클릭 시 해당 대상(게시글, 댓글, 문의 등)으로 이동 |
| PAGE-NOTI-006 | 미읽음 배지 | 헤더/사이드바에 미읽음 알림 수 배지 표시 |
| PAGE-NOTI-007 | 드롭다운 | 헤더에서 알림 아이콘 클릭 시 최근 알림 미리보기 |
| PAGE-NOTI-008 | API | GET /notifications, GET /notifications/unread-count, PUT /notifications/{id}/read, PUT /notifications/read-all |

### 3.16 고객센터 (`/inquiries`, `/inquiries/new`, `/inquiries/:inquiryId`)

| ID | 요구사항 | 상세 |
|----|----------|------|
| PAGE-INQ-001 | 인증 | 필수 |
| PAGE-INQ-002 | 문의 작성 | 유형(GENERAL/BUG/SUGGESTION), 제목(1~200자), 내용(1~5000자), 첨부파일(최대 5개) |
| PAGE-INQ-003 | 내 문의 목록 | 유형, 제목, 상태(PENDING/ANSWERED), 작성일 |
| PAGE-INQ-004 | 문의 상세 | 문의 내용 + 첨부파일 + 관리자 답변 내역 |
| PAGE-INQ-005 | 본인 문의만 | 타인의 문의는 접근 불가 |
| PAGE-INQ-006 | API | POST /inquiries, GET /inquiries, GET /inquiries/{inquiryId} |

### 3.17 요청 (`/requests`, `/requests/new`, `/requests/:requestId`)

| ID | 요구사항 | 상세 |
|----|----------|------|
| PAGE-REQ-001 | 인증 | 필수 |
| PAGE-REQ-002 | 요청 작성 | 유형(SPORT/TEAM), 이름(1~100자), 사유(1~1000자) |
| PAGE-REQ-003 | 내 요청 목록 | 유형, 이름, 상태(PENDING/APPROVED/REJECTED), 작성일 |
| PAGE-REQ-004 | 요청 상세 | 요청 내용 + 처리 상태 + 반려 사유 (REJECTED 시) |
| PAGE-REQ-005 | API | POST /requests, GET /requests, GET /requests/{requestId} |

### 3.18 관리자 페이지 (`/admin/*`)

| ID | 요구사항 | 상세 |
|----|----------|------|
| PAGE-ADM-001 | 접근 제어 | role=ADMIN만 접근 가능 (AdminRoute 가드) |
| PAGE-ADM-002 | 대시보드 | 미처리 신고/문의/요청 카운트 요약 |
| PAGE-ADM-003 | 회원 관리 | 회원 목록 검색(닉네임/이메일), 역할 필터, 정지 처리 모달(사유+해제일시) |
| PAGE-ADM-004 | 신고 관리 | 신고 목록 (상태 필터), 승인/반려 처리 (DELETE_POST, SUSPEND_USER 액션) |
| PAGE-ADM-005 | 공지사항 관리 | 공지 작성(제목/내용/상단고정/scope:ALL\|TEAM/teamId), 수정, 삭제 |
| PAGE-ADM-006 | 문의 관리 | 문의 목록 (상태/유형 필터), 답변 작성 |
| PAGE-ADM-007 | 요청 관리 | 요청 목록 (상태/유형 필터), 승인/반려 처리 |
| PAGE-ADM-008 | API | GET /admin/users, PUT /admin/users/{id}/suspend, GET/PUT /admin/reports, POST/PUT/DELETE /admin/notices, GET /admin/inquiries, POST /admin/inquiries/{id}/reply, GET/PUT /admin/requests |

---

## 4. UI/UX 요구사항

### 4.1 레이아웃

> **디자인 참고**: 블라인드(teamblind.com) 스타일 커뮤니티 레이아웃. 최대 너비 1140px, 왼쪽 사이드바(240px), 깔끔한 흰 배경 기반.

| ID | 요구사항 | 상세 |
|----|----------|------|
| UI-LAYOUT-001 | Public 레이아웃 | 헤더 + 컨텐츠 + 푸터 (사이드바 없음) |
| UI-LAYOUT-002 | Private 레이아웃 | 헤더 + 왼쪽 사이드바 + 컨텐츠 + 푸터 (SidebarLayout) |
| UI-LAYOUT-003 | Admin 레이아웃 | 관리자 전용 헤더 + 왼쪽 사이드바 + 컨텐츠 |
| UI-LAYOUT-004 | 헤더 (비로그인) | 로고, 로그인/회원가입 버튼 |
| UI-LAYOUT-005 | 헤더 (로그인) | 로고, 검색바, 알림 아이콘(미읽음 배지), 유저 프로필 드롭다운 |
| UI-LAYOUT-006 | 사이드바 | 게시판 목록, 전체 게시판/고객센터/요청 링크 |
| UI-LAYOUT-007 | 최대 너비 | 콘텐츠 영역 max-width 1140px, 중앙 정렬 |

### 4.2 반응형

| ID | 요구사항 | 상세 |
|----|----------|------|
| UI-RWD-001 | 모바일 퍼스트 | 기본 스타일이 모바일, 브레이크포인트로 확장 |
| UI-RWD-002 | 브레이크포인트 | sm:640px / md:768px / lg:1024px / xl:1280px (Tailwind 기본) |
| UI-RWD-003 | 모바일 사이드바 | 햄버거 메뉴로 토글 (오버레이) |
| UI-RWD-004 | 데스크톱 사이드바 | 항상 표시 (고정 너비) |

### 4.3 디자인 시스템

| ID | 요구사항 | 상세 |
|----|----------|------|
| UI-DS-001 | 컴포넌트 | shadcn/ui (Radix UI + Tailwind CSS) |
| UI-DS-002 | 폰트 | Pretendard (한글 최적화) |
| UI-DS-003 | Primary 컬러 | `#599468` |
| UI-DS-004 | 다크모드 | 미지원 (향후 확장성 고려하여 CSS 변수 기반) |

### 4.4 공통 UX

| ID | 요구사항 | 상세 |
|----|----------|------|
| UI-UX-001 | 로딩 | 데이터 로딩 시 스켈레톤 UI 표시 |
| UI-UX-002 | Toast | 성공/에러/경고 알림은 Sonner Toast로 표시 |
| UI-UX-003 | 확인 다이얼로그 | 삭제, 탈퇴 등 파괴적 액션은 확인 다이얼로그 필수 |
| UI-UX-004 | 폼 에러 | 필드별 인라인 에러 메시지 표시 (Zod 검증) |
| UI-UX-005 | 빈 상태 | 데이터 없을 때 Empty State 컴포넌트 표시 |
| UI-UX-006 | 무한스크롤 | 게시글/댓글/알림 목록은 Cursor 기반 무한스크롤 또는 "더보기" |

---

## 5. API 통신 요구사항

### 5.1 HTTP 클라이언트

| ID | 요구사항 | 상세 |
|----|----------|------|
| API-FE-001 | 클라이언트 | Axios 인스턴스 사용 |
| API-FE-002 | Base URL | `{VITE_API_BASE_URL}/api/v1` |
| API-FE-003 | Timeout | 10초 |
| API-FE-004 | 인증 헤더 | Request 인터셉터에서 `Authorization: Bearer {token}` 자동 첨부 |
| API-FE-005 | 멱등성 키 | POST 요청 시 `Idempotency-Key: {UUID}` 자동 생성 |

### 5.2 에러 처리

| ID | HTTP 상태 | 프론트엔드 동작 |
|----|-----------|-----------------|
| API-ERR-001 | 400 | 필드별 에러 메시지 인라인 표시 |
| API-ERR-002 | 401 | 토큰 갱신 시도 → 실패 시 로그인 리다이렉트 |
| API-ERR-003 | 403 (USER_SUSPENDED) | 정지 안내 페이지 이동 |
| API-ERR-004 | 403 (기타) | "접근 권한이 없습니다" Toast 또는 에러 페이지 |
| API-ERR-005 | 404 | "존재하지 않는 페이지입니다" 에러 페이지 |
| API-ERR-006 | 409 | API 에러 코드별 메시지 Toast (중복 이메일, 이미 신고 등) |
| API-ERR-007 | 429 | "요청이 너무 많습니다. 잠시 후 다시 시도해주세요" Toast |
| API-ERR-008 | 500 | "서버 오류가 발생했습니다" Toast |

### 5.3 서버 상태 관리

| ID | 요구사항 | 상세 |
|----|----------|------|
| API-STATE-001 | GET 요청 | TanStack Query useQuery 훅 사용 (캐싱, 자동 재요청) |
| API-STATE-002 | POST/PUT/DELETE | TanStack Query useMutation 훅 사용 |
| API-STATE-003 | Query Key | `[리소스명, ...파라미터]` 컨벤션 |
| API-STATE-004 | 낙관적 업데이트 | 좋아요 토글 시 UI 먼저 반영 → API 실패 시 롤백 |
| API-STATE-005 | 캐시 무효화 | 게시글 작성/수정/삭제 후 관련 목록 쿼리 무효화 |

### 5.4 유효성 검증

| ID | 요구사항 | 상세 |
|----|----------|------|
| API-VALID-001 | 클라이언트 검증 | React Hook Form + Zod 스키마로 제출 전 검증 |
| API-VALID-002 | 서버 검증 일치 | Zod 스키마를 백엔드 유효성 규칙과 일치시킴 |
| API-VALID-003 | 서버 에러 표시 | 400 응답의 필드별 에러를 폼 필드에 매핑 표시 |

---

## 6. 보안 요구사항

| ID | 요구사항 | 상세 |
|----|----------|------|
| SEC-FE-001 | 토큰 저장 | 메모리 저장 (localStorage/sessionStorage 사용 금지, XSS 방지) |
| SEC-FE-002 | XSS 방지 | React의 기본 이스케이핑 활용, dangerouslySetInnerHTML 사용 금지 |
| SEC-FE-003 | 환경변수 | 민감 정보(Client Secret 등) 프론트엔드 코드에 포함 금지 |
| SEC-FE-004 | HTTPS | 운영 환경에서 HTTPS 강제 (로컬 제외) |
| SEC-FE-005 | 의존성 | 정기적 의존성 취약점 스캔 (yarn audit) |

---

## 7. 성능 요구사항

| ID | 요구사항 | 기준 |
|----|----------|------|
| PERF-FE-001 | 초기 로딩 | LCP(Largest Contentful Paint) ≤ 2.5초 |
| PERF-FE-002 | 인터랙션 | FID(First Input Delay) ≤ 100ms |
| PERF-FE-003 | 레이아웃 안정성 | CLS(Cumulative Layout Shift) ≤ 0.1 |
| PERF-FE-004 | 번들 사이즈 | 초기 JS 번들 ≤ 300KB (gzipped) |
| PERF-FE-005 | 코드 스플리팅 | 라우트 기반 lazy loading (React.lazy) |
| PERF-FE-006 | 이미지 최적화 | lazy loading, 적절한 포맷 사용 |

---

## 8. 접근성 요구사항

| ID | 요구사항 | 상세 |
|----|----------|------|
| A11Y-001 | 시맨틱 HTML | 적절한 heading 계층, landmark 사용 |
| A11Y-002 | 키보드 네비게이션 | 모든 인터랙티브 요소 키보드로 접근 가능 |
| A11Y-003 | 포커스 관리 | 모달/다이얼로그 열림 시 포커스 트랩 |
| A11Y-004 | ARIA | shadcn/ui의 Radix UI 기본 ARIA 속성 활용 |

---

## 9. 테스트 요구사항 (TBD)

| ID | 요구사항 | 상세 |
|----|----------|------|
| TEST-FE-001 | Storybook | 공통 컴포넌트 시각적 테스트 |
| TEST-FE-002 | E2E (후보) | Playwright 또는 Cypress |

---

## 개정 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 1.0 | 2026-02-23 | - | 초안 작성 |
| 1.1 | 2026-02-23 | - | 기술 스택 버전 명시 (Tailwind v3, Zod v4, shadcn CLI v2.3.0 등) |
| 1.2 | 2026-02-24 | - | 레이아웃 요구사항 보완: 블라인드 스타일 참고, 최대 너비 1140px, 왼쪽 사이드바, 검색바, 푸터 추가 |
| 1.3 | 2026-02-25 | - | Phase 20 반영: 정렬 파라미터 camelCase 통일, 관리자 API 경로 상세화(suspend, reply), 공지 scope/teamId 명시, 정지 처리 사유+해제일시 |
