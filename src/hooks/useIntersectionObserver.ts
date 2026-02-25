import { useEffect, useRef } from 'react';

interface UseIntersectionObserverOptions {
  /** IntersectionObserver threshold (0~1 or array) */
  threshold?: number | number[];
  /** IntersectionObserver rootMargin (e.g. '0px', '100px 0px') */
  rootMargin?: string;
  /** IntersectionObserver root element */
  root?: Element | null;
  /** Whether the observer is enabled */
  enabled?: boolean;
}

export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  callback: (entry: IntersectionObserverEntry) => void,
  options: UseIntersectionObserverOptions = {},
) {
  const { threshold = 0, rootMargin, root, enabled = true } = options;
  const targetRef = useRef<T>(null);

  useEffect(() => {
    if (!enabled || !targetRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          callback(entry);
        });
      },
      { threshold, rootMargin, root },
    );

    observer.observe(targetRef.current);
    return () => observer.disconnect();
  }, [enabled, callback, threshold, rootMargin, root]);

  return targetRef;
}
