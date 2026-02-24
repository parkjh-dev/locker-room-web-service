import { useQuery } from '@tanstack/react-query';
import { boardApi } from '../api/boardApi';

export function useBoards() {
  return useQuery({
    queryKey: ['boards'],
    queryFn: boardApi.getBoards,
  });
}
