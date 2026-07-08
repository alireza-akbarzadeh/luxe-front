# AGENTS.md — Luxe Front

Guide for AI agents and automated tools working in this repository.

## Project

Next.js 16 admin + Luxe: **React 19**, **TypeScript**, **Tailwind v4**, **shadcn/ui**, **TanStack Query/Form/Table**, **Zustand**, **Orval** (API clients from backend OpenAPI).

## Authoritative rules (read before any task)

1. **`.cursorrules`** — full stack conventions (forms, tables, state, styling).
2. **`.cursor/rules/luxe-front.mdc`** — short always-on summary (Cursor Rules).
3. **`.cursor/rules/domain-organization.mdc`** — domain folder layout (`types/`, `schemas/`, `lib/`, `hooks/`, thin components).
4. **`documentation/architecture.md`** — app structure, Orval pipeline, domain layout.
4. **`.cursor/skills/`** — on-demand workflow skills (see below); invoke with `/skill-name` or let Agent auto-load.
5. **`CLAUDE.md`** — duplicate quick reference for Claude Code.

Do not hand-edit generated API files. Do not assume `src/features/` — this repo uses **`src/domains/`**.

## Cursor AI context (`.cursor/`)

Two layers — do not duplicate skill workflows in these docs; use skills for step-by-step tasks.

| Layer | Path | Role |
|-------|------|------|
| **Always-on rules** | `.cursorrules`, `.cursor/rules/luxe-front.mdc` | Hard conventions every session |
| **Agent skills** | `.cursor/skills/<name>/SKILL.md` | Task workflows loaded when relevant |
| **Vendor rule packs** | `.cursor/skills/_vendor/` | Third-party upstream copies (e.g. Vercel React rules) |
| **Skill evals** | `.cursor/skills/<name>/evals/`, `eval-queries.json` | Test description triggering and output quality |

`npx skills add` writes to `.agents/skills/` (gitignored). Adapt into `.cursor/skills/` before committing — do not maintain two parallel trees.

### Project skills (luxe-front)

| Skill | Use when |
|-------|----------|
| `/find-skills` | Find/install agent skills — checks local skills first, then skills.sh |
| `/luxe-react-performance` | React/Next perf — TanStack Query, Recharts, bundle, re-renders |
| `/api-gen` | Orval regen, missing hooks/types in `src/services/` |
| `/layout-typography` | Layout/text — use `Flex`, `Grid`, `Typography`, `Box` not raw div + Tailwind flex/grid/text |
| `/new-admin-domain` | New `/dashboard/*` page, domain scaffold, server table |
| `/admin-forms` | `useAppForm`, Zod, submit handlers, form mappers |
| `/zustand` | Client UI stores — dialogs, selections, wizard; not server lists or table URL state |
| `/tanstack-table` | Data tables — columns, useServerTable, bulk actions; not raw useReactTable in domains |
| `/tanstack-query` | Server data — Orval hooks, cache invalidation, prefetch, mutations; not raw fetch |
| `/shadcn` | shadcn/ui CLI — add components, Field/Dialog patterns; don't hand-edit `src/components/ui/*` |
| `/framer-motion` | Marketing motion — `motion/react`, transform/opacity; not admin perf tuning |
| `/frontend-design` | Storefront/marketing visual direction — distinctive hero, type, palette |
| `/design-taste-frontend` | Landing/portfolio anti-slop redesign — not admin dashboards |
| `/vercel-composition-patterns` | Compound components, boolean prop refactors — aligns with `Table.*` |

Details: `.cursor/skills/README.md`. Backend skills live in the **`luxe`** repo under `.cursor/skills/` (`new-api-entity`, `add-api-endpoint`).

**After backend Swagger changes:** luxe → `make swagger` → **restart API** → luxe-front → `pnpm api:gen` → `pnpm check`. Required for new/renamed DTOs, routes, and response shapes — not optional.

**Layout rule (always):** prefer `@/components/ui/flex`, `grid`, `typography` over `<div className="flex|grid …">` and styled `<h*>`/`<p>`. Full checklist: `/layout-typography`.

## Architecture (one line)

```
Route (App Router) → Domain component → Orval hook (TanStack Query) → customInstance (axios) → luxe-backend API
```

- **Server Components by default**; `"use client"` only for hooks, events, Zustand, React Query, browser APIs.
- **Server data** → TanStack Query cache via Orval hooks in `src/services/`.
- **Client UI state** → Zustand in `src/domains/<domain>/stores/` or `src/stores/`.
- **Forms** → `useAppForm` (`src/components/forms/useAppForm.ts`) + Zod in domain `schemas/`.
- **Tables** → `Table` from `src/components/table/data-table.tsx` (never raw `useReactTable`).
- **Remote/product images** → `AppImage` from `@/components/ui/app-image`; empty src → `IMAGE_FALLBACK` from `@/lib/images` (not raw `next/image` or `/placeholder.png`).

## API layer — Orval (critical)

All HTTP calls use **generated** clients under `src/services/`. Never call `axios`/`fetch` in components.

### When backend Swagger / API contract changes

Run in order (backend must be **running** before step 3). Required for **any** OpenAPI change — new routes, new/renamed DTOs, renamed fields, path/method changes, response shape updates:

```bash
# 1. Backend (luxe) — regenerate Swagger from Go DTOs + controller comments
make swagger

# 2. Restart the API (OpenAPI is cached at process start — restart is mandatory)
make run

# 3. Frontend (luxe-front) — regenerate hooks + Dto* types
pnpm api:gen

# 4. Fix imports/mappers; verify
pnpm check
```

**Do not** hand-edit `src/services/` when DTO names or fields changed — run the sequence above. Update form mappers in `domains/*/lib/*-mapper.ts` if API field names changed.

Skill: `/api-gen` · Detail: `.cursor/skills/api-gen/references/swagger-contract-sync.md`

**Warning:** `pnpm api:gen` **deletes** `src/services/` first. If the backend is down, generation fails and services are wiped. Ensure `http://localhost:8080/openapi` responds before running.

Override OpenAPI URL: `OPENAPI_BASE_URL=http://localhost:8080` or derive from `NEXT_PUBLIC_API_URL`.

### Generated file layout

| Pattern | Purpose |
|---------|---------|
| `src/services/-<path>-<method>.ts` | Hook + imperative client + query key factory |
| `src/services/-<path>-<method>.schemas.ts` | Request/response TypeScript types |
| `src/services/orval.config.js` | Generated Orval config (do not edit) |
| `code-generator.js` | Fetches `/openapi`, splits spec per endpoint |

### How to import (examples)

```ts
import { useGetAdminWorkflows, getGetAdminWorkflowsQueryKey } from '@/services/-admin-workflows-get';
import type { GetAdminWorkflows200, ModelsWorkflow } from '@/services/-admin-workflows-get.schemas';
import { usePostAdminWorkflowsIdStates } from '@/services/-admin-workflows-{id}-states-post';
```

- Use **`get*QueryKey`** factories for `invalidateQueries` — do not hand-write query keys.
- Response types are often `GetXxx200 = UtilsResponse & { data?: ... }` — cast or narrow `data` from generated schemas.
- If a hook is missing: backend route needs Swagger comments → `make swagger` → restart API → `pnpm api:gen`.

### Never edit

- Any file under `src/services/` except `.gitkeep` (all regenerated by `pnpm api:gen`)
- `src/services/orval.config.js` (generated)
- `src/components/ui/*` unless explicitly asked (shadcn primitives)

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start Next.js dev server |
| `pnpm api:gen` | Regenerate Orval clients (backend must be up) |
| `pnpm typecheck` | TypeScript check |
| `pnpm lint:fix` | ESLint autofix |
| `pnpm check` | typecheck + lint:fix |
| `pnpm build` | Production build (runs `prebuild` → `api:gen`) |
| `pnpm test:smoke` | Playwright smoke tests |

**Before finishing any task:** run `pnpm check` (on files you changed at minimum).

## New domain feature checklist

1. Search `src/domains/` and `src/services/` for existing patterns.
2. If API is new/changed: use `/api-gen` or backend Swagger → restart API → `pnpm api:gen`.
3. Add route under `src/app/` (thin `page.tsx` delegating to domain) — see `/new-admin-domain`.
4. Implement under `src/domains/<name>/` (`components/`, `containers/`, `sections/`, `schemas/`, `stores/`).
5. Use Orval hooks for data; Zod + `useAppForm` for forms (`/admin-forms`); `Table` for lists.
6. Use `Flex`/`Grid`/`Typography` for layout (`/layout-typography`); `AppImage` for remote/product photos.
7. `pnpm check`.

## Key entry points

| Path | Role |
|------|------|
| `src/app/(admin)/dashboard/` | Admin routes (`/dashboard/*`) |
| `src/domains/` | Feature/domain UI + logic |
| `src/components/forms/useAppForm.ts` | All forms |
| `src/components/table/data-table.tsx` | All data tables |
| `src/components/ui/app-image.tsx` | Remote/product images (`AppImage`) |
| `src/lib/images.ts` | `IMAGE_FALLBACK`, `resolveImageSrc` |
| `src/lib/api/api-client.ts` | Axios `customInstance` (Orval mutator) |
| `code-generator.js` | OpenAPI fetch + Orval config generation |
| `.cursor/skills/` | Agent Skills — workflows (`/api-gen`, `/layout-typography`, etc.) |
| `.cursor/skills/README.md` | Skill index, evals, triggering tests |

## Env reference

See `.env.example` / `.env.local` for `NEXT_PUBLIC_API_URL`, auth, etc.
