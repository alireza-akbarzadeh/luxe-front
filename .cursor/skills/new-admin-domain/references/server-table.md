# Server-driven admin table

Load when wiring a list page with pagination/search. Full skill: `/tanstack-table`.

## Pattern (from categories / brands)

```tsx
import { Table, useServerTable } from '@/components/table/data-table';
import type { TableState } from '@/components/table/data-table';

const getQueryParams = useCallback(
  (state: TableState, filter: string) => ({
    limit: state.pagination.pageSize,
    offset: state.pagination.pageIndex * state.pagination.pageSize,
    search: filter || undefined,
  }),
  [],
);

const serverTable = useServerTable({
  columns: featureColumns,
  initialPageSize: 20,
  getQueryParams,
  getRows: (data) => data?.data?.items ?? [],
  getTotal: (data) => data?.data?.total,
  useQuery: useGetFeature,
});

return (
  <Table.Root {...serverTable.rootProps}>
    <Table.Toolbar searchPlaceholder="Search…" showRefresh onRefresh={serverTable.refetch} />
    <Table.Grid isLoading={serverTable.isLoading && serverTable.rows.length === 0} />
    <Table.Pagination showPageSize showTotalRows />
  </Table.Root>
);
```

## Gotchas

- **`getRows` / `getTotal` must match the generated response type** — inspect `*.schemas.ts` (`data?.data?.categories` vs `items`, `page` vs `offset`).
- **Bulk actions:** invalidate with `getGetFeatureQueryKey()` after mutations; `resetRowSelection()`.
- **Columns:** `sections/*-columns.tsx` as `ColumnDef<T>[]` with `createSelectColumn()`.
- **Status tabs:** nuqs hook + include in `getQueryParams` deps — see `shipments-table.tsx`.
- **Never `useReactTable` in domains** — only inside `src/components/table/table-context.tsx`.
