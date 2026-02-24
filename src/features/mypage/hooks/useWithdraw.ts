import { useMutation } from '@tanstack/react-query';
import { userApi } from '../api/userApi';
import { useAuthStore } from '@/features/auth/stores/authStore';
import type { WithdrawRequest } from '../types/user';

export function useWithdraw() {
  const { clear } = useAuthStore();

  return useMutation({
    mutationFn: (data: WithdrawRequest) => userApi.deleteMe(data),
    onSuccess: () => {
      clear();
      window.location.href = '/auth/login';
    },
  });
}
