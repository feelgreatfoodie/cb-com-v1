'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export function useScrollProgress(ref?: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  const rafId = useRef<number>(0);

  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (ref?.current) {
        const el = ref.current;
        const rect = el.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        const p = Math.max(0, Math.min(1, -rect.top / (rect.height - viewHeight)));
        setProgress(p);
      } else {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
      }
    });
  }, [ref]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [handleScroll]);

  return progress;
}
