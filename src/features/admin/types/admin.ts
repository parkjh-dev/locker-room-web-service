/** 관리자 - 대시보드 요약 */
export interface AdminDashboardSummary {
  pendingReportCount: number;
  pendingInquiryCount: number;
  pendingRequestCount: number;
}

/** 관리자 - 회원 목록 아이템 (백엔드 AdminUserListResponse 매칭) */
export interface AdminUser {
  id: number;
  email: string;
  nickname: string;
  role: 'USER' | 'ADMIN';
  provider: string | null;
  isSuspended: boolean;
  createdAt: string;
}

/** 관리자 - 회원 정지 요청 (백엔드 SuspendRequest 매칭) */
export interface SuspendUserRequest {
  reason: string;
  suspendedUntil: string;
}

/** 관리자 - 신고 목록 아이템 (백엔드 ReportListResponse 매칭) */
export interface AdminReport {
  id: number;
  postId: number;
  postTitle: string;
  reporterNickname: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

/** 관리자 - 신고 처리 요청 (백엔드 ReportProcessRequest 매칭) */
export interface ProcessReportRequest {
  status: 'APPROVED' | 'REJECTED';
  action?: string;
}

/** 관리자 - 공지 작성/수정 요청 (백엔드 NoticeCreateRequest 매칭) */
export interface AdminNoticeRequest {
  title: string;
  content: string;
  isPinned: boolean;
  scope: 'ALL' | 'TEAM';
  teamId?: number | null;
}

/** 관리자 - 공지 목록 아이템 */
export interface AdminNotice {
  id: number;
  title: string;
  isPinned: boolean;
  scope: 'ALL' | 'TEAM';
  teamName: string | null;
  createdAt: string;
}

/** 관리자 - 문의 목록 아이템 (백엔드 AdminInquiryListResponse 매칭) */
export interface AdminInquiry {
  id: number;
  type: 'GENERAL' | 'BUG' | 'SUGGESTION';
  title: string;
  userNickname: string;
  status: 'PENDING' | 'ANSWERED';
  createdAt: string;
}

/** 관리자 - 문의 답변 요청 (백엔드 InquiryReplyRequest 매칭) */
export interface AnswerInquiryRequest {
  content: string;
}

/** 관리자 - 요청 목록 아이템 (백엔드 AdminRequestListResponse 매칭) */
export interface AdminRequest {
  id: number;
  userNickname: string;
  type: 'SPORT' | 'TEAM';
  name: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

/** 관리자 - 요청 처리 (백엔드 RequestProcessRequest 매칭) */
export interface ProcessRequestRequest {
  status: 'APPROVED' | 'REJECTED';
  rejectReason?: string;
}
