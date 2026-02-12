# Christian Bourlier — Personal Branding Website

## Quick Context
Next.js 16 single-page portfolio site for Christian Bourlier, positioning as a **Technical Solutions Partner**. Dark-themed, gamified UX with 3D hero, multi-palette system, and glassmorphism design language.

## Commands
```bash
npm run dev          # Local dev server
npx tsc --noEmit     # Type check
npx eslint src/      # Lint (0 errors, 0 warnings as of Feb 2026)
npx vitest           # Unit tests
npx playwright test  # E2E tests
```

## Architecture

### Stack
- **Framework**: Next.js 16, App Router, TypeScript
- **Styling**: Tailwind CSS 4 with CSS custom properties for palette system
- **3D**: Three.js (hero river scene, NoteHighway particles)
- **Animation**: Framer Motion
- **State**: Zustand (quest state, reduced motion)
- **Analytics**: GA4 (gated behind cookie consent)
- **API**: Google Sheets (contact form), Medium RSS (blog posts)
- **CI**: GitHub Actions (lint, typecheck, test, build)

### Section Order (single page)
1. Hero — 3D river scene, headline, CTA
2. Journey — Three stream cards (Data/Sales/Poker) with skill reveals
3. Competencies — Radial hub SVG
4. Open To — 4 role cards
5. Workshop — Project cards (click-to-unfurl previews) + video demos
6. Boss Fight — Testimonial carousel, equation reveal, architecture map
7. Implementation — Skills pills + GCP cert badges
8. Writing — Medium blog cards (fetched via RSS)
9. One-Sheeter — PDF preview + download
10. Contact — Form → Google Sheets

### Key Patterns

**Palette System**: 8 themes stored in `src/config/palettes.ts`. CSS vars set on `<html>`, switchable at runtime via `ThemeProvider`. User choice persisted to localStorage.

**Dynamic Imports**: All below-fold sections loaded via `next/dynamic` in `BelowFold.tsx` with gradient loading placeholders to reduce initial bundle.

**Glassmorphism**: `.glass` utility class in `globals.css` — semi-transparent bg with backdrop-blur and accent border.

**Cookie Consent**: GA4 scripts only load after user accepts via `CookieConsent.tsx`. Analytics helpers (`trackEvent`, `reportWebVitals`) gracefully no-op when `window.gtag` is undefined.

**Toast Notifications**: `ToastProvider` wraps the app. Use `useToast()` hook from any client component. Auto-dismiss after 2.5s.

**Service Worker**: `public/sw.js` — network-first for navigation, cache-first for static assets. Registered via inline script in layout.

### File Organization
```
src/
  app/            # Pages, layout, globals, API routes, error boundaries
  components/
    hero/         # HeroSection, RiverScene, CanvasErrorBoundary
    journey/      # JourneySection, StreamCard, NoteHighway
    competencies/ # CompetencyHubSection, RadialHub
    opento/       # OpenToSection, RoleCard
    workshop/     # WorkshopSection, ProjectCard, TypewriterCLI, VideoCard
    bossfight/    # BossFightSection, TestimonialCarousel, EquationVisual
    implementation/ # ImplementationSection, CertBadge
    writing/      # WritingSection, BlogCard
    download/     # OneSheeterSection, PDFPreview
    contact/      # ContactSection
    layout/       # Header, Footer, ScrollProgress, BelowFold, WebVitals
    ui/           # Button, GlowText, CursorTrail, KonamiOverlay, ScrollToTop, CookieConsent, Toast
  config/         # content.ts (all copy), palettes.ts, onesheet-map.ts
  lib/
    hooks/        # useReducedMotion, useActiveSection, useQuestStore, etc.
    three/        # SceneManager, river-shader, particle-system, ambient-stream
    analytics.ts  # trackEvent wrapper
    web-vitals.ts # CWV reporting to GA4
    medium.ts     # RSS feed parser
    palette-context.tsx
  types/          # gtag.d.ts
```

## Anti-Patterns to Avoid

1. **Never use `<img>` — always `Next/Image`**. This project enforces the `@next/next/no-img-element` ESLint rule. Use `unoptimized` prop for external URLs (YouTube, Medium CDN).

2. **Never call `setState` inside `useEffect`** for initialization. Use lazy state initializers: `useState(() => getInitialValue())`. The ESLint rule `react-hooks/set-state-in-effect` catches this.

3. **Never create arrays/objects in component body that are useCallback/useEffect deps**. Move them inside the callback or wrap in `useMemo`. Example: `streamColors` was recreated every render causing NoteHighway to re-init.

4. **Keep `text-[Xpx]` >= 11px**. Below that fails readability on low-DPI screens. The previous `text-[10px]` and `text-[9px]` were bumped to `text-[11px]`.

5. **Keep text opacity >= `/50` for content, `/60` for interactive elements**. Lower values fail WCAG AA contrast on dark backgrounds.

6. **Don't hide sections on data fetch failure**. Show ghost/placeholder cards instead (see `WritingSection` fallback pattern). Keep nav anchors and CTAs always accessible.

7. **Gate analytics behind consent**. Never load GA scripts unconditionally. Use `CookieConsent.tsx` pattern — localStorage flag + conditional `<Script>` rendering.

## Accessibility Checklist
- [x] Skip link ("Skip to main content")
- [x] `aria-label` + `aria-expanded` on all toggle buttons
- [x] Focus trapping in mobile menu
- [x] `prefers-reduced-motion` respected + manual toggle
- [x] Focus-visible ring on all interactive elements
- [x] Semantic heading hierarchy (h1 in hero, h2 per section)
- [x] Alt text on all images
- [x] `aria-live="polite"` on toast container
- [x] `role="region"` + `aria-roledescription="carousel"` on testimonials

## SEO
- JSON-LD: Person, WebSite, BreadcrumbList, 3x Review schemas
- Open Graph + Twitter Card meta
- Sitemap, robots.txt, canonical URL
- Preconnect: YouTube, ytimg, Medium CDN
