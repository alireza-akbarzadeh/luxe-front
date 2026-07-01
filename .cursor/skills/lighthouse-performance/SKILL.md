---
name: lighthouse-performance
description: >
  Use when auditing or improving Lighthouse Performance scores (target 90+) for luxe-front —
  LCP, FCP, TBT, INP, CLS, bundle size, RSC/client boundaries, images, fonts, and Core Web Vitals.
  Complements /luxe-react-performance with Lighthouse-specific audit workflow and fix ranking.
paths:
  - "src/app/**/*.tsx"
  - "src/domains/**/*.tsx"
  - "src/components/**/*.tsx"
  - "next.config.*"
---

# Lighthouse performance (luxe-front)

**Goal:** Raise Lighthouse Performance to **90+** (mobile + desktop) without breaking UX, SEO, or a11y.

**Companion skill:** `/luxe-react-performance` (React/Query/bundle patterns). Use **this** skill for Lighthouse audits, metric mapping, and prioritized fix lists.

## Audit workflow

1. **Measure** — Chrome DevTools Lighthouse (mobile + desktop) or PageSpeed Insights on `/` and top routes.
2. **Map findings** → metrics: LCP, FCP, Speed Index, TBT, INP, CLS.
3. **Rank fixes** — High / Medium / Low by estimated score impact.
4. **Fix in code** — smallest correct diff; verify with second Lighthouse run.
5. **Gate** — `pnpm check`; no regressions in a11y/SEO scores.

## Luxe-specific rules (non-negotiable)

| Do | Don't |
|----|--------|
| Server Components + server `getTranslations` / Orval imperative fetch | Pass `renderItem` / functions from RSC → client |
| `SectionCarousel` **children** for SSR lists | `renderItem={(item) => ...}` across RSC boundary |
| `getHomeContent()` / `getTranslations` on server | Whole-page `'use client'` for static marketing |
| CSS utilities (`luxe-rise`, `luxe-fade`) for motion | framer-motion on every section |
| Small client islands (tabs, counters, forms) | `useHomeContent()` wrapping entire homepage |
| `next/image` + `priority` on LCP hero | Client `useSuspenseQuery` for above-fold hero data |
| `dynamic(..., { ssr: false })` for maps/charts/editors | Import heavy libs in layout/page shell |

## RSC / client boundary checklist

```
page.tsx (RSC)
  └─ domain *.domain.tsx (RSC)
       ├─ async section (RSC) — fetch + map data
       │    └─ SectionCarousel (client) — carousel chrome only
       │         └─ children: ProductCard (client) — interactivity
       └─ marketing section (RSC) — copy + links
            └─ NewsletterForm (client) — useState only
```

**Error:** `Functions cannot be passed directly to Client Components` → replace `renderItem` with **pre-rendered `children`** from the server parent.

## Metric → common fixes

| Metric | High-impact fixes in this repo |
|--------|------------------------------|
| **LCP** | Hero image `priority` + `fetchPriority="high"`; server-fetch spotlight; reduce hero JS; preload critical font |
| **FCP** | Less client JS on `/`; stream sections with `Suspense` + skeletons (`SectionBoundary`) |
| **TBT / INP** | Shrink framer-motion surface; defer non-critical client bundles; avoid hydration mismatch work |
| **CLS** | Explicit image `sizes`; skeleton dimensions match content; no late font swap without `next/font` |
| **Unused JS** | Server-render static sections; `next/dynamic` for admin-only/heavy widgets |

## Home page reference implementation

| File | Role |
|------|------|
| `src/domains/home/lib/get-home-content.ts` | Server translations + mock data |
| `src/domains/home/components/*-section.tsx` | Async RSC where possible |
| `src/domains/home/components/ui/*-form.tsx` | Client islands only |
| `src/components/section-carousel/` | Client; accepts `children` not `renderItem` from RSC |
| `src/styles/globals.css` | `luxe-rise` / `luxe-fade` CSS motion |

## Fix report template (after each pass)

For each issue document:

1. **Problem** — what Lighthouse / DevTools showed  
2. **Severity** — High / Medium / Low  
3. **Metrics affected** — LCP, TBT, etc.  
4. **Est. gain** — e.g. +3–8 Performance points  
5. **Change** — files touched and why  

## Remaining architectural wins (when 90+ still blocked)

- Route-level `loading.tsx` + tighter Suspense per section  
- `next/dynamic` for `SectionCarousel` below fold  
- Image CDN / AVIF policy in `next.config`  
- API response caching (`Cache-Control`) on home endpoints (backend)  
- Reduce `ProductCard` client weight (split like-button island)

## Commands

```bash
pnpm check
pnpm build   # production bundle analysis
```

Use Chrome Coverage + Lighthouse treemap after `pnpm build` for unused JS verification.
