---
name: new-admin-domain
description: >
  Use when adding a new luxe-front admin screen under /dashboard — CRUD modules,
  server-paginated list pages, src/domains/ scaffolding, route pages in
  app/(admin)/dashboard/, or admin sidebar entries. Apply when the user says
  management page, back-office list, admin settings, or "add a dashboard for X"
  without naming domains. Do not use for storefront/shop pages, Orval-only regen,
  or small layout edits inside an existing domain file.
---

# New admin domain

**Default reference:** `src/domains/categories/categories.domain.tsx` (list) + `src/domains/brands/sections/brand-form.tsx` (form).

## Checklist

```text
- [ ] Orval hooks exist (run /api-gen if not)
- [ ] src/domains/<name>/ — domain, sections/, schemas/, stores/
- [ ] src/app/(admin)/dashboard/<route>/page.tsx + loading.tsx + error.tsx
- [ ] Backend menu entry if page should appear in sidebar (/user-menu-structure)
- [ ] pnpm check
```

## Scaffold

```
src/domains/<name>/
  <name>.domain.tsx
  sections/<name>-columns.tsx
  sections/<name>-form.tsx      # if CRUD
  schemas/<name>-schema.ts      # Zod forms only
  stores/<name>-store.ts        # dialog/selection UI only
src/app/(admin)/dashboard/<name>/page.tsx   # thin export
```

Route page delegates only — no data fetching in `page.tsx`.

## Gotchas

- **Folder is `domains/`**, not `features/`.
- **Admin nav is backend-driven** — a new route won't appear in the sidebar until the menu config/seed includes it.
- **Table state lives in the URL** (nuqs via DataTable) — not Zustand.
- **Server data lives in TanStack Query** — not Zustand. Zustand = modals, selected row, draft UI.
- **Missing Orval hook** → fix backend Swagger, not a manual axios wrapper.
- **Layout/text** → follow `/layout-typography` when building JSX.

## Validate

```bash
pnpm check
```

For table wiring details, read [references/server-table.md](references/server-table.md).
For forms, invoke `/admin-forms`.
