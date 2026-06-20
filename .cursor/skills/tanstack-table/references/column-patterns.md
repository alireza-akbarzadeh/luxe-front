# Column patterns (Luxe)

## File layout

```
src/domains/<domain>/sections/<feature>-columns.tsx   # ColumnDef<T>[]
src/domains/<domain>/lib/<feature>-list.ts            # getRows/getTotal helpers (optional)
src/domains/<domain>/<feature>.domain.tsx             # useServerTable + Table.Root
```

## Standard columns

### Selection (bulk actions)

```tsx
import { createSelectColumn } from '@/components/table/data-table';

export const itemColumns: ColumnDef<DtoItem>[] = [
  createSelectColumn<DtoItem>(),
  // …
];
```

Uses shadcn `Checkbox`, indeterminate header, page-scoped select-all.

### Accessor column

```tsx
{
  accessorKey: 'created_at',
  header: 'Created',
  cell: ({ row }) => formatDate(row.original.created_at, DATE_FORMATS.SHORT),
}
```

### Display column (computed / actions)

```tsx
{
  id: 'logo',
  header: 'Logo',
  enableSorting: false,
  cell: ({ row }) => <Image src={row.original.logo_url ?? ''} … />,
}
```

Always set `id` when there is no `accessorKey`.

### Workflow status column

Reuse helper when entity has workflow:

```tsx
import { createWorkflowStateColumn } from '@/domains/workflows/lib/create-workflow-state-column';

createWorkflowStateColumn<DtoBrandResponse>({
  workflowKey: 'brand',
  getEntityId: (row) => row.id,
  getState: (row) => row.workflow_state ?? mapBrandStatusToStateView(row.status),
  header: 'Workflow',
});
```

## Row menu actions

Prefer `extendMenuActions` on `Table.Grid` (see `brand.domain.tsx`) or export a helper:

```tsx
export function shipmentRowMenuActions(item: DtoItem, onOpen: (id: number) => void) {
  return (
    <>
      <DropdownMenuItem onClick={() => item.id && onOpen(item.id)}>View</DropdownMenuItem>
    </>
  );
}
```

## TypeScript

- Row type = Orval `Dto*` / `Models*` from `*.schemas.ts`
- Column array type: `ColumnDef<DtoBrandResponse>[]`
- Avoid `createColumnHelper` unless a file already uses it — `ColumnDef` objects match most Luxe columns

### Column meta (advanced)

If a column needs custom filter UI inside shared table components, extend meta in `table-context` consumers only — rare in Luxe admin tables.

## Anti-patterns

```tsx
// WRONG — new column refs every render
function MyTable() {
  const columns = [{ accessorKey: 'name', header: 'Name' }];
  …
}

// WRONG — raw table markup in domain
function MyTable() {
  const table = useReactTable({ … });
  return <table>…</table>;
}

// WRONG — actions column calling axios directly
cell: ({ row }) => <button onClick={() => fetch('/api/…')}>Delete</button>
```

Use module-level `export const …Columns` and Orval mutations in the parent domain component.

## Styling cells

Use Tailwind on cell content. For layout inside cells, prefer `@/components/ui/flex` when refactoring touch points — see `/layout-typography` for new work.

Do not import `flexRender` in domains — `Table.Grid` handles rendering via context.
