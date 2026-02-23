export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export interface CursorPageResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasNext: boolean;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ValidationErrorData {
  errors: FieldError[];
}

export interface CursorPageParams {
  cursor?: string;
  size?: number;
  sort?: 'created_at' | 'like_count';
}

export interface SearchParams extends CursorPageParams {
  keyword?: string;
  searchType?: 'TITLE' | 'CONTENT' | 'TITLE_CONTENT' | 'NICKNAME';
}
