'use client';

import { useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'cb-engagement-data';

interface EngagementData {
  sectionTime: Record<string, number>;
  scrollDepth: number;
  ctaClicks: Record<string, number>;
  paletteUsage: Record<string, number>;
  lastUpdated: string;
}

function getStoredData(): EngagementData {
  if (typeof window === 'undefined') return defaultData();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    /* ignore */
  }
  return defaultData();
}

function defaultData(): EngagementData {
  return {
    sectionTime: {},
    scrollDepth: 0,
    ctaClicks: {},
    paletteUsage: {},
    lastUpdated: new Date().toISOString(),
  };
}

export function useEngagementTracker() {
  const dataRef = useRef<EngagementData>(getStoredData());
  const activeSectionRef = useRef<string | null>(null);
  const sectionStartRef = useRef<number>(0);

  const save = useCallback(() => {
    dataRef.current.lastUpdated = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataRef.current));
    } catch {
      /* ignore */
    }
  }, []);

  const trackSectionView = useCallback(
    (sectionId: string) => {
      const now = Date.now();
      if (activeSectionRef.current) {
        const elapsed = (now - sectionStartRef.current) / 1000;
        const prev = dataRef.current.sectionTime[activeSectionRef.current] ?? 0;
        dataRef.current.sectionTime[activeSectionRef.current] = prev + elapsed;
      }
      activeSectionRef.current = sectionId;
      sectionStartRef.current = now;
      save();
    },
    [save]
  );

  const trackScrollDepth = useCallback(
    (depth: number) => {
      if (depth > dataRef.current.scrollDepth) {
        dataRef.current.scrollDepth = depth;
        save();
      }
    },
    [save]
  );

  const trackCtaClick = useCallback(
    (ctaId: string) => {
      const prev = dataRef.current.ctaClicks[ctaId] ?? 0;
      dataRef.current.ctaClicks[ctaId] = prev + 1;
      save();
    },
    [save]
  );

  const trackPaletteUsage = useCallback(
    (paletteId: string) => {
      const prev = dataRef.current.paletteUsage[paletteId] ?? 0;
      dataRef.current.paletteUsage[paletteId] = prev + 1;
      save();
    },
    [save]
  );

  // Track scroll depth
  useEffect(() => {
    const handler = () => {
      const depth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      trackScrollDepth(depth);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [trackScrollDepth]);

  // Save on unload
  useEffect(() => {
    const handler = () => save();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [save]);

  return {
    trackSectionView,
    trackScrollDepth,
    trackCtaClick,
    trackPaletteUsage,
    getData: () => dataRef.current,
  };
}
