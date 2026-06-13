# Project Context for Claude Code

## Stack Overview

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
- `pnpm api:gen` — regenerate API clients from OpenAPI spec (run after backend schema changes)

**Always run `pnpm check` after completing a code change before declaring it done.**

---

## Architecture & File Structure

```

src/
app/ # Next.js App Router routes
<route>/
page.tsx
loading.tsx
error.tsx
components/
ui/ # shadcn primitives (don't hand-edit unless asked)
data-table/ # custom DataTable component
form/ # custom useAppForm + form field components
features/
<feature>/
components/
hooks/
schemas/
stores/
api/
stores/ # global Zustand stores
services/ # Orval-generated API clients + orval.config.js
schemas/ # shared Zod schemas
hooks/ # shared hooks

```

---

## Hard Rules — Do Not Violate

1. **Server Components by default.** Add `"use client"` only when the component needs hooks, browser APIs, Zustand, or React Query.
2. **Tables**: Never call `useReactTable` directly. Always use the existing custom `DataTable` component. Find it before building any table UI.
3. **Forms**: Never call `useForm` from `@tanstack/react-form` directly. Always use the existing custom `useAppForm` hook. Find it before building any form.
4. **Data fetching**: Never call `axios` or `fetch` directly in components. Use Orval-generated hooks from `src/services/`. If an endpoint isn't generated yet, run `pnpm api:gen` or ask the user to update the OpenAPI spec.
5. **Zustand is client-state-only.** Never store server/fetched data in Zustand — that belongs in TanStack Query cache.
6. **Table state (pagination, sorting, filters)** goes in URL search params via `nuqs`, not Zustand, not local state.
7. **No `any` types.** No unjustified `as` casts. Use `type-fest` for advanced type utilities.
8. **No manual `useMemo`/`useCallback`** unless there's a measured perf problem — React Compiler handles this.
9. **Styling**: Tailwind utilities + `cn()` (clsx + tailwind-merge) + `cva` for variants. No raw CSS/SCSS except `globals.css` for true globals. Don't fight `prettier-plugin-tailwindcss` class ordering.
10. **Imports**: Let `eslint-plugin-simple-import-sort` order imports — don't manually reorder.

---

## Before Writing New Code

1. Search the codebase for existing patterns/components before creating new ones (especially: stores, schemas, DataTable usage, useAppForm usage, similar features).
2. Check `src/services/` for an existing Orval-generated hook before assuming an API call needs to be written from scratch.
3. Check `src/stores/` for an existing Zustand store covering the relevant domain before creating a new one.
4. Match the file/folder conventions of neighboring features — consistency over personal preference.

---

## Conventions

- **Naming**: kebab-case files (`user-profile-card.tsx`), PascalCase components, camelCase hooks/functions
- **Commits**: Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `test:`, `docs:`) — enforced by commitlint
- **Zustand stores**: typed interface split into `State` + `Actions`, created with `create<T>()(...)`, expose `reset()`, consume via selectors
- **Zod schemas**: live in `src/schemas/` or `src/features/<feature>/schemas/`, types inferred via `z.infer<typeof schema>`
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
- Don't edit `src/components/ui/*` (shadcn primitives) unless explicitly asked — these are meant to be regenerated/updated via the shadcn CLI
- Don't write inline styles or `style={{}}` props except for truly dynamic values Tailwind can't express
