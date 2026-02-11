# Architecture

Technical architecture decisions and patterns for the Ribeira Quest site.

## Rendering Strategy

- **Server Components by default.** `layout.tsx` and `page.tsx` are async server components that read palette state from Vercel Edge Config at request time.
- **Client Components where needed.** Any component using hooks, event handlers, or browser APIs is marked `'use client'`. These include all animated sections, the palette switcher, and form components.
- **Edge Runtime for images.** `opengraph-image.tsx` and `twitter-image.tsx` use Next.js edge runtime to generate dynamic PNG social cards at request time.

## Palette System

Two-layer theme architecture with zero flash of wrong colors:

```
Request → layout.tsx reads Edge Config → injects CSS vars on <html>
                                          ↓
                                    Tailwind @theme inline maps vars to utilities
                                          ↓
                                    ThemeProvider checks localStorage for visitor override
                                          ↓
                                    usePalette() exposes hex values + Three.js integers
```

Server-rendered palette loads instantly. Visitor override applies on hydration with no visible flash because CSS custom properties update in a single paint.

## Animation Architecture

### Scroll-triggered animations

All scroll-triggered animations use **`useInView`** from framer-motion on a wrapper DOM element (typically a `<div>`), then conditionally set `animate` on children:

```tsx
const ref = useRef(null);
const isInView = useInView(ref, { once: true });

return (
  <div ref={ref}>
    <motion.div animate={isInView ? { opacity: 1 } : { opacity: 0 }} />
  </div>
);
```

This pattern replaced per-element `whileInView` which failed on mobile browsers when applied to SVG children (IntersectionObserver doesn't reliably observe SVG sub-elements on iOS Safari).

### Stagger pattern

Parent containers use `variants={staggerContainer}` with `initial="hidden"` / `whileInView="visible"`. Children use `variants={fadeInUp}` and inherit timing from the parent's `staggerChildren` configuration. Defined in `src/lib/animations/scroll-variants.ts`.

## Three.js Integration

Three.js scenes (`RiverScene`, `NoteHighway`) are isolated in `src/lib/three/` as pure functions that receive a canvas element and palette colors. They:

- Scale particle counts by device type (`useDeviceType` hook)
- Disable entirely when `prefers-reduced-motion` is active (CSS gradient fallback)
- Clean up via returned dispose functions called in `useEffect` cleanup

## SEO Schema

`layout.tsx` embeds a JSON-LD `@graph` with two nodes:

1. **Person** — `@id` anchored, multi-value `jobTitle`, `hasCredential` (GCP certs), `hasOccupation` (with location + skills), `knowsAbout` (19 terms), `sameAs` (LinkedIn, Medium).
2. **WebSite** — `publisher` references Person via `@id`, includes `description`.

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/[...nextauth]` | GET/POST | Google OAuth (Auth.js v5) |
| `/api/contact` | POST | Form submission → Google Sheets |
| `/api/palette` | POST | Admin palette update → Edge Config |

All API routes are protected by `middleware.ts` which gates `/admin` and `/api/palette` behind authentication.

## File Organization

```
src/components/{section-name}/    # Each section gets its own directory
src/config/                       # All content, palette definitions, mappings
src/lib/                          # Shared utilities, hooks, Three.js, animations
src/app/                          # Routes, layout, API handlers, image generators
```

No barrel exports. Components import directly from their file paths.
