import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/hero/HeroSection';
import { BelowFold } from '@/components/layout/BelowFold';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { CursorTrail } from '@/components/ui/CursorTrail';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { ChatWidgetLoader } from '@/components/ui/ChatWidgetLoader';
import { getMediumPosts } from '@/lib/medium';

const ScrollProgress = dynamic(() => import('@/components/layout/ScrollProgress').then(m => m.ScrollProgress), { ssr: false });
const KonamiOverlay = dynamic(() => import('@/components/ui/KonamiOverlay').then(m => m.KonamiOverlay), { ssr: false });
const SmartCTA = dynamic(() => import('@/components/ui/SmartCTA').then(m => m.SmartCTA), { ssr: false });

export const revalidate = 3600;

export default async function Home() {
  const posts = await getMediumPosts(3);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-background focus:outline-none"
      >
        Skip to main content
      </a>
      <Header />
      <ScrollProgress />
      <KonamiOverlay />
      <CursorTrail />
      <ScrollToTop />
      <SmartCTA />
      <ChatWidgetLoader />
      <main id="main-content">
        <HeroSection />
        <BelowFold posts={posts} />
      </main>
      <Footer />
    </>
  );
}
