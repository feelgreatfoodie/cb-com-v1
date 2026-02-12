'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const DOT_COUNT = 6;
const SPRING = 0.15;

interface Dot {
  x: number;
  y: number;
  el: HTMLDivElement;
}

export function CursorTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    // Detect touch device
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const container = containerRef.current;
    if (!container) return;

    const mouse = { x: 0, y: 0 };
    let rafId = 0;

    // Create dots
    const dots: Dot[] = [];
    for (let i = 0; i < DOT_COUNT; i++) {
      const el = document.createElement('div');
      el.style.cssText = `
        position: fixed;
        top: -4px;
        left: -4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--accent);
        pointer-events: none;
        z-index: 9998;
        opacity: ${1 - i * (0.8 / DOT_COUNT)};
        transform: translate(-100px, -100px);
        will-change: transform;
      `;
      container.appendChild(el);
      dots.push({ x: -100, y: -100, el });
    }

    function animate() {
      const { x, y } = mouse;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        if (i === 0) {
          dot.x += (x - dot.x) * SPRING;
          dot.y += (y - dot.y) * SPRING;
        } else {
          const prev = dots[i - 1];
          dot.x += (prev.x - dot.x) * SPRING;
          dot.y += (prev.y - dot.y) * SPRING;
        }
        dot.el.style.transform = `translate(${dot.x}px, ${dot.y}px)`;
      }

      rafId = requestAnimationFrame(animate);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
      dots.forEach((d) => d.el.remove());
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return <div ref={containerRef} aria-hidden="true" />;
}
