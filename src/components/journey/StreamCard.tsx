'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface StreamCardProps {
  label: string;
  years: number;
  color: string;
  description: string;
  skills: readonly string[];
  onHover: (hovered: boolean) => void;
  onClick: () => void;
  isRevealed: boolean;
  testimonial?: { quote: string; author: string; role: string };
}

export function StreamCard({
  label,
  years,
  color,
  description,
  skills,
  onHover,
  onClick,
  isRevealed,
  testimonial,
}: StreamCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      className={cn(
        'glass relative flex h-full w-full flex-col cursor-pointer rounded-xl p-4 text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none sm:p-6',
        isRevealed && 'ring-1'
      )}
      style={{
        borderColor: hovered ? color : undefined,
        boxShadow: hovered
          ? `0 0 30px ${color}33, inset 0 0 30px ${color}11`
          : undefined,
        outlineColor: isRevealed ? color : undefined,
      }}
      onMouseEnter={() => {
        setHovered(true);
        onHover(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        onHover(false);
      }}
      onClick={onClick}
      aria-label={isRevealed ? `${label}: collapse skills` : `${label}: reveal skills`}
      aria-expanded={isRevealed}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="mb-3 flex items-baseline justify-between">
        <span
          className="font-mono text-xs tracking-[0.3em] uppercase"
          style={{ color }}
        >
          {label}
        </span>
        <span
          className="font-mono text-3xl font-bold bloom-text"
          style={{ color }}
        >
          {years}
          <span className="ml-1 text-sm font-normal opacity-60">yrs</span>
        </span>
      </div>

      <p className="flex-1 text-sm leading-relaxed text-foreground/70">
        {description}
      </p>

      {!isRevealed && (
        <div
          className="mt-4 text-center font-mono text-xs tracking-wider"
          style={{ color: `${color}88` }}
        >
          [ CLICK TO REVEAL SKILLS ]
        </div>
      )}

      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-wrap gap-2 pt-4">
              {skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="rounded-md px-3 py-1.5 font-mono text-xs tracking-wide"
                  style={{
                    background: `${color}18`,
                    border: `1px solid ${color}44`,
                    color,
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
            {testimonial && (
              <motion.blockquote
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: skills.length * 0.05 + 0.15,
                  duration: 0.4,
                }}
                className="mt-4 border-l-2 pl-3"
                style={{ borderColor: `${color}AA` }}
              >
                <p className="text-[12px] italic leading-relaxed text-foreground/60 sm:text-[13px]">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <footer className="mt-1 text-[11px]">
                  <span style={{ color }}>{testimonial.author}</span>
                  <span className="text-foreground/50"> — {testimonial.role}</span>
                </footer>
              </motion.blockquote>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
