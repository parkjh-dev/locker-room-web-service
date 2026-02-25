/** 요청 유형 */
export type RequestType = 'SPORT' | 'TEAM';

/** 요청 상태 */
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

/** 요청 목록 아이템 (백엔드 RequestListResponse 매칭) */
export interface RequestListItem {
  id: number;
  type: RequestType;
  name: string;
  status: RequestStatus;
  createdAt: string;
}

/** 요청 상세 (백엔드 RequestDetailResponse 매칭) */
export interface RequestDetail {
  id: number;
  type: RequestType;
  name: string;
  reason: string;
  status: RequestStatus;
  rejectReason: string | null;
  processedAt: string | null;
  createdAt: string;
}

/** 요청 작성 */
export interface CreateRequestRequest {
  type: RequestType;
  name: string;
  reason: string;
}
