---
name: tanstack-table
description: >
  Use when building or changing luxe-front data tables — ColumnDef, useServerTable, Table.Root
  compound components, row selection, bulk delete, server pagination, or column files. Apply when
  the user mentions DataTable, admin list page, table columns, pagination, or bulk actions. Do not
  use for raw useReactTable in domains, Zustand table state, useAppForm, Orval regen alone, or
  layout-only JSX (use layout-typography).
paths:
  - "src/components/table/**/*.ts"
  - "src/components/table/**/*.tsx"
  - "src/domains/**/sections/*-columns.tsx"
  - "src/domains/**/*table*.tsx"
  - "src/domains/**/*.domain.tsx"
---

# Luxe TanStack Table

**Stack:** `@tanstack/react-table` v8 · custom **`Table`** compound component · **`useServerTable`** · Orval `useGet*` · TanStack Query · **nuqs** for shareable filters (status tabs).

**Default references:** `src/domains/brands/brand.domain.tsx`, `src/domains/brands/sections/brand-columns.tsx`, `src/domains/categories/categories.domain.tsx`, `src/domains/shipments-admin/sections/shipments-table.tsx`.

Adapted from [tanstack-skills/tanstack-table](https://github.com/tanstack-skills/tanstack-skills). Luxe wraps TanStack Table — **do not call `useReactTable` in domain code**.

## Hard rules

| Always | Never in domains |
|--------|------------------|
| `Table` from `@/components/table/data-table` | Raw `<table>` + `useReactTable` |
| `useServerTable` for admin/API lists | Inline `columns={[…]}` in JSX every render |
| `ColumnDef<T>[]` in `sections/*-columns.tsx` | Server list data cached in Zustand |
| Orval `useGet*` inside `useServerTable` | Hand-written fetch in table components |
| `createSelectColumn()` for bulk selection | Duplicate checkbox column boilerplate |

`useReactTable` lives only inside `src/components/table/table-context.tsx`.

## Server-driven admin table

```tsx
'use client';

import { useCallback } from 'react';
import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { featureColumns } from '@/domains/feature/sections/feature-columns';
import { getGetFeatureQueryKey, useGetFeature } from '@/services/-feature-get';
import type { DtoItem, GetFeature200 } from '@/services/-feature-get.schemas';

const getQueryParams = useCallback(
  (state: TableState, filter: string) => ({
    limit: state.pagination.pageSize,
    offset: state.pagination.pageIndex * state.pagination.pageSize,
    search: filter.trim() || undefined,
  }),
  [],
);

const getRows = useCallback(
  (data: GetFeature200 | undefined) => data?.data?.items ?? [],
  [],
);

const getTotal = useCallback(
  (data: GetFeature200 | undefined) => data?.data?.total,
  [],
);

export function FeatureTable() {
  const serverTable = useServerTable({
    columns: featureColumns,
    initialPageSize: 20,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetFeature,
  });

  return (
    <Table.Root {...serverTable.rootProps}>
      <Table.Toolbar
        searchPlaceholder="Search…"
        showRefresh
        onRefresh={serverTable.refetch}
        isLoading={serverTable.isFetching}
        showColumnVisibility
        showBulkActions
        onDelete={handleBulkDelete}
      />
      <Table.Grid isLoading={serverTable.isLoading && serverTable.rows.length === 0} />
      <Table.Pagination showPageSize showTotalRows pageSizeOptions={[10, 20, 50]} />
    </Table.Root>
  );
}
```

**Defaults in `useServerTable`:** `manualPagination: true`, `manualFiltering: true`, `manualSorting: false`, `enableRowSelection: true`.

Map API params to your OpenAPI shape (`page` vs `offset` — see `brand.domain.tsx` vs `categories.domain.tsx`).

## Column definitions

File: `src/domains/<domain>/sections/<feature>-columns.tsx`

```tsx
import type { ColumnDef } from '@tanstack/react-table';
import { createSelectColumn } from '@/components/table/data-table';
import type { DtoBrandResponse } from '@/services/-brands-get.schemas';

export const brandColumns: ColumnDef<DtoBrandResponse>[] = [
  createSelectColumn<DtoBrandResponse>(),
  {
    accessorKey: 'name',
    header: 'Brand',
    cell: ({ row }) => row.original.name ?? '—',
  },
  // display column — no accessorKey
  { id: 'actions', header: '', enableSorting: false, cell: ({ row }) => … },
];
```

Use **`ColumnDef<Dto*>`** from Orval schemas — not hand-rolled row types.

Details: [references/column-patterns.md](references/column-patterns.md). TanStack deep dives: [references/tanstack-concepts.md](references/tanstack-concepts.md).

## Row selection & bulk actions

```tsx
const ids = Object.entries(serverTable.tableState.rowSelection)
  .filter(([, selected]) => selected)
  .map(([id]) => Number(id))
  .filter(Number.isFinite);

await bulkDelete.mutateAsync({ data: { ids } });
void queryClient.invalidateQueries({ queryKey: getGetFeatureQueryKey() });
serverTable.tableState.resetRowSelection();
```

Row IDs come from `getRowId` default (`row.id` as string) in `TableRoot`.

## URL filters (nuqs)

Pagination/search use `useTableState` inside `useServerTable`. **Domain filters** (status tabs) use **nuqs** and feed `getQueryParams`:

```tsx
const { status, setStatus } = useShipmentsQueryState();

const getQueryParams = useCallback(
  (state, filter) => ({
    limit: state.pagination.pageSize,
    offset: state.pagination.pageIndex * state.pagination.pageSize,
    search: filter.trim() || undefined,
    status: status === 'all' ? undefined : status,
  }),
  [status],
);
```

See `shipments-admin/hooks/use-shipments-query.ts` + `shipments-table.tsx`.

## Client-only table (rare)

When all rows are already in memory (no API pagination):

```tsx
<Table.Root data={rows} columns={columns} manualPagination={false} manualFiltering={false}>
  <Table.Toolbar searchPlaceholder="Filter locally" />
  <Table.Grid />
  <Table.Pagination />
</Table.Root>
```

Still use `Table.Root` — never raw `useReactTable`.

## Row actions & dialogs

- **Inline menu:** `Table.Grid extendMenuActions={(row) => …}`
- **Delete confirm / edit sheet:** Zustand UI state (`/zustand`) — not table state
- **Mutations:** Orval hooks in the domain component

## Gotchas

- **`getRows` / `getTotal` must match generated response** — inspect `*.schemas.ts`; add `lib/*-list.ts` helpers when shapes vary.
- **Stable columns** — export `const featureColumns: ColumnDef<T>[] = […]` at module scope; never define columns inside the component body.
- **Stable callbacks** — wrap `getQueryParams`, `getRows`, `getTotal` in `useCallback`.
- **Deferred search** — `useServerTable` uses `useDeferredValue` on global filter; don't bypass with instant fetch on every keystroke in domain code.
- **Do not mix** `getPaginationRowModel()` with `manualPagination: true` — `TableRoot` handles this.
- **Near-miss skills:** new admin page scaffold → `/new-admin-domain`; forms → `/admin-forms`; Query tuning → `/luxe-react-performance`.

## Checklist

- [ ] Columns in `sections/*-columns.tsx` as `ColumnDef<Dto*>[]`
- [ ] `useServerTable` + Orval list hook
- [ ] `Table.Root {...serverTable.rootProps}` + Toolbar / Grid / Pagination
- [ ] Bulk delete invalidates `get*QueryKey()`
- [ ] No `useReactTable` outside `src/components/table/`
- [ ] `pnpm check` on touched files
