'use client';

import { motion } from 'framer-motion';
import { implementation } from '@/config/content';
import { SkillPill } from './SkillPill';
import { CertBadge } from './CertBadge';
import { fadeInUp, staggerContainer } from '@/lib/animations/scroll-variants';

export function ImplementationSection() {
  return (
    <section id="implementation" className="relative bg-background py-24">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          className="mb-16 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2
            variants={fadeInUp}
            className="mb-4 font-mono text-3xl font-bold tracking-[0.15em] text-foreground sm:text-4xl"
          >
            {implementation.title}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="font-mono text-sm text-foreground/50"
          >
            {implementation.subtitle}
          </motion.p>
        </motion.div>

        {/* Skill pills grid */}
        <div className="mb-16 flex flex-wrap justify-center gap-3">
          {implementation.skills.map((skill, i) => (
            <SkillPill
              key={skill.name}
              name={skill.name}
              category={skill.category}
              index={i}
            />
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {implementation.certifications.map((cert) => (
            <CertBadge key={cert.name} name={cert.name} badge={cert.badge} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
