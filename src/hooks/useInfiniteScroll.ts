import { useIntersectionObserver } from './useIntersectionObserver';

export function useInfiniteScroll(onIntersect: () => void, options: { enabled: boolean }) {
  const targetRef = useIntersectionObserver<HTMLDivElement>(
    (entry) => {
      if (entry.isIntersecting) onIntersect();
    },
    {
      threshold: 0.1,
      enabled: options.enabled,
    },
  );

  return targetRef;
}
