---
name: luxe-react-performance
description: >
  Use when optimizing, reviewing, or refactoring luxe-front React/Next.js performance —
  slow pages, re-renders, bundle size, charts, admin tables, TanStack Query caching,
  or data-fetch waterfalls. Applies Vercel React patterns adapted to Orval, TanStack Query/Form,
  Zustand, shadcn, Recharts, and React Compiler. Do not replace Orval, useAppForm, DataTable,
  or Flex/Grid layout skills.
paths:
  - "src/domains/**/*.tsx"
  - "src/app/**/*.tsx"
  - "src/components/**/*.tsx"
---

# Luxe React performance

**Stack:** Next.js 16 App Router · React 19 · **React Compiler** · Orval + TanStack Query · `useAppForm` · Zustand · shadcn · Recharts · custom `Table`.

**Default references:** `src/lib/query-client.ts`, `src/domains/revenue-report/`, `src/domains/revenue-report/sections/revenue-daily-chart.tsx`, `src/components/ui/chart.tsx`.

Vercel rule deep-dives (70 rules): `.cursor/skills/_vendor/vercel-react-best-practices/rules/` — read by prefix when fixing a specific issue.

## Luxe hard rules (do not "optimize" away)

| Always use | Never substitute |
|------------|------------------|
| Orval hooks in `src/services/` | raw `fetch`/`axios`, SWR |
| `useAppForm` | raw `useForm` |
| `Table` / `useServerTable` | raw `useReactTable` in domains |
| `Flex` / `Grid` / `Typography` | div flex/grid for layout |
| Zustand for UI state only | server/list data in Zustand |
| `get*QueryKey()` invalidation | hand-written query keys |

More stack detail: [references/luxe-stack-patterns.md](references/luxe-stack-patterns.md).

## Priority order (fix in this sequence)

### 1. Eliminate waterfalls (CRITICAL)

- **Parallel independent fetches** — don't chain `await` in one component when Orval queries are independent; mount siblings or use `Promise.all` in Server Components.
- **Server Components first** — fetch on server + `HydrationBoundary` where routes already prefetch; add `"use client"` only when needed.
- **Cheap guard before await** — check auth/params synchronously before hitting API (Vercel `async-cheap-condition-before-await`).

### 2. Bundle size (CRITICAL)

- **Direct imports** — `import { AreaChart } from 'recharts'`, not barrel `@/components/ui` mega-imports for heavy trees.
- **`next/dynamic`** for heavy client-only libs — pattern: `src/domains/account/components/address-map-picker-dialog.tsx` (Leaflet). Use for large chart dashboards if they bloat initial JS.
- **Conditional load** — analytics, maps, rich editors only when feature opens (Vercel `bundle-conditional`, `bundle-dynamic-imports`).

### 3. TanStack Query (replaces Vercel "client-swr-dedup")

Project defaults (`src/lib/query-client.ts`): `staleTime: 60_000`, `refetchOnWindowFocus: false`.

```tsx
// Per-query override for dashboards (see revenue-report.domain.tsx)
useGetAdminReportsRevenue({ period }, { query: { staleTime: 60_000 } });

// After mutations — Orval key factories only
void queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
```

- Set **`staleTime` / `gcTime`** deliberately on hot admin lists — not every query needs instant refetch.
- **Don't duplicate server data in Zustand** — Query cache is the source of truth.
- **Table pagination** stays in URL via `useServerTable` — not extra query subscriptions in Zustand.

### 4. Re-renders (MEDIUM)

- **Trust React Compiler** — avoid new `useMemo`/`useCallback` unless profiling shows a need (project rule).
- **`startTransition`** for heavy filter/tab switches on large admin views (Vercel `rerender-transitions`).
- **Zustand selectors** — `useStore((s) => s.field)` not whole store.
- **Split client boundaries** — small `"use client"` islands; keep layouts/pages as RSC when possible.
- **Functional `setState`** in Zustand/actions when next state depends on previous (Vercel `rerender-functional-setstate`).

### 5. Recharts (Luxe pattern)

**Prefer shadcn wrapper:**

```tsx
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, XAxis, YAxis } from 'recharts';
```

Reference: `revenue-daily-chart.tsx`.

- Transform API rows **once** before chart (`useMemo` on mapped array is OK for large series).
- Empty state — short-circuit before mounting `ChartContainer` (see revenue chart).
- Small donuts — fixed `width`/`height` OK (`status-donut-chart.tsx`); dashboards — `ChartContainer` + `className='h-75 w-full'`.
- Theme tokens via `ChartConfig` — not hardcoded hex in domain code.

### 6. Admin tables

- Server lists: **`useServerTable`** + Orval `useQuery` — pagination/filter in URL (nuqs), not duplicate state.
- Large row counts: rely on **TanStack Virtual** inside `Table.Grid` — don't render unbounded rows client-side.
- Row actions → Zustand for dialog/selection only.

### 7. Forms (TanStack Form via useAppForm)

- Validation in Zod + `validators.onChange` — avoid extra effects that re-sync form state (Vercel `rerender-derived-state-no-effect`).
- Submit via Orval **`useMutation`** — `isPending` on button, not parallel loading flags in Zustand.

## Review checklist

```text
- [ ] No new fetch/axios in components
- [ ] No server data copied into Zustand
- [ ] Independent Orval queries not serialized in one effect
- [ ] Heavy client libs dynamically imported if below-the-fold
- [ ] Charts use ChartContainer + direct recharts imports
- [ ] staleTime intentional on dashboard/report queries
- [ ] No gratuitous useMemo/useCallback (React Compiler)
- [ ] pnpm check passes
```

## When to read Vercel rules

| Symptom | Vercel rule file |
|---------|------------------|
| Sequential awaits | `rules/async-parallel.md` |
| Large bundle / slow TTI | `rules/bundle-dynamic-imports.md` |
| RSC over-serializing props | `rules/server-serialization.md` |
| Input lag on filters | `rules/rerender-transitions.md` |
| Long lists slow to paint | `rules/rendering-content-visibility.md` |

Full index: [references/vercel-rules-index.md](references/vercel-rules-index.md)

## Conflicts

If Vercel skill says **use SWR** → use **TanStack Query + Orval** instead.

If generic skill says **useMemo everything** → follow **React Compiler** + Luxe `.cursorrules`.
