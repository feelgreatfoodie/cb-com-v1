'use client';

import dynamic from 'next/dynamic';

const ScrollProgress = dynamic(
  () => import('@/components/layout/ScrollProgress').then(m => m.ScrollProgress),
  { ssr: false }
);
const KonamiOverlay = dynamic(
  () => import('@/components/ui/KonamiOverlay').then(m => m.KonamiOverlay),
  { ssr: false }
);
const SmartCTA = dynamic(
  () => import('@/components/ui/SmartCTA').then(m => m.SmartCTA),
  { ssr: false }
);

export function ClientOverlays() {
  return (
    <>
      <ScrollProgress />
      <KonamiOverlay />
      <SmartCTA />
    </>
  );
}
