import type { UseFormSetError, FieldValues, Path } from 'react-hook-form';
import type { FieldError } from '@/types/api';

/**
 * 서버 400 응답의 field errors를 react-hook-form setError로 매핑
 */
export function applyFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
) {
  const err = error as { response?: { status?: number; data?: { data?: { errors?: FieldError[] } } } };
  if (err.response?.status === 400 && err.response.data?.data?.errors) {
    for (const fieldError of err.response.data.data.errors) {
      setError(fieldError.field as Path<T>, { message: fieldError.message });
    }
    return true;
  }
  return false;
}
