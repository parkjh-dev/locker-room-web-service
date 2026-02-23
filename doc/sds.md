# Locker Room Web - 소프트웨어 개발 명세서 (SDS)

> 참고 문서: `web/decide.md`, `web/srs.md`, `back-end/api.md`

---

## 1. 개요

### 1.1 목적
본 문서는 Locker Room 웹 프론트엔드의 상세 개발 명세를 정의한다. 프로젝트 구조, 핵심 모듈 구현, 컴포넌트 설계, 상태관리, API 통신, 인증 연동 등을 기술하여 개발자가 일관된 기준으로 구현할 수 있도록 한다.

### 1.2 기술 스택

| 구분 | 기술 | 버전 | 비고 |
|------|------|------|------|
| Framework | React | 19 | |
| Language | TypeScript | ~5.9 | |
| Build Tool | Vite | ^7.3 | |
| Package Manager | yarn | 1.x (Classic) | |
| Styling | Tailwind CSS | **3** (v3.4) | v4와 설정 방식이 다름, v3 사용 확정 |
| UI Components | shadcn/ui (Radix UI) | CLI v2.3.0 | CLI v3.x는 Tailwind v4 전용이므로 v2.3.0 사용 |
| Server State | TanStack Query | ^5 | |
| Client State | Zustand | ^5 | |
| Form | React Hook Form | ^7 | |
| Validation | Zod | **4** (v4.3) | v3과 일부 API 차이 있음, import는 동일 |
| HTTP Client | Axios | ^1.13 | |
| Auth | keycloak-js | ^26 | |
| Routing | React Router | ^7 | |
| Toast | Sonner | ^2 | |
| Linting | ESLint + Prettier | ESLint ^9, Prettier ^3 | Flat config 사용 |
| Utility | clsx + tailwind-merge | shadcn 의존성 | `cn()` 유틸리티 함수 제공 |
| Icons | lucide-react | shadcn 의존성 | |
| Component Docs | Storybook | TBD | |

---

## 2. 프로젝트 구조

### 2.1 디렉토리 구조

```
src/
├── app/                          # 앱 진입점, 프로바이더, 라우터
│   ├── App.tsx                   # 루트 컴포넌트
│   ├── router.tsx                # React Router 설정
│   └── providers/                # 전역 프로바이더
│       ├── AppProvider.tsx       # 모든 프로바이더 조합
│       ├── QueryProvider.tsx     # TanStack Query
│       └── KeycloakProvider.tsx  # Keycloak 초기화
├── components/                   # 공통 컴포넌트
│   ├── ui/                       # shadcn/ui (Button, Input, Dialog, Select 등)
│   ├── layout/                   # 레이아웃 컴포넌트
│   │   ├── PublicLayout.tsx      # 비로그인 레이아웃 (헤더 + 컨텐츠)
│   │   ├── SidebarLayout.tsx     # 로그인 레이아웃 (헤더 + 사이드바 + 컨텐츠)
│   │   ├── AdminLayout.tsx       # 관리자 레이아웃
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   └── common/                   # 공통 비즈니스 컴포넌트
│       ├── Pagination.tsx        # Cursor 페이지네이션 / 무한스크롤
│       ├── FileUpload.tsx        # 파일 업로드 UI
│       ├── ErrorBoundary.tsx     # 에러 바운더리
│       ├── EmptyState.tsx        # 빈 상태 UI
│       ├── SkeletonLoader.tsx    # 스켈레톤 로딩
│       ├── ConfirmDialog.tsx     # 확인 다이얼로그
│       └── TeamSelector.tsx      # 종목 → 팀 2단계 선택
├── features/                     # 기능별 모듈
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   ├── ProfileCompleteForm.tsx
│   │   │   └── SsoButtons.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── api/
│   │   │   └── authApi.ts
│   │   ├── stores/
│   │   │   └── authStore.ts
│   │   ├── schemas/
│   │   │   ├── signupSchema.ts
│   │   │   └── profileCompleteSchema.ts
│   │   ├── types/
│   │   │   └── auth.ts
│   │   └── index.ts
│   ├── posts/
│   │   ├── components/
│   │   │   ├── PostList.tsx
│   │   │   ├── PostListItem.tsx
│   │   │   ├── PostDetail.tsx
│   │   │   ├── PostForm.tsx
│   │   │   ├── PostSearchBar.tsx
│   │   │   ├── LikeButton.tsx
│   │   │   └── ReportModal.tsx
│   │   ├── hooks/
│   │   │   ├── usePostList.ts
│   │   │   ├── usePostDetail.ts
│   │   │   ├── useCreatePost.ts
│   │   │   ├── useUpdatePost.ts
│   │   │   └── useToggleLike.ts
│   │   ├── api/
│   │   │   └── postApi.ts
│   │   ├── schemas/
│   │   │   └── postSchema.ts
│   │   ├── types/
│   │   │   └── post.ts
│   │   └── index.ts
│   ├── comments/
│   │   ├── components/
│   │   │   ├── CommentList.tsx
│   │   │   ├── CommentItem.tsx
│   │   │   ├── CommentForm.tsx
│   │   │   └── ReplyForm.tsx
│   │   ├── hooks/
│   │   │   ├── useComments.ts
│   │   │   ├── useCreateComment.ts
│   │   │   └── useCreateReply.ts
│   │   ├── api/
│   │   │   └── commentApi.ts
│   │   ├── schemas/
│   │   │   └── commentSchema.ts
│   │   ├── types/
│   │   │   └── comment.ts
│   │   └── index.ts
│   ├── boards/
│   │   ├── components/
│   │   │   ├── BoardList.tsx
│   │   │   └── BoardListItem.tsx
│   │   ├── hooks/
│   │   │   └── useBoards.ts
│   │   ├── api/
│   │   │   └── boardApi.ts
│   │   ├── types/
│   │   │   └── board.ts
│   │   └── index.ts
│   ├── notices/
│   │   ├── components/
│   │   │   ├── NoticeList.tsx
│   │   │   └── NoticeDetail.tsx
│   │   ├── hooks/
│   │   │   ├── useNotices.ts
│   │   │   └── useNoticeDetail.ts
│   │   ├── api/
│   │   │   └── noticeApi.ts
│   │   ├── types/
│   │   │   └── notice.ts
│   │   └── index.ts
│   ├── notifications/
│   │   ├── components/
│   │   │   ├── NotificationList.tsx
│   │   │   ├── NotificationItem.tsx
│   │   │   └── NotificationDropdown.tsx
│   │   ├── hooks/
│   │   │   ├── useNotifications.ts
│   │   │   └── useUnreadCount.ts
│   │   ├── api/
│   │   │   └── notificationApi.ts
│   │   ├── types/
│   │   │   └── notification.ts
│   │   └── index.ts
│   ├── inquiries/
│   │   ├── components/
│   │   │   ├── InquiryList.tsx
│   │   │   ├── InquiryDetail.tsx
│   │   │   └── InquiryForm.tsx
│   │   ├── hooks/
│   │   │   ├── useInquiries.ts
│   │   │   └── useCreateInquiry.ts
│   │   ├── api/
│   │   │   └── inquiryApi.ts
│   │   ├── schemas/
│   │   │   └── inquirySchema.ts
│   │   ├── types/
│   │   │   └── inquiry.ts
│   │   └── index.ts
│   ├── requests/
│   │   ├── components/
│   │   │   ├── RequestList.tsx
│   │   │   ├── RequestDetail.tsx
│   │   │   └── RequestForm.tsx
│   │   ├── hooks/
│   │   │   ├── useRequests.ts
│   │   │   └── useCreateRequest.ts
│   │   ├── api/
│   │   │   └── requestApi.ts
│   │   ├── schemas/
│   │   │   └── requestSchema.ts
│   │   ├── types/
│   │   │   └── request.ts
│   │   └── index.ts
│   ├── mypage/
│   │   ├── components/
│   │   │   ├── MyProfile.tsx
│   │   │   ├── EditProfileForm.tsx
│   │   │   ├── MyPostList.tsx
│   │   │   ├── MyCommentList.tsx
│   │   │   ├── MyLikeList.tsx
│   │   │   └── WithdrawForm.tsx
│   │   ├── hooks/
│   │   │   ├── useMyProfile.ts
│   │   │   ├── useUpdateProfile.ts
│   │   │   └── useWithdraw.ts
│   │   ├── api/
│   │   │   └── userApi.ts
│   │   ├── schemas/
│   │   │   └── profileSchema.ts
│   │   ├── types/
│   │   │   └── user.ts
│   │   └── index.ts
│   └── admin/
│       ├── components/
│       │   ├── Dashboard.tsx
│       │   ├── UserManagement.tsx
│       │   ├── ReportManagement.tsx
│       │   ├── NoticeManagement.tsx
│       │   ├── InquiryManagement.tsx
│       │   ├── RequestManagement.tsx
│       │   └── SuspendModal.tsx
│       ├── hooks/
│       │   ├── useAdminUsers.ts
│       │   ├── useAdminReports.ts
│       │   ├── useAdminNotices.ts
│       │   ├── useAdminInquiries.ts
│       │   └── useAdminRequests.ts
│       ├── api/
│       │   └── adminApi.ts
│       ├── schemas/
│       │   ├── noticeSchema.ts
│       │   └── suspendSchema.ts
│       ├── types/
│       │   └── admin.ts
│       └── index.ts
├── hooks/                        # 공통 커스텀 훅
│   ├── useDebounce.ts
│   ├── useIntersectionObserver.ts
│   ├── useInfiniteScroll.ts
│   └── useMediaQuery.ts
├── lib/                          # 외부 라이브러리 설정
│   ├── axios.ts                  # Axios 인스턴스 + 인터셉터
│   ├── keycloak.ts               # Keycloak 초기화 설정
│   ├── queryClient.ts            # TanStack Query 설정
│   └── utils.ts                  # cn() 유틸리티 (shadcn/ui)
├── stores/                       # 공통 Zustand 스토어
│   └── uiStore.ts                # 사이드바 토글, 모달 등 UI 상태
├── types/                        # 공통 타입
│   ├── api.ts                    # ApiResponse, CursorPageResponse 등
│   └── common.ts                 # 공통 유틸리티 타입
├── guards/                       # 라우트 가드
│   ├── ProtectedRoute.tsx
│   ├── AdminRoute.tsx
│   └── ProfileGuard.tsx
├── styles/                       # (예비) 추가 스타일
└── index.css                     # 글로벌 스타일 (Tailwind 지시어, CSS 변수, shadcn 테마)
```

### 2.2 주요 진입점

```
src/
├── main.tsx                      # ReactDOM.createRoot, App 마운트
└── vite-env.d.ts                 # Vite 환경변수 타입
```

---

## 3. 공통 개발 규칙

### 3.1 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `PostListItem.tsx` |
| 훅 파일 | camelCase (use 접두사) | `usePostList.ts` |
| 유틸/함수 파일 | camelCase | `formatDate.ts` |
| 타입/인터페이스 | PascalCase | `PostResponse`, `CreatePostRequest` |
| Zustand store | camelCase + Store | `useAuthStore` |
| Zod 스키마 | camelCase + Schema | `signupSchema` |
| 상수 | UPPER_SNAKE_CASE | `MAX_FILE_SIZE` |
| Query Key | 배열: `[리소스명, ...파라미터]` | `['posts', boardId]` |

### 3.2 파일 규칙

- 컴포넌트: PascalCase (`PostCard.tsx`), 한 파일에 하나의 export default
- 훅/유틸: camelCase (`useAuth.ts`, `formatDate.ts`)
- `index.ts`로 feature 모듈의 공개 API re-export
- 타입 전용 파일은 `types/` 디렉토리에 배치

### 3.3 Import 규칙

```typescript
// 1. React / 외부 라이브러리
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. 내부 모듈 (절대 경로)
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/stores/authStore';

// 3. 상대 경로 (같은 feature 내)
import { PostListItem } from './PostListItem';
import type { PostResponse } from '../types/post';
```

> `@/` 경로 별칭은 root `tsconfig.json`, `tsconfig.app.json`의 `paths`와 Vite의 `resolve.alias`에서 `src/`로 설정 (shadcn CLI 호환을 위해 root에도 paths 필요)

---

## 4. 공통 타입 정의

### 4.1 API 응답 타입 (`types/api.ts`)

```typescript
interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

interface CursorPageResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasNext: boolean;
}

interface FieldError {
  field: string;
  message: string;
}

interface ValidationErrorData {
  errors: FieldError[];
}
```

### 4.2 공통 파라미터 타입

```typescript
interface CursorPageParams {
  cursor?: string;
  size?: number;
  sort?: 'created_at' | 'like_count';
}

interface SearchParams extends CursorPageParams {
  keyword?: string;
  searchType?: 'TITLE' | 'CONTENT' | 'TITLE_CONTENT' | 'NICKNAME';
}
```

---

## 5. 인증 모듈 설계

### 5.1 Keycloak 초기화 (`lib/keycloak.ts`)

```typescript
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

export default keycloak;
```

### 5.2 Auth Store (`features/auth/stores/authStore.ts`)

```typescript
import { create } from 'zustand';

interface AuthUser {
  userId: number;
  email: string;
  nickname: string;
  role: 'USER' | 'ADMIN';
  teams: UserTeam[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;

  setTokens: (access: string, refresh: string) => void;
  setUser: (user: AuthUser) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,

  setTokens: (access, refresh) =>
    set({ accessToken: access, refreshToken: refresh, isAuthenticated: true }),

  setUser: (user) => set({ user }),

  clear: () =>
    set({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
    }),
}));
```

### 5.3 Keycloak Provider (`app/providers/KeycloakProvider.tsx`)

```typescript
import { useEffect, useState, type ReactNode } from 'react';
import keycloak from '@/lib/keycloak';
import { useAuthStore } from '@/features/auth/stores/authStore';

export function KeycloakProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const { setTokens, clear } = useAuthStore();

  useEffect(() => {
    keycloak
      .init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/silent-check-sso.html',
        pkceMethod: 'S256',
      })
      .then((authenticated) => {
        if (authenticated && keycloak.token && keycloak.refreshToken) {
          setTokens(keycloak.token, keycloak.refreshToken);
        }
        setInitialized(true);
      });

    keycloak.onTokenExpired = () => {
      keycloak
        .updateToken(30)
        .then(() => {
          if (keycloak.token && keycloak.refreshToken) {
            setTokens(keycloak.token, keycloak.refreshToken);
          }
        })
        .catch(() => {
          clear();
        });
    };
  }, []);

  if (!initialized) return <FullScreenLoader />;
  return <>{children}</>;
}
```

### 5.4 인증 흐름 구현

#### 로그인 (`features/auth/hooks/useAuth.ts`)

```typescript
export function useAuth() {
  const { setTokens, setUser, clear } = useAuthStore();

  const login = (idpHint?: 'google' | 'kakao' | 'naver') => {
    keycloak.login({
      redirectUri: window.location.origin + '/auth/oauth/callback',
      ...(idpHint && { idpHint }),
    });
  };

  const logout = () => {
    keycloak.logout({
      redirectUri: window.location.origin + '/auth/login',
    });
    clear();
  };

  return { login, logout };
}
```

#### OAuth 콜백 (`features/auth/components/OAuthCallback.tsx`)

```
1. Keycloak에서 리다이렉트 → keycloak-js가 토큰 자동 수령
2. GET /users/me 호출
   → 200: 유저 정보 setUser → returnUrl 또는 홈 이동
   → 404: /auth/profile/complete로 이동
```

---

## 6. API 통신 모듈 설계

### 6.1 Axios 인스턴스 (`lib/axios.ts`)

```typescript
import axios from 'axios';
import { useAuthStore } from '@/features/auth/stores/authStore';
import keycloak from '@/lib/keycloak';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (config.method === 'post') {
    config.headers['Idempotency-Key'] = crypto.randomUUID();
  }

  return config;
});

// Response 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await keycloak.updateToken(5);
        const { setTokens } = useAuthStore.getState();
        if (keycloak.token && keycloak.refreshToken) {
          setTokens(keycloak.token, keycloak.refreshToken);
        }
        originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;
        return api(originalRequest);
      } catch {
        useAuthStore.getState().clear();
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }
    }

    if (error.response?.status === 403) {
      const code = error.response.data?.code;
      if (code === 'USER_SUSPENDED') {
        window.location.href = '/suspended';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### 6.2 TanStack Query 설정 (`lib/queryClient.ts`)

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,        // 5분
      gcTime: 1000 * 60 * 30,           // 30분
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

### 6.3 API 함수 패턴 (예: `features/posts/api/postApi.ts`)

```typescript
import api from '@/lib/axios';
import type { ApiResponse, CursorPageResponse, SearchParams } from '@/types/api';
import type { PostResponse, PostListItem, CreatePostRequest } from '../types/post';

export const postApi = {
  getList: (boardId: number, params: SearchParams) =>
    api.get<ApiResponse<CursorPageResponse<PostListItem>>>(
      `/boards/${boardId}/posts`,
      { params }
    ),

  getDetail: (postId: number) =>
    api.get<ApiResponse<PostResponse>>(`/posts/${postId}`),

  create: (data: CreatePostRequest) =>
    api.post<ApiResponse<{ id: number }>>('/posts', data),

  update: (postId: number, data: CreatePostRequest) =>
    api.put<ApiResponse<{ id: number }>>(`/posts/${postId}`, data),

  delete: (postId: number) =>
    api.delete(`/posts/${postId}`),

  toggleLike: (postId: number) =>
    api.post<ApiResponse<{ postId: number; isLiked: boolean; likeCount: number }>>(
      `/posts/${postId}/like`
    ),

  report: (postId: number, reason: string) =>
    api.post(`/posts/${postId}/report`, { reason }),
};
```

### 6.4 커스텀 훅 패턴 (예: `features/posts/hooks/usePostList.ts`)

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';
import { postApi } from '../api/postApi';
import type { SearchParams } from '@/types/api';

export function usePostList(boardId: number, params: Omit<SearchParams, 'cursor'>) {
  return useInfiniteQuery({
    queryKey: ['posts', boardId, params],
    queryFn: ({ pageParam }) =>
      postApi.getList(boardId, { ...params, cursor: pageParam }).then((r) => r.data.data),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
  });
}
```

### 6.5 Mutation 패턴 (예: `features/posts/hooks/useToggleLike.ts`)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '../api/postApi';

export function useToggleLike(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postApi.toggleLike(postId),

    onMutate: async () => {
      // 낙관적 업데이트: 기존 캐시를 즉시 반영
      await queryClient.cancelQueries({ queryKey: ['posts', postId] });
      const previous = queryClient.getQueryData(['posts', postId]);
      queryClient.setQueryData(['posts', postId], (old: any) => ({
        ...old,
        data: {
          ...old.data,
          isLiked: !old.data.isLiked,
          likeCount: old.data.isLiked
            ? old.data.likeCount - 1
            : old.data.likeCount + 1,
        },
      }));
      return { previous };
    },

    onError: (_err, _vars, context) => {
      // 실패 시 롤백
      if (context?.previous) {
        queryClient.setQueryData(['posts', postId], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });
}
```

---

## 7. 라우팅 설계

### 7.1 라우터 구성 (`app/router.tsx`)

```typescript
import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from '@/guards/ProtectedRoute';
import { AdminRoute } from '@/guards/AdminRoute';
import { ProfileGuard } from '@/guards/ProfileGuard';
import { lazy } from 'react';

const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const PasswordFindPage = lazy(() => import('@/pages/auth/PasswordFindPage'));
const OAuthCallbackPage = lazy(() => import('@/pages/auth/OAuthCallbackPage'));
const ProfileCompletePage = lazy(() => import('@/pages/auth/ProfileCompletePage'));
// ... 기타 페이지

export const router = createBrowserRouter([
  // Public Routes
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/auth/login', element: <LoginPage /> },
      { path: '/auth/signup', element: <SignupPage /> },
      { path: '/auth/password/find', element: <PasswordFindPage /> },
      { path: '/auth/oauth/callback', element: <OAuthCallbackPage /> },
      { path: '/boards/:boardId', element: <BoardPostListPage /> },
      { path: '/posts/:postId', element: <PostDetailPage /> },
      { path: '/notices', element: <NoticeListPage /> },
      { path: '/notices/:noticeId', element: <NoticeDetailPage /> },
    ],
  },

  // Protected Routes (로그인 필수)
  {
    element: (
      <ProtectedRoute>
        <ProfileGuard>
          <SidebarLayout />
        </ProfileGuard>
      </ProtectedRoute>
    ),
    children: [
      { path: '/boards', element: <BoardListPage /> },
      { path: '/posts/new', element: <PostCreatePage /> },
      { path: '/posts/:postId/edit', element: <PostEditPage /> },
      { path: '/mypage', element: <MyProfilePage /> },
      { path: '/mypage/edit', element: <EditProfilePage /> },
      { path: '/mypage/posts', element: <MyPostsPage /> },
      { path: '/mypage/comments', element: <MyCommentsPage /> },
      { path: '/mypage/likes', element: <MyLikesPage /> },
      { path: '/mypage/withdraw', element: <WithdrawPage /> },
      { path: '/notifications', element: <NotificationListPage /> },
      { path: '/inquiries', element: <InquiryListPage /> },
      { path: '/inquiries/new', element: <InquiryCreatePage /> },
      { path: '/inquiries/:inquiryId', element: <InquiryDetailPage /> },
      { path: '/requests', element: <RequestListPage /> },
      { path: '/requests/new', element: <RequestCreatePage /> },
      { path: '/requests/:requestId', element: <RequestDetailPage /> },
    ],
  },

  // Auth 보완 (프로필 미완성)
  {
    element: <ProtectedRoute><PublicLayout /></ProtectedRoute>,
    children: [
      { path: '/auth/profile/complete', element: <ProfileCompletePage /> },
    ],
  },

  // Admin Routes
  {
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { path: '/admin', element: <AdminDashboardPage /> },
      { path: '/admin/users', element: <AdminUsersPage /> },
      { path: '/admin/reports', element: <AdminReportsPage /> },
      { path: '/admin/notices', element: <AdminNoticesPage /> },
      { path: '/admin/inquiries', element: <AdminInquiriesPage /> },
      { path: '/admin/requests', element: <AdminRequestsPage /> },
    ],
  },

  // Error Pages
  { path: '/suspended', element: <SuspendedPage /> },
  { path: '/403', element: <ForbiddenPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
```

### 7.2 라우트 가드 구현

#### ProtectedRoute

```typescript
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/authStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/auth/login?returnUrl=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return <>{children}</>;
}
```

#### AdminRoute

```typescript
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/authStore';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/403" replace />;

  return <>{children}</>;
}
```

#### ProfileGuard

```typescript
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/features/mypage/api/userApi';

export function ProfileGuard({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users', 'me'],
    queryFn: () => userApi.getMe(),
  });

  if (isLoading) return <FullScreenLoader />;

  if (error && (error as any).response?.status === 404) {
    return <Navigate to="/auth/profile/complete" replace />;
  }

  return <>{children}</>;
}
```

---

## 8. 폼 관리 설계

### 8.1 Zod 스키마 (예: `features/auth/schemas/signupSchema.ts`)

```typescript
import { z } from 'zod';

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식이 아닙니다.')
    .max(255, '이메일은 255자 이하여야 합니다.'),

  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .max(20, '비밀번호는 20자 이하여야 합니다.')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      '영문, 숫자, 특수문자를 포함해야 합니다.'
    ),

  passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요.'),

  nickname: z
    .string()
    .min(2, '닉네임은 2자 이상이어야 합니다.')
    .max(20, '닉네임은 20자 이하여야 합니다.')
    .regex(/^[가-힣a-zA-Z0-9]+$/, '특수문자는 사용할 수 없습니다.'),

  teams: z
    .array(
      z.object({
        sportId: z.number(),
        teamId: z.number(),
      })
    )
    .min(1, '최소 1개 종목의 응원팀을 선택해주세요.'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['passwordConfirm'],
});

export type SignupFormData = z.infer<typeof signupSchema>;
```

### 8.2 폼 컴포넌트 패턴

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormData } from '../schemas/signupSchema';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SignupForm() {
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', passwordConfirm: '', nickname: '', teams: [] },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      await authApi.signup(data);
      // 성공 처리
    } catch (error) {
      // 서버 에러를 폼 필드에 매핑
      if (error.response?.data?.code === 'USER_EMAIL_DUPLICATED') {
        form.setError('email', { message: '이미 사용 중인 이메일입니다.' });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* ... 기타 필드 */}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          회원가입
        </Button>
      </form>
    </Form>
  );
}
```

---

## 9. 상태관리 설계

### 9.1 역할 분담

| 구분 | 도구 | 데이터 |
|------|------|--------|
| 클라이언트 상태 | Zustand | 인증 토큰, 유저 정보, UI 상태 (사이드바, 모달) |
| 서버 상태 | TanStack Query | 모든 API 데이터 (게시글, 댓글, 알림 등) |

### 9.2 UI Store (`stores/uiStore.ts`)

```typescript
import { create } from 'zustand';

interface UiState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));
```

### 9.3 Query Key 컨벤션

| 리소스 | Query Key | 사용 위치 |
|--------|-----------|-----------|
| 내 정보 | `['users', 'me']` | 마이페이지, ProfileGuard |
| 게시판 목록 | `['boards']` | 사이드바, 게시판 목록 |
| 게시글 목록 | `['posts', boardId, { keyword, searchType, sort }]` | 게시판 페이지 |
| 게시글 상세 | `['posts', postId]` | 게시글 상세 |
| 댓글 목록 | `['comments', postId]` | 게시글 상세 |
| 알림 목록 | `['notifications']` | 알림 페이지 |
| 알림 미읽음 수 | `['notifications', 'unread-count']` | 헤더 배지 |
| 내 게시글 | `['users', 'me', 'posts']` | 마이페이지 |
| 내 댓글 | `['users', 'me', 'comments']` | 마이페이지 |
| 좋아요한 글 | `['users', 'me', 'likes']` | 마이페이지 |
| 내 문의 | `['inquiries']` | 문의 목록 |
| 내 요청 | `['requests']` | 요청 목록 |
| 종목 목록 | `['sports']` | 회원가입, 프로필 보완 |
| 팀 목록 | `['sports', sportId, 'teams']` | 회원가입, 프로필 보완 |
| 공지사항 | `['notices']` | 공지 목록 |
| 관리자 회원 | `['admin', 'users', params]` | 관리자 회원관리 |
| 관리자 신고 | `['admin', 'reports', params]` | 관리자 신고관리 |
| 관리자 공지 | `['admin', 'notices', params]` | 관리자 공지관리 |
| 관리자 문의 | `['admin', 'inquiries', params]` | 관리자 문의관리 |
| 관리자 요청 | `['admin', 'requests', params]` | 관리자 요청관리 |

### 9.4 캐시 무효화 전략

| 액션 | 무효화 대상 |
|------|-------------|
| 게시글 작성 | `['posts', boardId]` (해당 게시판 목록) |
| 게시글 수정 | `['posts', postId]`, `['posts', boardId]` |
| 게시글 삭제 | `['posts', boardId]`, `['users', 'me', 'posts']` |
| 댓글 작성 | `['comments', postId]`, `['posts', postId]` (commentCount 갱신) |
| 댓글 삭제 | `['comments', postId]`, `['posts', postId]` |
| 좋아요 토글 | `['posts', postId]` (낙관적 + settled 시 무효화) |
| 프로필 수정 | `['users', 'me']` |
| 알림 읽음 | `['notifications']`, `['notifications', 'unread-count']` |

---

## 10. 에러 핸들링 설계

### 10.1 Error Boundary

```typescript
import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### 10.2 적용 구조

```
<GlobalErrorBoundary>              ← 치명적 에러 (앱 전체 fallback)
  <AppProvider>
    <RouterProvider>
      <PageErrorBoundary>          ← 페이지 단위 에러 격리
        <PageComponent />
      </PageErrorBoundary>
    </RouterProvider>
  </AppProvider>
</GlobalErrorBoundary>
```

### 10.3 Toast 에러 처리 (`lib/axios.ts` Response 인터셉터 확장)

```typescript
import { toast } from 'sonner';

const ERROR_MESSAGES: Record<string, string> = {
  COMMON_RATE_LIMIT_EXCEEDED: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  COMMON_INTERNAL_ERROR: '서버 오류가 발생했습니다.',
  POST_ALREADY_REPORTED: '이미 신고한 게시글입니다.',
  POST_ACCESS_DENIED: '접근 권한이 없습니다.',
  FILE_SIZE_EXCEEDED: '파일 크기가 초과되었습니다.',
  FILE_TYPE_NOT_ALLOWED: '허용되지 않은 파일 형식입니다.',
};

// 인터셉터 내부에서
const errorCode = error.response?.data?.code;
const message = ERROR_MESSAGES[errorCode] || error.response?.data?.message;
if (message) {
  toast.error(message);
}
```

---

## 11. 레이아웃 설계

### 11.1 PublicLayout

```
┌─────────────────────────────────┐
│ Header (로고, 로그인/회원가입)    │
├─────────────────────────────────┤
│                                 │
│           Content               │
│         (Outlet)                │
│                                 │
└─────────────────────────────────┘
```

### 11.2 SidebarLayout (로그인 후)

```
┌─────────────────────────────────────┐
│ Header (로고, 검색, 알림, 프로필)     │
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │        Content           │
│ (게시판   │       (Outlet)           │
│  목록,   │                          │
│  마이페이지│                          │
│  링크)   │                          │
│          │                          │
├──────────┴──────────────────────────┤
│ Footer (선택)                        │
└─────────────────────────────────────┘
```

> 모바일에서는 사이드바가 오버레이로 토글 (햄버거 메뉴)

### 11.3 AdminLayout

```
┌─────────────────────────────────────┐
│ Admin Header (로고, 관리자 프로필)    │
├──────────┬──────────────────────────┤
│ Admin    │                          │
│ Sidebar  │        Content           │
│ (회원관리 │       (Outlet)           │
│  신고관리 │                          │
│  공지관리 │                          │
│  문의관리 │                          │
│  요청관리)│                          │
└──────────┴──────────────────────────┘
```

---

## 12. 파일 업로드 설계

### 12.1 업로드 흐름

```
1. FileUpload 컴포넌트에서 파일 선택
2. 클라이언트 사이드 검증
   - 파일 크기 (이미지 10MB, 일반 20MB)
   - 파일 타입 (jpeg/png/gif/webp/pdf/txt)
   - 파일 개수 (최대 5개)
3. POST /files 호출 (multipart/form-data)
4. 성공 시 fileId를 상태에 저장
5. 폼 제출 시 fileIds 배열을 함께 전송
```

### 12.2 FileUpload 컴포넌트

```typescript
interface FileUploadProps {
  targetType: 'POST' | 'INQUIRY';
  maxFiles?: number;            // 기본 5
  onFilesChange: (fileIds: number[]) => void;
  initialFiles?: FileInfo[];    // 수정 시 기존 파일
}
```

---

## 13. 무한스크롤 설계

### 13.1 useInfiniteScroll 훅

```typescript
import { useEffect, useRef } from 'react';

export function useInfiniteScroll(
  onIntersect: () => void,
  options: { enabled: boolean }
) {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!options.enabled || !targetRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onIntersect();
      },
      { threshold: 0.1 }
    );

    observer.observe(targetRef.current);
    return () => observer.disconnect();
  }, [options.enabled]);

  return targetRef;
}
```

### 13.2 사용 패턴

```typescript
function PostListPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = usePostList(boardId, params);
  const loadMoreRef = useInfiniteScroll(() => fetchNextPage(), { enabled: !!hasNextPage });

  return (
    <div>
      {data?.pages.map((page) =>
        page.items.map((post) => <PostListItem key={post.id} post={post} />)
      )}
      <div ref={loadMoreRef} />
      {isFetchingNextPage && <SkeletonLoader />}
    </div>
  );
}
```

---

## 14. 환경변수 설정

### 14.1 환경변수 파일

```
.env.local          # 로컬 개발 (git 무시)
.env.development    # 개발 서버
.env.production     # 프로덕션
```

### 14.2 환경변수 목록

```
VITE_API_BASE_URL=http://localhost:8080
VITE_KEYCLOAK_URL=http://localhost:8180
VITE_KEYCLOAK_REALM=locker-room
VITE_KEYCLOAK_CLIENT_ID=locker-room-web
```

### 14.3 타입 선언 (`vite-env.d.ts`)

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_KEYCLOAK_URL: string;
  readonly VITE_KEYCLOAK_REALM: string;
  readonly VITE_KEYCLOAK_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## 15. 스타일 설정

### 15.1 Tailwind 설정 (`tailwind.config.ts`)

> shadcn/ui 초기화 시 자동 생성된 CSS 변수 기반 컬러 시스템 + 프로젝트 커스텀 컬러 통합

```typescript
import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          hover: '#4a8058',
          light: '#e8f5ec',
          foreground: 'hsl(var(--primary-foreground))',
        },
        surface: '#F9FAFB',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
```

### 15.2 CSS 변수 (`src/index.css`)

> 파일 위치: `styles/globals.css`가 아닌 `src/index.css` (shadcn/ui 기본 설정)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;
    --primary: 142 26% 48%;           /* #599468 */
    --primary-foreground: 0 0% 100%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;
    --accent: 210 40% 96%;
    --accent-foreground: 222 47% 11%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 142 26% 48%;
    --chart-1: 142 26% 48%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

## 16. 테스트 전략

### 16.1 Storybook

- 모든 `components/ui/` 컴포넌트에 스토리 작성
- `components/common/` 주요 컴포넌트에 스토리 작성
- Feature 컴포넌트는 선택적

### 16.2 E2E 테스트 (TBD)

| 후보 | 장점 |
|------|------|
| Playwright | 빠른 실행, 브라우저 자동 관리 |
| Cypress | DX 우수, 시각적 디버깅 |

> 도구 선택은 개발 진행 후 결정

---

## 17. 빌드 및 배포

### 17.1 빌드

```bash
# 개발 서버
yarn dev

# 프로덕션 빌드
yarn build

# 빌드 결과 미리보기
yarn preview
```

### 17.2 Vite 설정 (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
});
```

### 17.3 배포 (TBD)

| 후보 | 설명 |
|------|------|
| Vercel | 간편 배포, CI/CD 자동화 |
| AWS S3 + CloudFront | 백엔드와 동일 인프라 |
| Docker + EC2 (Nginx) | 유연한 서버 구성 |

---

## 개정 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 1.0 | 2026-02-23 | - | 초안 작성 |
| 1.1 | 2026-02-23 | - | Phase 1 반영: 기술 스택 버전 고정 (Tailwind v3, Zod v4, shadcn CLI v2.3.0), 디렉토리 구조 보정 (index.css, lib/utils.ts), Tailwind config/CSS 변수를 실제 구현과 동기화 |
