import type { Attachment } from '@/features/posts/types/post';

/** 문의 유형 */
export type InquiryType = 'GENERAL' | 'BUG' | 'SUGGESTION';

/** 문의 상태 */
export type InquiryStatus = 'PENDING' | 'ANSWERED';

/** 문의 목록 아이템 */
export interface InquiryListItem {
  id: number;
  type: InquiryType;
  title: string;
  status: InquiryStatus;
  createdAt: string;
}

/** 관리자 답변 */
export interface InquiryAnswer {
  id: number;
  content: string;
  createdAt: string;
}

/** 문의 상세 */
export interface InquiryDetail {
  id: number;
  type: InquiryType;
  title: string;
  content: string;
  status: InquiryStatus;
  attachments: Attachment[];
  answer: InquiryAnswer | null;
  createdAt: string;
}

/** 문의 작성 요청 */
export interface CreateInquiryRequest {
  type: InquiryType;
  title: string;
  content: string;
  attachmentIds?: number[];
}
