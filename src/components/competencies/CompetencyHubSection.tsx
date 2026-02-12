'use client';

import { motion } from 'framer-motion';
import { competencies } from '@/config/content';
import { RadialHub } from './RadialHub';
import { fadeInUp, staggerContainer } from '@/lib/animations/scroll-variants';

export function CompetencyHubSection() {
  return (
    <section
      id="competencies"
      className="relative min-h-[70vh] bg-background py-16 sm:min-h-screen sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          className="mb-8 text-center sm:mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2
            variants={fadeInUp}
            className="font-mono text-2xl font-bold tracking-[0.15em] text-foreground sm:text-3xl md:text-4xl"
          >
            {competencies.title}
          </motion.h2>
        </motion.div>

        {/* Radial SVG hub — scales naturally via viewBox on all sizes */}
        <RadialHub items={competencies.hub} />
      </div>
    </section>
  );
}
