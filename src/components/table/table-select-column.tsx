import type { ColumnDef, Table } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';

const CHECKBOX_CLASS = 'border-muted-foreground/30 rounded-md';

function getSelectAllCheckedState<TData>(table: Table<TData>) {
  if (table.getIsAllPageRowsSelected()) return true;
  if (table.getIsSomePageRowsSelected()) return 'indeterminate';
  return false;
}

/** Clears any current selection, otherwise selects all rows on the current page. */
function togglePageSelection<TData>(table: Table<TData>) {
  const hasSelection =
    table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected();

  if (hasSelection) {
    table.resetRowSelection();
    return;
  }

  table.toggleAllPageRowsSelected(true);
}

/**
 * Standard row-selection column for dashboard tables.
 * Header checkbox supports indeterminate state and reliably deselects all rows.
 */
export function createSelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: 'select',
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={getSelectAllCheckedState(table)}
        onClick={(event) => event.stopPropagation()}
        onCheckedChange={() => togglePageSelection(table)}
        aria-label='Select all'
        className={CHECKBOX_CLASS}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onClick={(event) => event.stopPropagation()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className={CHECKBOX_CLASS}
      />
    )
  };
}
