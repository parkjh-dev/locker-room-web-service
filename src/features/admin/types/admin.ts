/** 관리자 - 대시보드 요약 */
export interface AdminDashboardSummary {
  pendingReportCount: number;
  pendingInquiryCount: number;
  pendingRequestCount: number;
}

/** 관리자 - 회원 목록 아이템 */
export interface AdminUser {
  userId: number;
  email: string;
  nickname: string;
  role: 'USER' | 'ADMIN';
  isSuspended: boolean;
  suspendedUntil: string | null;
  createdAt: string;
}

/** 관리자 - 회원 정지 요청 */
export interface SuspendUserRequest {
  reason: string;
  days: number;
}

/** 관리자 - 신고 목록 아이템 */
export interface AdminReport {
  id: number;
  targetType: 'POST' | 'COMMENT';
  targetId: number;
  reason: string;
  reporterNickname: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

/** 관리자 - 신고 처리 요청 */
export interface ProcessReportRequest {
  action: 'DELETE_POST' | 'SUSPEND_USER' | 'REJECT';
}

/** 관리자 - 공지 작성/수정 요청 */
export interface AdminNoticeRequest {
  title: string;
  content: string;
  isPinned: boolean;
  boardIds: number[];
}

/** 관리자 - 공지 목록 아이템 */
export interface AdminNotice {
  id: number;
  title: string;
  isPinned: boolean;
  viewCount: number;
  createdAt: string;
}

/** 관리자 - 문의 목록 아이템 */
export interface AdminInquiry {
  id: number;
  type: 'GENERAL' | 'BUG' | 'SUGGESTION';
  title: string;
  nickname: string;
  status: 'PENDING' | 'ANSWERED';
  createdAt: string;
}

/** 관리자 - 문의 답변 요청 */
export interface AnswerInquiryRequest {
  content: string;
}

/** 관리자 - 요청 목록 아이템 */
export interface AdminRequest {
  id: number;
  type: 'SPORT' | 'TEAM';
  name: string;
  nickname: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

/** 관리자 - 요청 처리 */
export interface ProcessRequestRequest {
  action: 'APPROVE' | 'REJECT';
  rejectReason?: string;
}
