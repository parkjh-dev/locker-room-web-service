import { create } from 'zustand';
import type { UserTeam } from '@/types/common';

export interface AuthUser {
  id: number;
  email: string;
  emailVerified: boolean;
  nickname: string;
  role: 'USER' | 'ADMIN';
  teams: UserTeam[];
  /** 온보딩 완료 시각. null이면 첫 로그인 — /onboarding/teams로 안내 */
  onboardingCompletedAt: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;

  setTokens: (access: string, refresh: string) => void;
  setUser: (user: AuthUser) => void;
  patchUser: (patch: Partial<AuthUser>) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,

  setTokens: (access, refresh) =>
    set({ accessToken: access, refreshToken: refresh, isAuthenticated: true }),

  setUser: (user) => set({ user }),

  patchUser: (patch) =>
    set((state) => (state.user ? { user: { ...state.user, ...patch } } : state)),

  clear: () => {
    if (typeof window !== 'undefined') {
      // 다음 로그인 시 다시 온보딩 안내가 가능하도록 세션 플래그 초기화
      window.sessionStorage.removeItem('lr.onboarding_redirect_shown');
    }
    set({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
    });
  },
}));
