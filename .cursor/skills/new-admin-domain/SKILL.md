---
name: new-admin-domain
description: Adds a new admin dashboard feature under src/domains/ with route, table, and forms. Use when creating admin pages, CRUD screens, dashboard modules, or wiring a new /dashboard/* route.
---

# Luxe Front — New admin domain

## Before coding

1. Search `src/domains/` and `src/services/` for existing patterns
2. If API is new/changed → use `/api-gen` skill first
3. Read a similar domain (e.g. `categories`, `discounts`, `workflows`)

## Checklist

```text
- [ ] Orval hooks exist in src/services/
- [ ] src/domains/<name>/ — components, containers, sections, schemas, stores
- [ ] src/app/(admin)/dashboard/<route>/page.tsx — thin wrapper
- [ ] loading.tsx + error.tsx on the route segment
- [ ] Admin nav entry (backend menu seed if needed)
- [ ] pnpm check passes
```

## File layout

```
src/domains/<name>/
  <name>.domain.tsx          # main client component
  sections/<name>-columns.tsx
  sections/<name>-form.tsx   # if CRUD form
  schemas/<name>-schema.ts   # Zod for forms only
  stores/<name>-store.ts     # UI state only (modals, selection)
  components/                # optional pieces
src/app/(admin)/dashboard/<name>/page.tsx
```

## Route pattern

```tsx
import { FeatureDomain } from '@/domains/<name>/<name>.domain';

export default function FeaturePage() {
  return <FeatureDomain />;
}
```

## Server-driven table

Use `useServerTable` + Orval `useQuery` + URL state via the DataTable helper.

Reference: `src/domains/categories/categories.domain.tsx`

```tsx
const serverTable = useServerTable({
  columns: featureColumns,
  initialPageSize: 20,
  getQueryParams: (state, filter) => ({
    limit: state.pagination.pageSize,
    offset: state.pagination.pageIndex * state.pagination.pageSize,
    search: filter || undefined,
  }),
  getRows: (data) => data?.data?.items ?? [],
  getTotal: (data) => data?.data?.total,
  useQuery: useGetFeature,
});
```

Render with `Table.Root`, `Table.Toolbar`, `Table.Grid`, `Table.Pagination` from `@/components/table/data-table`.

## Forms

- Always `useAppForm` from `@/components/forms/useAppForm`
- Zod v4 in `schemas/`; submit via Orval mutations
- Toast errors with `sonner`; invalidate with `get*QueryKey()` on success

## State rules

| Data | Where |
|------|-------|
| API responses | TanStack Query (Orval hooks) |
| Pagination, filters, sort | URL via DataTable / nuqs |
| Dialog open, selected row | Zustand in `stores/` |

## Do not

- Put fetched data in Zustand
- Call `useReactTable` or raw `useForm` directly
- Create manual API wrappers when a hook is missing — fix Swagger instead
