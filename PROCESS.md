# Process

Development workflow and conventions for the Ribeira Quest site.

## Branching & Deployment

- All work happens on `main` — pushes auto-deploy to Vercel.
- No staging branch. Preview deployments generate automatically on PRs.
- Commits follow conventional format: `feat:`, `fix:`, `docs:`, `refactor:`.

## Development Cycle

1. **Plan** — Scope the change, identify affected files, consider mobile + desktop.
2. **Implement** — Edit in place. Prefer modifying existing components over creating new ones.
3. **Build verify** — `npx next build` must pass with zero errors before committing.
4. **Test mobile** — Check viewport rendering, touch interactions, and `whileInView` animations on real devices or Chrome DevTools mobile emulation.
5. **Commit & push** — Stage only changed files (no `git add .`), write descriptive commit messages.

## Component Conventions

- **One section = one directory** under `src/components/` (e.g., `bossfight/`, `download/`).
- **Content lives in config** — All copy in `src/config/content.ts`, not hardcoded in components.
- **Palette-aware** — Components access colors via `usePalette()` context, never hardcoded hex values (except in edge-runtime image generators).
- **Animation pattern** — Use `useInView` from framer-motion on a wrapper DOM element, then pass `isInView` to children via conditional `animate`. Avoid `whileInView` on SVG children (unreliable on mobile).
- **Responsive-first** — Base styles are mobile, `sm:` / `md:` / `lg:` add desktop overrides.

## Content Updates

- **Section copy:** Edit `src/config/content.ts`.
- **Palette colors:** Edit `src/config/palettes.ts`.
- **One-sheeters:** Drop PDF in `public/onesheets/`, PNG preview in `public/onesheet-previews/`, add entries to `src/config/onesheet-map.ts`.
- **SEO metadata:** Edit the `metadata` export and JSON-LD block in `src/app/layout.tsx`.

## Environment

- Node 18+, npm
- Next.js 16 with Turbopack
- Vercel for hosting, Edge Config for server-side palette state
- Google Sheets API for contact form submissions
