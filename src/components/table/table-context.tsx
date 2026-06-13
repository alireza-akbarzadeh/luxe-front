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

// Define the context with a generic TData
interface TableContextValue<TData = unknown> {
  table: Table<TData>;
}

const TableContext = React.createContext<TableContextValue<any> | null>(null);

export function useTableContext<TData>() {
  const context = React.use(TableContext);
  if (!context) {
    throw new Error('Table components must be wrapped in <Table.Root />');
  }
  // Cast to the specific TData type requested by the caller
  return context as TableContextValue<TData>;
}

/**
 * Enhanced TableRoot Props supporting both simple and advanced use cases
 */
interface TableRootProps<TData> {
  children: React.ReactNode;
  data: TData[];
  columns: ColumnDef<TData>[];

  // ===== STATE MANAGEMENT =====
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  globalFilter?: string;

  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  onGlobalFilterChange?: (value: string) => void;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;

  // ===== PAGINATION CONFIG =====
  pageCount?: number;
  rowCount?: number;
  rowSelection?: RowSelectionState;
  manualPagination?: boolean;

  // ===== FILTERING CONFIG =====
  manualFiltering?: boolean;

  // ===== SORTING CONFIG =====
  manualSorting?: boolean;

  // ===== FEATURES =====
  enableRowSelection?: boolean;
  enableColumnPinning?: boolean;
  enableSorting?: boolean;

  // ===== HIERARCHICAL DATA =====
  getSubRows?: (originalRow: TData, index: number) => TData[] | undefined;
  expanded?: ExpandedState;
  onExpandedChange?: OnChangeFn<ExpandedState>;

  // ===== ADDITIONAL OPTIONS =====
  meta?: Record<string, unknown> & {
    filterFns?: Record<string, any>;
    globalFilterFn?: (row: any, columnId: string, filterValue: any) => boolean;
  };
}

export function TableRoot<TData>({
  children,
  data,
  columns,
  pagination,
  onPaginationChange,
  globalFilter,
  onGlobalFilterChange,
  sorting,
  onSortingChange,
  columnFilters,
  onColumnFiltersChange,
  rowSelection: rowSelectionProp,
  onRowSelectionChange: onRowSelectionChangeProp,
  pageCount,
  rowCount,
  manualPagination = false,
  manualFiltering = false,
  manualSorting = false,
  enableRowSelection = true,
  enableColumnPinning = false,
  enableSorting = true,
  getSubRows,
  expanded,
  onExpandedChange,
  meta
}: TableRootProps<TData>) {
  // Internal fallback state if consumer doesn't control rowSelection
  const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({});

  const rowSelection = rowSelectionProp ?? internalRowSelection;
  const onRowSelectionChange = onRowSelectionChangeProp ?? setInternalRowSelection;

  const tableOptions = React.useMemo<TableOptions<TData>>(() => {
    return {
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      enableRowSelection,
      enableColumnPinning,
      enableSorting,
      manualPagination,
      manualFiltering,
      manualSorting,
      state: {
        ...(pagination && { pagination }),
        ...(globalFilter !== undefined && { globalFilter }),
        ...(sorting && { sorting }),
        ...(columnFilters && { columnFilters }),
        rowSelection,
        ...(expanded !== undefined && { expanded })
      },
      onRowSelectionChange,
      ...(onPaginationChange && { onPaginationChange }),
      ...(onGlobalFilterChange && { onGlobalFilterChange }),
      ...(onSortingChange && { onSortingChange }),
      ...(onColumnFiltersChange && { onColumnFiltersChange }),
      ...(onExpandedChange && { onExpandedChange }),
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
    } as TableOptions<TData>;
  }, [
    data,
    columns,
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
    pageCount,
    rowCount,
    manualPagination,
    manualFiltering,
    manualSorting,
    enableRowSelection,
    enableColumnPinning,
    enableSorting,
    getSubRows,
    expanded,
    onExpandedChange,
    meta
  ]);

  const table = useReactTable(tableOptions);

  return <TableContext.Provider value={{ table }}>{children}</TableContext.Provider>;
}
