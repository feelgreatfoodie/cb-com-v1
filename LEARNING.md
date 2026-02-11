# Learning Log

Patterns discovered, bugs encountered, and decisions made during development.

## Mobile Animation Gotcha: `whileInView` on SVG Children

**Problem:** Framer Motion's `whileInView` prop uses IntersectionObserver internally. When applied to SVG child elements (`<motion.circle>`, `<motion.g>`, `<motion.line>`), the observer doesn't fire reliably on mobile browsers — especially iOS Safari. Elements stay at their `initial` state (opacity: 0, scale: 0) and never become visible.

**Fix:** Use `useInView` on a wrapper `<div>` around the SVG, then pass `isInView` as a conditional to each child's `animate` prop. IntersectionObserver works reliably on standard DOM elements across all browsers.

**Affected components:** `RadialHub.tsx`, `PDFPreview.tsx`.

## 3D Transforms on Mobile

`perspective` and `rotateY` on `PDFPreview` caused rendering issues on some mobile browsers. The combination of `whileInView` not firing + 3D transforms meant the element was both invisible (opacity: 0) and potentially behind the page plane. The `useInView` fix resolved both issues simultaneously.

## Footer Contact Link Wrapping

Five contact links (email, phone, LinkedIn, Medium, One-Sheeter) with pipe separators wrap differently on mobile vs desktop. Solution: `text-xs` on mobile for a clean two-line wrap, `sm:text-sm` + `sm:flex-nowrap` on desktop for a single-line layout with pipes.

## JSON-LD `jobTitle` as Array

Schema.org allows `jobTitle` to be either a string or an array. Using an array of 5 role titles allows the site to rank for multiple recruiter searches simultaneously. Google's structured data testing tool validates this format correctly.

## `useInView` vs `whileInView`

| Feature | `whileInView` | `useInView` |
|---------|---------------|-------------|
| Applied to | Individual element | Ref on any DOM element |
| Works on SVG children | Unreliable on mobile | N/A (ref goes on wrapper div) |
| Control flow | Declarative (prop) | Imperative (hook → conditional animate) |
| Use when | Simple DOM elements | SVG children, complex orchestration, mobile-critical |

## SEO Title Strategy

"Technical Solutions Partner" was the original title but has near-zero search volume. "Solutions Architect" and "Data Engineer" are high-volume recruiter searches. The title was changed to "Solutions Architect & Data Engineer" while keeping "Technical Solutions Partner" in the JSON-LD `jobTitle` array and keyword list for brand continuity.

## PWA Manifest via Next.js

Next.js supports `manifest.ts` files that export a `MetadataRoute.Manifest` function. This generates `/manifest.webmanifest` as a static route at build time — no manual JSON file in `/public` needed. Same pattern as `robots.ts` and `sitemap.ts`.

## Testimonial Touch Swipe

Implemented with raw `onTouchStart` / `onTouchEnd` handlers rather than framer-motion's `drag` prop. The `drag` prop conflicts with `AnimatePresence` exit animations. Touch handlers with a 50px threshold are simpler and more reliable.
