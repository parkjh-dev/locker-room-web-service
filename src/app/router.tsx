import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from '@/guards/ProtectedRoute';
import { AdminRoute } from '@/guards/AdminRoute';
import { ProfileGuard } from '@/guards/ProfileGuard';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';

// ─── Lazy Pages ───

const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const PasswordFindPage = lazy(() => import('@/pages/auth/PasswordFindPage'));
const OAuthCallbackPage = lazy(() => import('@/pages/auth/OAuthCallbackPage'));
const ProfileCompletePage = lazy(() => import('@/pages/auth/ProfileCompletePage'));

const BoardListPage = lazy(() => import('@/pages/boards/BoardListPage'));
const BoardPostListPage = lazy(() => import('@/pages/boards/BoardPostListPage'));

const PostDetailPage = lazy(() => import('@/pages/posts/PostDetailPage'));
const PostCreatePage = lazy(() => import('@/pages/posts/PostCreatePage'));
const PostEditPage = lazy(() => import('@/pages/posts/PostEditPage'));

const NoticeListPage = lazy(() => import('@/pages/notices/NoticeListPage'));
const NoticeDetailPage = lazy(() => import('@/pages/notices/NoticeDetailPage'));

const MyProfilePage = lazy(() => import('@/pages/mypage/MyProfilePage'));
const EditProfilePage = lazy(() => import('@/pages/mypage/EditProfilePage'));
const MyPostsPage = lazy(() => import('@/pages/mypage/MyPostsPage'));
const MyCommentsPage = lazy(() => import('@/pages/mypage/MyCommentsPage'));
const MyLikesPage = lazy(() => import('@/pages/mypage/MyLikesPage'));
const WithdrawPage = lazy(() => import('@/pages/mypage/WithdrawPage'));

const NotificationListPage = lazy(() => import('@/pages/notifications/NotificationListPage'));

const InquiryListPage = lazy(() => import('@/pages/inquiries/InquiryListPage'));
const InquiryCreatePage = lazy(() => import('@/pages/inquiries/InquiryCreatePage'));
const InquiryDetailPage = lazy(() => import('@/pages/inquiries/InquiryDetailPage'));

const RequestListPage = lazy(() => import('@/pages/requests/RequestListPage'));
const RequestCreatePage = lazy(() => import('@/pages/requests/RequestCreatePage'));
const RequestDetailPage = lazy(() => import('@/pages/requests/RequestDetailPage'));

const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminReportsPage = lazy(() => import('@/pages/admin/AdminReportsPage'));
const AdminNoticesPage = lazy(() => import('@/pages/admin/AdminNoticesPage'));
const AdminInquiriesPage = lazy(() => import('@/pages/admin/AdminInquiriesPage'));
const AdminRequestsPage = lazy(() => import('@/pages/admin/AdminRequestsPage'));

const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage'));
const ForbiddenPage = lazy(() => import('@/pages/errors/ForbiddenPage'));
const SuspendedPage = lazy(() => import('@/pages/errors/SuspendedPage'));

// ─── Suspense Wrapper ───

// eslint-disable-next-line react-refresh/only-export-components
function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<FullScreenLoader />}>{children}</Suspense>;
}

function page(Component: React.LazyExoticComponent<React.ComponentType>) {
  return (
    <SuspenseWrapper>
      <Component />
    </SuspenseWrapper>
  );
}

// ─── Router ───

export const router = createBrowserRouter([
  // Public Routes
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: page(HomePage) },
      { path: '/auth/login', element: page(LoginPage) },
      { path: '/auth/signup', element: page(SignupPage) },
      { path: '/auth/password/find', element: page(PasswordFindPage) },
      { path: '/auth/oauth/callback', element: page(OAuthCallbackPage) },
      { path: '/boards/:boardId', element: page(BoardPostListPage) },
      { path: '/posts/:postId', element: page(PostDetailPage) },
      { path: '/notices', element: page(NoticeListPage) },
      { path: '/notices/:noticeId', element: page(NoticeDetailPage) },
    ],
  },

  // Protected Routes (로그인 필수 + 프로필 보완 확인)
  {
    element: (
      <ProtectedRoute>
        <ProfileGuard>
          <SidebarLayout />
        </ProfileGuard>
      </ProtectedRoute>
    ),
    children: [
      { path: '/boards', element: page(BoardListPage) },
      { path: '/posts/new', element: page(PostCreatePage) },
      { path: '/posts/:postId/edit', element: page(PostEditPage) },
      { path: '/mypage', element: page(MyProfilePage) },
      { path: '/mypage/edit', element: page(EditProfilePage) },
      { path: '/mypage/posts', element: page(MyPostsPage) },
      { path: '/mypage/comments', element: page(MyCommentsPage) },
      { path: '/mypage/likes', element: page(MyLikesPage) },
      { path: '/mypage/withdraw', element: page(WithdrawPage) },
      { path: '/notifications', element: page(NotificationListPage) },
      { path: '/inquiries', element: page(InquiryListPage) },
      { path: '/inquiries/new', element: page(InquiryCreatePage) },
      { path: '/inquiries/:inquiryId', element: page(InquiryDetailPage) },
      { path: '/requests', element: page(RequestListPage) },
      { path: '/requests/new', element: page(RequestCreatePage) },
      { path: '/requests/:requestId', element: page(RequestDetailPage) },
    ],
  },

  // Auth 보완 (프로필 미완성 유저)
  {
    element: (
      <ProtectedRoute>
        <PublicLayout />
      </ProtectedRoute>
    ),
    children: [{ path: '/auth/profile/complete', element: page(ProfileCompletePage) }],
  },

  // Admin Routes
  {
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { path: '/admin', element: page(AdminDashboardPage) },
      { path: '/admin/users', element: page(AdminUsersPage) },
      { path: '/admin/reports', element: page(AdminReportsPage) },
      { path: '/admin/notices', element: page(AdminNoticesPage) },
      { path: '/admin/inquiries', element: page(AdminInquiriesPage) },
      { path: '/admin/requests', element: page(AdminRequestsPage) },
    ],
  },

  // Error Pages
  { path: '/suspended', element: page(SuspendedPage) },
  { path: '/403', element: page(ForbiddenPage) },
  { path: '*', element: page(NotFoundPage) },
]);
