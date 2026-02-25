// inquiries module public API

// Hooks
export { useInquiries } from './hooks/useInquiries';
export { useCreateInquiry } from './hooks/useCreateInquiry';

// Components
export { InquiryList } from './components/InquiryList';
export { InquiryDetail } from './components/InquiryDetail';
export { InquiryForm } from './components/InquiryForm';

// Types
export type {
  InquiryType,
  InquiryStatus,
  InquiryListItem,
  InquiryAnswer,
  InquiryDetail as InquiryDetailType,
  CreateInquiryRequest,
} from './types/inquiry';
