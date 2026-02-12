'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  type PaletteColors,
  hexToInt,
  getPalette,
} from '@/config/palettes';

const STORAGE_KEY = 'cb-palette-id';

interface PaletteContext {
  paletteId: string;
  colors: PaletteColors;
  int: Record<keyof PaletteColors, number>;
  switchPalette: (id: string) => void;
}

const Ctx = createContext<PaletteContext | null>(null);

function applyColorsToDOM(colors: PaletteColors) {
  const root = document.documentElement;
  root.style.setProperty('--background', colors.background);
  root.style.setProperty('--background-light', colors.backgroundLight);
  root.style.setProperty('--accent', colors.accent);
  root.style.setProperty('--cta', colors.cta);
  root.style.setProperty('--foreground', colors.foreground);
  root.style.setProperty('--stream1', colors.stream1);
  root.style.setProperty('--stream2', colors.stream2);
  root.style.setProperty('--stream3', colors.stream3);
}

function computeInts(colors: PaletteColors) {
  return Object.fromEntries(
    Object.entries(colors).map(([k, v]) => [k, hexToInt(v)])
  ) as Record<keyof PaletteColors, number>;
}

export function ThemeProvider({
  paletteId: serverPaletteId,
  colors: serverColors,
  children,
}: {
  paletteId: string;
  colors: PaletteColors;
  children: ReactNode;
}) {
  const [paletteId, setPaletteId] = useState(() => {
    if (typeof window === 'undefined') return serverPaletteId;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const palette = getPalette(stored);
        if (palette.id === stored) return stored;
      }
    } catch { /* localStorage unavailable */ }
    return serverPaletteId;
  });

  const initialColors = paletteId !== serverPaletteId
    ? getPalette(paletteId).colors
    : serverColors;

  const [colors, setColors] = useState(initialColors);
  const [int, setInt] = useState(() => computeInts(initialColors));

  // Apply localStorage override to DOM on mount
  useEffect(() => {
    if (paletteId !== serverPaletteId) {
      applyColorsToDOM(colors);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const switchPalette = useCallback((id: string) => {
    const palette = getPalette(id);
    setPaletteId(palette.id);
    setColors(palette.colors);
    setInt(computeInts(palette.colors));
    applyColorsToDOM(palette.colors);
    try {
      localStorage.setItem(STORAGE_KEY, palette.id);
    } catch {
      // localStorage unavailable
    }
  }, []);

  return (
    <Ctx.Provider value={{ paletteId, colors, int, switchPalette }}>
      {children}
    </Ctx.Provider>
  );
}

export function usePalette() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('usePalette must be used within ThemeProvider');
  return ctx;
}
