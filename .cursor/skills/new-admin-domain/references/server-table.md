# Server-driven admin table

Load when wiring a list page with pagination/search.

## Pattern (from categories)

```tsx
import { Table, useServerTable } from '@/components/table/data-table';

const getQueryParams = useCallback(
  (state: TableState, filter: string) => ({
    limit: state.pagination.pageSize,
    offset: state.pagination.pageIndex * state.pagination.pageSize,
    search: filter || undefined,
  }),
  []
);

const serverTable = useServerTable({
  columns: featureColumns,
  initialPageSize: 20,
  getQueryParams,
  getRows: (data) => data?.data?.items ?? [],   // match your DTO shape
  getTotal: (data) => data?.data?.total,
  useQuery: useGetFeature,                       // Orval hook
});

return (
  <Table.Root>
    <Table.Toolbar … />
    <Table.Grid table={serverTable.table} … />
    <Table.Pagination table={serverTable.table} … />
  </Table.Root>
);
```

## Gotchas

- **`getRows` / `getTotal` must match the generated response type** — inspect `*.schemas.ts` for the list wrapper (`data?.data?.categories` vs `items`, etc.).
- **Bulk actions:** invalidate with `getGetFeatureQueryKey()` after mutations.
- **Columns file:** `sections/*-columns.tsx` as `ColumnDef<T>[]` — keep actions dispatching to Zustand for delete/edit dialogs.
