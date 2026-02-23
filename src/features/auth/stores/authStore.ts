import { create } from 'zustand';
import type { UserTeam } from '@/types/common';

export interface AuthUser {
  userId: number;
  email: string;
  nickname: string;
  role: 'USER' | 'ADMIN';
  teams: UserTeam[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;

  setTokens: (access: string, refresh: string) => void;
  setUser: (user: AuthUser) => void;
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

  clear: () =>
    set({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
    }),
}));
