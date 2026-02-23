import { useEffect, useRef } from 'react';

export function useInfiniteScroll(onIntersect: () => void, options: { enabled: boolean }) {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!options.enabled || !targetRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onIntersect();
      },
      { threshold: 0.1 },
    );

    observer.observe(targetRef.current);
    return () => observer.disconnect();
  }, [options.enabled, onIntersect]);

  return targetRef;
}
