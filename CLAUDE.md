# Project Context for Claude Code

> **Authoritative docs:** `AGENTS.md` · `documentation/architecture.md` · `.cursorrules` · `.cursor/rules/luxe-front.mdc` · `.cursor/skills/`

## Cursor context

- **Always-on:** `.cursorrules` + `.cursor/rules/luxe-front.mdc` — hard rules every session.
- **On-demand skills:** `.cursor/skills/<name>/SKILL.md` — workflows; type `/api-gen`, `/layout-typography`, `/new-admin-domain`, `/admin-forms` or let Agent auto-load.
- **Evals:** `.cursor/skills/*/evals/` and `eval-queries.json` — skill quality tests (see `.cursor/skills/README.md`).

Layout: use `Flex`, `Grid`, `GridItem`, `Typography` from `@/components/ui/` — not raw div/h* with flex/grid/text Tailwind. Skill: `/layout-typography`.


- **Framework**: Next.js 16 (App Router, React Compiler enabled)
- **Runtime**: React 19, TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui (radix-ui primitives)
- **Client State**: Zustand
- **Server State**: TanStack Query (React Query v5)
- **Tables**: TanStack Table v8 + TanStack Virtual — always via custom `DataTable`
- **Forms**: TanStack Form v1 — always via custom `useAppForm` hook
- **Validation**: Zod v4
- **API Layer**: Orval-generated clients from OpenAPI spec
- **Testing**: Playwright (E2E)
- **Package manager**: pnpm

## Commands

- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm typecheck` — TypeScript check (run before finishing any task)
- `pnpm lint:fix` — ESLint with autofix (run before finishing any task)
- `pnpm check` — typecheck + lint:fix combined
- `pnpm format` — Prettier write
- `pnpm test` — Playwright tests
- `pnpm test:smoke` — smoke tests only
- `pnpm api:gen` — regenerate API clients from OpenAPI spec (**backend must be running**)

**Always run `pnpm check` after completing a code change before declaring it done.**

---

## API / Orval — mandatory workflow

1. **Never edit** files under `src/services/` — they are generated.
2. Before adding API calls, **grep `src/services/`** for an existing hook.
3. When backend changes: `make swagger` → **restart luxe-backend** → `pnpm api:gen`.
4. Import hooks from `@/services/-<path>-<method>` and types from `*.schemas.ts`.
5. Use `get*QueryKey()` from generated files for query invalidation.

See `documentation/architecture.md` for full pipeline and examples.

---

## Architecture & File Structure

```

src/
  app/                    # Next.js App Router routes
  domains/<domain>/       # Feature code (components, containers, sections, schemas, stores)
  components/
    ui/                   # shadcn primitives (don't hand-edit unless asked)
    table/                # DataTable (Table.*)
    forms/                # useAppForm + field components
  stores/                 # global Zustand stores
  services/               # Orval-generated — DO NOT EDIT
  schemas/                # shared Zod schemas (forms only, not API types)
  lib/                    # shared utils, api-client
```

---

## Hard Rules — Do Not Violate

1. **Server Components by default.** Add `"use client"` only when the component needs hooks, browser APIs, Zustand, or React Query.
2. **Tables**: Never call `useReactTable` directly. Always use the existing custom `DataTable` component. Find it before building any table UI.
3. **Forms**: Never call `useForm` from `@tanstack/react-form` directly. Always use the existing custom `useAppForm` hook. Find it before building any form.
4. **Data fetching**: Never call `axios` or `fetch` directly. Use Orval hooks from `src/services/`. Missing endpoint → backend Swagger + `pnpm api:gen`, not manual clients.
5. **Zustand is client-state-only.** Never store server/fetched data in Zustand — that belongs in TanStack Query cache.
6. **Table state (pagination, sorting, filters)** goes in URL search params via `nuqs`, not Zustand, not local state.
7. **No `any` types.** No unjustified `as` casts. Use `type-fest` for advanced type utilities.
8. **No manual `useMemo`/`useCallback`** unless there's a measured perf problem — React Compiler handles this.
9. **Styling**: Tailwind + `cn()` + `cva`; layout via `Flex`/`Grid`/`Typography`, not div flex/grid shells.
10. **Imports**: Let `eslint-plugin-simple-import-sort` order imports — don't manually reorder.

---

## Before Writing New Code

1. Search `src/domains/` and `src/services/` for existing patterns before creating new code.
2. Check `src/services/` for an existing Orval hook — **never** hand-write API types in `schemas/`.
3. Check `src/stores/` and `src/domains/*/stores/` for existing Zustand slices.
4. Match neighboring domain folder conventions.

---

## Conventions

- **Naming**: kebab-case files (`user-profile-card.tsx`), PascalCase components, camelCase hooks/functions
- **Commits**: Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `test:`, `docs:`) — enforced by commitlint; **subject line max 120 chars**
- **Zustand stores**: typed interface split into `State` + `Actions`, created with `create<T>()(...)`, expose `reset()`, consume via selectors
- **Zod schemas**: live in `src/schemas/` or `src/domains/<domain>/schemas/` — **form validation only**; API types come from Orval `*.schemas.ts`
- **Error/loading states**: every async route segment gets `error.tsx` and `loading.tsx`
- **Accessibility**: interactive elements must be keyboard-navigable with proper ARIA — `eslint-plugin-jsx-a11y` enforces this, don't bypass

---

## Testing

- New features touching critical flows (auth, checkout, forms) should have or update Playwright tests
- Tag tests appropriately: `@smoke`, `@auth`, `@integration`
- Run `pnpm test:smoke` for quick validation; full `pnpm test` before larger PRs

---

## What NOT To Do

- Don't introduce new npm dependencies without checking if the existing stack already covers the need (Radix, TanStack ecosystem, Zustand, date-fns, etc.)
- Don't create ad-hoc `useState` for data that's fetched from an API — that's a TanStack Query job
- Don't bypass the custom `DataTable` or `useAppForm` "for simplicity" — extend them if they're missing a feature, don't route around them
- Don't edit `src/services/` or `src/components/ui/*` unless explicitly asked
- Don't write inline styles or `style={{}}` props except for truly dynamic values Tailwind can't express
