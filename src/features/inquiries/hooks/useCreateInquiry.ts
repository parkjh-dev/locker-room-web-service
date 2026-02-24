import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inquiryApi } from '../api/inquiryApi';
import type { CreateInquiryRequest } from '../types/inquiry';

export function useCreateInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInquiryRequest) => inquiryApi.createInquiry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
}
