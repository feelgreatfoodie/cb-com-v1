'use client';

import { motion } from 'framer-motion';
import { competencies } from '@/config/content';
import { RadialHub } from './RadialHub';
import { fadeInUp, staggerContainer } from '@/lib/animations/scroll-variants';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

function CompetencyCard({ item }: { item: (typeof competencies.hub)[number] }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="glass rounded-xl p-5 text-center"
      whileHover={{ y: -4 }}
    >
      <p className="font-mono text-sm font-bold tracking-wide text-foreground">
        {item.label}
      </p>
    </motion.div>
  );
}

export function CompetencyHubSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="competencies"
      className="relative min-h-screen bg-background py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="mb-16 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.p
            variants={fadeInUp}
            className="mb-4 font-mono text-xs tracking-[0.4em] text-accent/60"
          >
            {competencies.title}
          </motion.p>
        </motion.div>

        {/* Desktop: radial SVG hub */}
        <div className="hidden md:block">
          <RadialHub items={competencies.hub} />
        </div>

        {/* Mobile: 2-col card grid */}
        <motion.div
          className="grid grid-cols-2 gap-4 md:hidden"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {competencies.hub.map((item) => (
            <CompetencyCard key={item.id} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
