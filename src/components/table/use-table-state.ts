/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState
} from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';

/**
 * Unified table state management hook
 * Reduces prop drilling and encapsulates all table state logic
 */
export function useTableState<TData = unknown>({
  initialPageSize = 20,
  initialPageIndex = 0
}: { initialPageSize?: number; initialPageIndex?: number } = {}) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPageIndex,
    pageSize: initialPageSize
  });

  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [expanded, setExpanded] = useState({});
  const [rowSelection, setRowSelectionState] = useState<RowSelectionState>({});

  // Handlers that accept both value and updater functions (TanStack OnChangeFn)
  const handlePaginationChange = useCallback<OnChangeFn<PaginationState>>((updaterOrValue) => {
    setPagination((old) =>
      typeof updaterOrValue === 'function' ? updaterOrValue(old) : updaterOrValue
    );
  }, []);

  // Reset pagination when filters change
  const handleGlobalFilterChange = useCallback((value: string) => {
    setGlobalFilter(value);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, []);

  const handleColumnFiltersChange = useCallback<OnChangeFn<ColumnFiltersState>>(
    (updaterOrValue) => {
      setColumnFilters((old) =>
        typeof updaterOrValue === 'function' ? updaterOrValue(old) : updaterOrValue
      );
      setPagination((p) => ({ ...p, pageIndex: 0 }));
    },
    []
  );

  const handleSortingChange = useCallback<OnChangeFn<SortingState>>((updaterOrValue) => {
    setSorting((old) =>
      typeof updaterOrValue === 'function' ? updaterOrValue(old) : updaterOrValue
    );
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, []);

  const handleExpandedChange = useCallback<OnChangeFn<any>>((updaterOrValue) => {
    setExpanded((old) =>
      typeof updaterOrValue === 'function' ? updaterOrValue(old) : updaterOrValue
    );
  }, []);

  const handleRowSelectionChange = useCallback<OnChangeFn<RowSelectionState>>((updaterOrValue) => {
    setRowSelectionState((old) =>
      typeof updaterOrValue === 'function' ? updaterOrValue(old) : updaterOrValue
    );
  }, []);

  // Slice data for current page when using manual pagination
  const getPageData = useCallback(
    (data: TData[]): TData[] => {
      const start = pagination.pageIndex * pagination.pageSize;
      const end = start + pagination.pageSize;
      return data.slice(start, end);
    },
    [pagination.pageIndex, pagination.pageSize]
  );

  const selectedRowCount = useMemo(
    () => Object.values(rowSelection).filter(Boolean).length,
    [rowSelection]
  );

  const resetRowSelection = useCallback(() => setRowSelectionState({}), []);

  return useMemo(
    () => ({
      // State
      pagination,
      globalFilter,
      sorting,
      columnFilters,
      expanded,
      rowSelection,
      selectedRowCount,

      // Setters (compatible with TanStack's OnChangeFn)
      setPagination: handlePaginationChange,
      setGlobalFilter: handleGlobalFilterChange,
      setSorting: handleSortingChange,
      setColumnFilters: handleColumnFiltersChange,
      setExpanded: handleExpandedChange,
      setRowSelection: handleRowSelectionChange,

      // Utilities
      getPageData,
      resetPagination: () => setPagination((p) => ({ ...p, pageIndex: 0 })),
      resetRowSelection
    }),
    [
      pagination,
      globalFilter,
      sorting,
      columnFilters,
      expanded,
      rowSelection,
      selectedRowCount,
      handleGlobalFilterChange,
      handleSortingChange,
      handleColumnFiltersChange,
      handleExpandedChange,
      handleRowSelectionChange,
      handlePaginationChange,
      getPageData,
      resetRowSelection
    ]
  );
}
