'use client';

import { motion } from 'framer-motion';

interface ProjectCardProps {
  name: string;
  description: string;
  problem: string;
  whyNow: string;
  tags: readonly string[];
}

export function ProjectCard({
  name,
  description,
  problem,
  whyNow,
  tags,
}: ProjectCardProps) {
  return (
    <motion.div
      className="glass group rounded-xl p-6 transition-all duration-300"
      whileHover={{
        boxShadow: '0 0 40px rgba(30, 144, 255, 0.15)',
        borderColor: 'rgba(30, 144, 255, 0.4)',
      }}
    >
      <h3 className="mb-1 font-mono text-lg font-bold text-[#E2725B]">
        {name}
      </h3>
      <p className="mb-4 text-sm text-[#F8F9FA]/60">{description}</p>

      <div className="mb-3">
        <span className="font-mono text-[10px] tracking-[0.3em] text-[#1E90FF]/50">
          PROBLEM
        </span>
        <p className="mt-1 text-sm leading-relaxed text-[#F8F9FA]/80">
          {problem}
        </p>
      </div>

      <div className="mb-4">
        <span className="font-mono text-[10px] tracking-[0.3em] text-[#1E90FF]/50">
          WHY NOW
        </span>
        <p className="mt-1 text-sm leading-relaxed text-[#F8F9FA]/80">
          {whyNow}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-[#1E90FF]/10 px-2 py-1 font-mono text-[10px] tracking-wide text-[#1E90FF]/70"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
