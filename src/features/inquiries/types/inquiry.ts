import type { FileInfo } from '@/features/posts/types/post';

/** 문의 유형 */
export type InquiryType = 'GENERAL' | 'BUG' | 'SUGGESTION';

/** 문의 상태 */
export type InquiryStatus = 'PENDING' | 'ANSWERED';

/** 문의 목록 아이템 (백엔드 InquiryListResponse 매칭) */
export interface InquiryListItem {
  id: number;
  type: InquiryType;
  title: string;
  status: InquiryStatus;
  createdAt: string;
}

/** 관리자 답변 (백엔드 InquiryReplyResponse 매칭) */
export interface InquiryReply {
  id: number;
  adminNickname: string;
  content: string;
  createdAt: string;
}

/** 문의 상세 (백엔드 InquiryDetailResponse 매칭) */
export interface InquiryDetail {
  id: number;
  type: InquiryType;
  title: string;
  content: string;
  status: InquiryStatus;
  files: FileInfo[];
  replies: InquiryReply[];
  createdAt: string;
}

/** 문의 작성 요청 (백엔드 InquiryCreateRequest 매칭) */
export interface CreateInquiryRequest {
  type: InquiryType;
  title: string;
  content: string;
  fileIds?: number[];
}
