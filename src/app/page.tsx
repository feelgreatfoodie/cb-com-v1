import { HeroSection } from '@/components/hero/HeroSection';
import { JourneySection } from '@/components/journey/JourneySection';
import { CompetencyHubSection } from '@/components/competencies/CompetencyHubSection';
import { OpenToSection } from '@/components/opento/OpenToSection';
import { WorkshopSection } from '@/components/workshop/WorkshopSection';
import { BossFightSection } from '@/components/bossfight/BossFightSection';
import { ImplementationSection } from '@/components/implementation/ImplementationSection';
import { OneSheeterSection } from '@/components/download/OneSheeterSection';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { KonamiOverlay } from '@/components/ui/KonamiOverlay';
import { CursorTrail } from '@/components/ui/CursorTrail';

export default function Home() {
  return (
    <>
      <Header />
      <ScrollProgress />
      <KonamiOverlay />
      <CursorTrail />
      <main>
        <HeroSection />
        <JourneySection />
        <CompetencyHubSection />
        <OpenToSection />
        <WorkshopSection />
        <BossFightSection />
        <ImplementationSection />
        <OneSheeterSection />
      </main>
      <Footer />
    </>
  );
}
