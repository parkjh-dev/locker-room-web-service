import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestApi } from '../api/requestApi';
import type { CreateRequestRequest } from '../types/request';

export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRequestRequest) => requestApi.createRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}
