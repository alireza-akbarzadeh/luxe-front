/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
  Table,
  TableOptions
} from '@tanstack/react-table';
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import * as React from 'react';

import type { TableState } from './use-table-state';
import { useTableState } from './use-table-state';

interface TableContextValue<TData = unknown> {
  table: Table<TData>;
  state: TableState;
}

const TableContext = React.createContext<TableContextValue<any> | null>(null);

export function useTableContext<TData>() {
  const context = React.use(TableContext);
  if (!context) {
    throw new Error('Table components must be wrapped in <Table.Root />');
  }
  return context as TableContextValue<TData>;
}

/** Props that can be spread from useTableState or useServerTable */
export type TableControlledState = Partial<{
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  globalFilter: string;
  onGlobalFilterChange: OnChangeFn<string>;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  columnVisibility: Record<string, boolean>;
  onColumnVisibilityChange: OnChangeFn<Record<string, boolean>>;
  expanded: ExpandedState;
  onExpandedChange: OnChangeFn<ExpandedState>;
}>;

interface TableRootProps<TData> extends TableControlledState {
  children: React.ReactNode;
  data: TData[];
  columns: ColumnDef<TData>[];
  pageCount?: number;
  rowCount?: number;
  manualPagination?: boolean;
  manualFiltering?: boolean;
  manualSorting?: boolean;
  enableRowSelection?: boolean;
  enableColumnPinning?: boolean;
  enableSorting?: boolean;
  getSubRows?: (originalRow: TData, index: number) => TData[] | undefined;
  getRowId?: (originalRow: TData, index: number) => string;
  meta?: Record<string, unknown> & {
    filterFns?: Record<string, any>;
    globalFilterFn?: (row: any, columnId: string, filterValue: any) => boolean;
  };
  /** Pass the full state object from useTableState / useServerTable */
  tableState?: TableState;
  initialPageSize?: number;
}

function defaultGetRowId<TData>(row: TData, index: number): string {
  const record = row as { id?: string | number };
  return record.id !== undefined ? String(record.id) : String(index);
}

export function TableRoot<TData>({
  children,
  data,
  columns,
  tableState: externalTableState,
  initialPageSize = 20,
  pagination: paginationProp,
  onPaginationChange: onPaginationChangeProp,
  globalFilter: globalFilterProp,
  onGlobalFilterChange: onGlobalFilterChangeProp,
  sorting: sortingProp,
  onSortingChange: onSortingChangeProp,
  columnFilters: columnFiltersProp,
  onColumnFiltersChange: onColumnFiltersChangeProp,
  rowSelection: rowSelectionProp,
  onRowSelectionChange: onRowSelectionChangeProp,
  columnVisibility: columnVisibilityProp,
  onColumnVisibilityChange: onColumnVisibilityChangeProp,
  expanded: expandedProp,
  onExpandedChange: onExpandedChangeProp,
  pageCount,
  rowCount,
  manualPagination = false,
  manualFiltering = false,
  manualSorting = false,
  enableRowSelection = true,
  enableColumnPinning = false,
  enableSorting = true,
  getSubRows,
  getRowId = defaultGetRowId,
  meta
}: TableRootProps<TData>) {
  const internalTableState = useTableState({ initialPageSize });
  const tableState = externalTableState ?? internalTableState;

  const pagination = paginationProp ?? tableState.pagination;
  const onPaginationChange = onPaginationChangeProp ?? tableState.setPagination;
  const globalFilter = globalFilterProp ?? tableState.globalFilter;
  const onGlobalFilterChange = onGlobalFilterChangeProp ?? tableState.setGlobalFilter;
  const sorting = sortingProp ?? tableState.sorting;
  const onSortingChange = onSortingChangeProp ?? tableState.setSorting;
  const columnFilters = columnFiltersProp ?? tableState.columnFilters;
  const onColumnFiltersChange = onColumnFiltersChangeProp ?? tableState.setColumnFilters;
  const rowSelection = rowSelectionProp ?? tableState.rowSelection;
  const onRowSelectionChange = onRowSelectionChangeProp ?? tableState.setRowSelection;
  const columnVisibility = columnVisibilityProp ?? tableState.columnVisibility;
  const onColumnVisibilityChange =
    onColumnVisibilityChangeProp ?? tableState.setColumnVisibility;
  const expanded = expandedProp ?? tableState.expanded;
  const onExpandedChange = onExpandedChangeProp ?? tableState.setExpanded;

  const tableOptions = React.useMemo<TableOptions<TData>>(
    () =>
      ({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
        getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
        getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getRowId,
        enableRowSelection,
        enableColumnPinning,
        enableSorting,
        manualPagination,
        manualFiltering,
        manualSorting,
        state: {
          pagination,
          globalFilter,
          sorting,
          columnFilters,
          rowSelection,
          columnVisibility,
          expanded
        },
        onPaginationChange,
        onGlobalFilterChange,
        onSortingChange,
        onColumnFiltersChange,
        onRowSelectionChange,
        onColumnVisibilityChange,
        onExpandedChange,
        ...(pageCount !== undefined && { pageCount }),
        ...(rowCount !== undefined && { rowCount }),
        ...(getSubRows && { getSubRows }),
        ...(meta?.filterFns && { filterFns: meta.filterFns }),
        ...(meta?.globalFilterFn && { globalFilterFn: meta.globalFilterFn }),
        ...(meta && {
          meta: Object.fromEntries(
            Object.entries(meta).filter(([key]) => !['filterFns', 'globalFilterFn'].includes(key))
          )
        })
      }) as TableOptions<TData>,
    [
      data,
      columns,
      getRowId,
      pagination,
      onPaginationChange,
      globalFilter,
      onGlobalFilterChange,
      sorting,
      onSortingChange,
      columnFilters,
      onColumnFiltersChange,
      rowSelection,
      onRowSelectionChange,
      columnVisibility,
      onColumnVisibilityChange,
      expanded,
      onExpandedChange,
      pageCount,
      rowCount,
      manualPagination,
      manualFiltering,
      manualSorting,
      enableRowSelection,
      enableColumnPinning,
      enableSorting,
      getSubRows,
      meta
    ]
  );

  const table = useReactTable(tableOptions);

  const contextValue = React.useMemo(
    () => ({ table, state: tableState }),
    [table, tableState]
  );

  return <TableContext.Provider value={contextValue}>{children}</TableContext.Provider>;
}
