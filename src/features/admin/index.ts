// admin module public API

// Hooks
export { useAdminDashboard } from './hooks/useAdminDashboard';
export { useAdminInquiries } from './hooks/useAdminInquiries';
export { useAdminNotices } from './hooks/useAdminNotices';
export { useAdminReports } from './hooks/useAdminReports';
export { useAdminRequests } from './hooks/useAdminRequests';
export { useAdminUsers } from './hooks/useAdminUsers';

// Components
export { Dashboard } from './components/Dashboard';
export { InquiryManagement } from './components/InquiryManagement';
export { NoticeManagement } from './components/NoticeManagement';
export { ReportManagement } from './components/ReportManagement';
export { RequestManagement } from './components/RequestManagement';
export { SuspendModal } from './components/SuspendModal';
export { UserManagement } from './components/UserManagement';

// Types
export type {
  AdminDashboardSummary,
  AdminUser,
  SuspendUserRequest,
  AdminReport,
  ProcessReportRequest,
  AdminNoticeRequest,
  AdminNotice,
  AdminInquiry,
  AnswerInquiryRequest,
  AdminRequest,
  ProcessRequestRequest,
} from './types/admin';
