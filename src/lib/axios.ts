import axios from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/stores/authStore';
import keycloak from '@/lib/keycloak';

const ERROR_MESSAGES: Record<string, string> = {
  COMMON_RATE_LIMIT_EXCEEDED: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  COMMON_INTERNAL_ERROR: '서버 오류가 발생했습니다.',
  POST_ALREADY_REPORTED: '이미 신고한 게시글입니다.',
  POST_ACCESS_DENIED: '접근 권한이 없습니다.',
  FILE_SIZE_EXCEEDED: '파일 크기가 초과되었습니다.',
  FILE_TYPE_NOT_ALLOWED: '허용되지 않은 파일 형식입니다.',
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터: Authorization 헤더 + POST 멱등성 키
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (config.method === 'post') {
    config.headers['Idempotency-Key'] = crypto.randomUUID();
  }

  return config;
});

// Response 인터셉터: 토큰 갱신, 에러 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401: 토큰 갱신 시도 → 실패 시 로그인 리다이렉트
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await keycloak.updateToken(5);
        const { setTokens } = useAuthStore.getState();
        if (keycloak.token && keycloak.refreshToken) {
          setTokens(keycloak.token, keycloak.refreshToken);
        }
        originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;
        return api(originalRequest);
      } catch {
        useAuthStore.getState().clear();
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }
    }

    const status = error.response?.status;
    const errorCode = error.response?.data?.code;

    // 403: 정지 계정 또는 권한 없음
    if (status === 403) {
      if (errorCode === 'USER_SUSPENDED') {
        const data = error.response.data?.data;
        const params = new URLSearchParams();
        if (data?.reason) params.set('reason', data.reason);
        if (data?.suspendedUntil) params.set('until', data.suspendedUntil);
        const qs = params.toString();
        window.location.href = `/suspended${qs ? `?${qs}` : ''}`;
        return Promise.reject(error);
      }
      toast.error('접근 권한이 없습니다.');
      return Promise.reject(error);
    }

    // 409: 충돌 에러
    if (status === 409) {
      const message =
        ERROR_MESSAGES[errorCode] ||
        error.response?.data?.message ||
        '요청이 충돌했습니다. 다시 시도해주세요.';
      toast.error(message);
      return Promise.reject(error);
    }

    // 429: Rate limit
    if (status === 429) {
      toast.error('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
      return Promise.reject(error);
    }

    // 500+: 서버 오류
    if (status && status >= 500) {
      toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      return Promise.reject(error);
    }

    // 그 외 공통 에러 Toast (400, 404 등)
    const message = ERROR_MESSAGES[errorCode] || error.response?.data?.message;
    if (message && status !== 401 && status !== 400) {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default api;
