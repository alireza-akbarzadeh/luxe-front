# TanStack Table concepts (Luxe mapping)

Reference when extending **`src/components/table/`** or debugging table behavior. Domain code should not reimplement these — use `Table` + `useServerTable`.

## Architecture (upstream)

| Building block | Luxe location |
|----------------|---------------|
| Column definitions | `domains/*/sections/*-columns.tsx` |
| Table instance | `table-context.tsx` → `useReactTable` |
| Row models | Configured in `TableRoot` based on `manual*` flags |
| Render | `table-grid.tsx` → `flexRender` |

## Data & column stability

TanStack requires stable `data` and `columns` references.

| Layer | How Luxe handles it |
|-------|---------------------|
| Columns | Module-level `export const xColumns = […]` |
| Server rows | `useMemo` in `useServerTable` via `getRows(data)` |
| Query params | `useMemo` + `useCallback` for getters |

React Compiler reduces need for manual `useMemo` on columns, but **never define columns inside component render**.

## Server-side vs client-side

**Admin lists (default):**

```tsx
useServerTable({
  manualPagination: true,  // default
  manualFiltering: true,   // default — search hits API via deferredFilter
  manualSorting: false,    // override when API supports sort params
});
```

When `manualPagination: true`, `TableRoot` omits `getPaginationRowModel`. Pass `pageCount` / `rowCount` from API total via `rootProps`.

**Client-only:** `manualPagination: false` on `Table.Root` — enables client pagination row model.

## Sorting & filtering

| Feature | Server table | Client table |
|---------|--------------|--------------|
| Global search | `state.globalFilter` → `getQueryParams` | `getFilteredRowModel()` |
| Column filters | Map `state.columnFilters` in `getQueryParams` | `getFilteredRowModel()` |
| Sorting | Set `manualSorting: true`, map `state.sorting` | `getSortedRowModel()` |

Toolbar: `showSorting={false}` when API has no sort (see shipments table).

## Row selection

State: `tableState.rowSelection` from `useServerTable`.

```tsx
table.getSelectedRowModel().rows  // via useTableContext() inside table components only
```

Use `createSelectColumn()` — IDs from `getRowId` (`row.id` string).

## Column visibility

`Table.Toolbar showColumnVisibility` wires to `tableState.columnVisibility`.

## Expansion, grouping, pinning, virtualization

Supported via `TableRoot` props (`getSubRows`, `enableColumnPinning`, `expanded` state) but ** rarely used in Luxe admin**. Extend `table-context.tsx` first, then document in this skill.

Virtualization: `@tanstack/react-virtual` would integrate inside `Table.Grid` — not yet standard; ask before adding to a domain.

## Extending the table system

When a feature needs new TanStack options:

1. Add prop to `TableRoot` / `useServerTable` if server-driven
2. Wire in `tableOptions` useMemo in `table-context.tsx`
3. Expose via compound component if needed
4. Do **not** duplicate `useReactTable` in domains

## Common pitfalls (from upstream)

| Pitfall | Luxe fix |
|---------|----------|
| Columns inline in JSX | `sections/*-columns.tsx` |
| Missing `getCoreRowModel` | Always in `TableRoot` |
| `manualPagination` + client pagination model | Defaults handled by `TableRoot` |
| No `id` with `accessorFn` | Set explicit `id` |
| Unstable `data` ref | `useServerTable` memos rows from query |
| Raw `<table>` | `Table.Grid` |

## Package

Already installed: `@tanstack/react-table`. Fuzzy filter utils (`@tanstack/match-sorter-utils`) only if adding client fuzzy search to `TableRoot` meta — not used in standard admin tables today.
