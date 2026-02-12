'use client';

import { useReducedMotionToggle } from '@/lib/hooks/useReducedMotion';
import { useToast } from '@/components/ui/Toast';

export function MotionToggle() {
  const { isReduced, toggle } = useReducedMotionToggle();
  const toast = useToast();

  return (
    <button
      onClick={() => {
        toggle();
        toast(isReduced ? 'Animations enabled' : 'Animations disabled');
      }}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-accent/20 bg-transparent transition-all hover:border-accent/40 sm:h-auto sm:w-auto sm:px-3 sm:py-1.5"
      aria-label={isReduced ? 'Enable animations' : 'Disable animations'}
      title={isReduced ? 'Animations off' : 'Animations on'}
    >
      {isReduced ? (
        <svg className="h-4 w-4 text-foreground/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8" />
        </svg>
      ) : (
        <svg className="h-4 w-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      )}
    </button>
  );
}
