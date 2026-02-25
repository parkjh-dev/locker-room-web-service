/**
 * MSW API Handlers
 * http://localhost:8080/api/v1 기준 전체 엔드포인트
 */
import { http, HttpResponse } from 'msw';
import {
  sports,
  teamsBySport,
  boards,
  postListItems,
  postDetail,
  comments,
  noticeListItems,
  noticeDetail,
  notifications,
  userProfile,
  adminProfile,
  myPosts,
  myComments,
  myLikes,
  inquiryListItems,
  inquiryDetail,
  requestListItems,
  requestDetail,
  adminDashboard,
  adminUsers,
  adminReports,
  adminNotices,
  adminInquiries,
  adminRequests,
} from './data';

const BASE = 'http://localhost:8080/api/v1';

/** ApiResponse 래핑 헬퍼 */
function ok<T>(data: T) {
  return HttpResponse.json({ code: 'SUCCESS', message: '성공', data });
}

/** CursorPageResponse 래핑 헬퍼 */
function cursorPage<T>(items: T[]) {
  return ok({ items, nextCursor: null, hasNext: false });
}

export const handlers = [
  // ──────────────────────────────────────────────
  // Auth
  // ──────────────────────────────────────────────
  http.post(`${BASE}/auth/signup`, () => ok({ id: 100 })),
  http.post(`${BASE}/auth/profile/complete`, () => ok({ id: 100 })),

  // ──────────────────────────────────────────────
  // Sports & Teams
  // ──────────────────────────────────────────────
  http.get(`${BASE}/sports`, () => ok(sports)),
  http.get(`${BASE}/sports/:sportId/teams`, ({ params }) => {
    const sportId = Number(params.sportId);
    return ok(teamsBySport[sportId] ?? []);
  }),

  // ──────────────────────────────────────────────
  // Boards
  // ──────────────────────────────────────────────
  http.get(`${BASE}/boards`, () => ok(boards)),

  // ──────────────────────────────────────────────
  // Posts
  // ──────────────────────────────────────────────
  http.get(`${BASE}/boards/:boardId/posts`, () => cursorPage(postListItems)),
  http.get(`${BASE}/posts/popular`, () => ok(postListItems.slice(0, 5))),
  http.get(`${BASE}/posts/:postId`, () => ok(postDetail)),
  http.post(`${BASE}/posts`, () => ok({ id: 100 })),
  http.put(`${BASE}/posts/:postId`, () => ok({ id: 1 })),
  http.delete(`${BASE}/posts/:postId`, () => ok(null)),
  http.post(`${BASE}/posts/:postId/like`, () => ok({ postId: 1, isLiked: true, likeCount: 29 })),
  http.post(`${BASE}/posts/:postId/report`, () => ok(null)),

  // ──────────────────────────────────────────────
  // Comments
  // ──────────────────────────────────────────────
  http.get(`${BASE}/posts/:postId/comments`, () => cursorPage(comments)),
  http.post(`${BASE}/posts/:postId/comments`, () => ok({ id: 100 })),
  http.post(`${BASE}/comments/:commentId/replies`, () => ok({ id: 101 })),
  http.put(`${BASE}/comments/:commentId`, () => ok({ id: 1 })),
  http.delete(`${BASE}/comments/:commentId`, () => ok(null)),

  // ──────────────────────────────────────────────
  // Notices
  // ──────────────────────────────────────────────
  http.get(`${BASE}/notices`, () => cursorPage(noticeListItems)),
  http.get(`${BASE}/notices/:noticeId`, () => ok(noticeDetail)),

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
  http.put(`${BASE}/users/me`, () => ok({ id: 10, nickname: '축구광팬' })),
  http.delete(`${BASE}/users/me`, () => ok(null)),
  http.get(`${BASE}/users/me/posts`, () => cursorPage(myPosts)),
  http.get(`${BASE}/users/me/comments`, () => cursorPage(myComments)),
  http.get(`${BASE}/users/me/likes`, () => cursorPage(myLikes)),

  // ──────────────────────────────────────────────
  // Notifications
  // ──────────────────────────────────────────────
  http.get(`${BASE}/notifications`, () => cursorPage(notifications)),
  http.get(`${BASE}/notifications/unread-count`, () =>
    ok({ unreadCount: notifications.filter((n) => !n.isRead).length }),
  ),
  http.put(`${BASE}/notifications/:id/read`, () => ok(null)),
  http.put(`${BASE}/notifications/read-all`, () => ok({ updatedCount: 2 })),

  // ──────────────────────────────────────────────
  // Inquiries
  // ──────────────────────────────────────────────
  http.get(`${BASE}/inquiries`, () => cursorPage(inquiryListItems)),
  http.get(`${BASE}/inquiries/:inquiryId`, () => ok(inquiryDetail)),
  http.post(`${BASE}/inquiries`, () => ok({ id: 100 })),

  // ──────────────────────────────────────────────
  // Requests
  // ──────────────────────────────────────────────
  http.get(`${BASE}/requests`, () => cursorPage(requestListItems)),
  http.get(`${BASE}/requests/:requestId`, () => ok(requestDetail)),
  http.post(`${BASE}/requests`, () => ok({ id: 100 })),

  // ──────────────────────────────────────────────
  // File Upload
  // ──────────────────────────────────────────────
  http.post(`${BASE}/files`, () =>
    ok({
      id: 1,
      originalName: 'image.png',
      url: 'https://placehold.co/600x400',
      size: 102400,
      mimeType: 'image/png',
    }),
  ),

  // ──────────────────────────────────────────────
  // Admin
  // ──────────────────────────────────────────────
  http.get(`${BASE}/admin/dashboard`, () => ok(adminDashboard)),
  http.get(`${BASE}/admin/users`, () => cursorPage(adminUsers)),
  http.put(`${BASE}/admin/users/:userId/suspend`, () => ok(null)),
  http.put(`${BASE}/admin/users/:userId/unsuspend`, () => ok(null)),
  http.get(`${BASE}/admin/reports`, () => cursorPage(adminReports)),
  http.put(`${BASE}/admin/reports/:reportId`, () => ok(null)),
  http.get(`${BASE}/admin/notices`, () => cursorPage(adminNotices)),
  http.post(`${BASE}/admin/notices`, () => ok({ id: 100 })),
  http.put(`${BASE}/admin/notices/:noticeId`, () => ok(null)),
  http.delete(`${BASE}/admin/notices/:noticeId`, () => ok(null)),
  http.get(`${BASE}/admin/inquiries`, () => cursorPage(adminInquiries)),
  http.post(`${BASE}/admin/inquiries/:inquiryId/reply`, () => ok(null)),
  http.get(`${BASE}/admin/requests`, () => cursorPage(adminRequests)),
  http.put(`${BASE}/admin/requests/:requestId`, () => ok(null)),
];
