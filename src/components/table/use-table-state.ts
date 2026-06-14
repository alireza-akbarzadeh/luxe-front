import type {
  ColumnFiltersState,
  ExpandedState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState
} from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';

export interface UseTableStateOptions {
  initialPageSize?: number;
  initialPageIndex?: number;
}

/**
 * Unified table state hook.
 * All setters accept TanStack's OnChangeFn pattern (value or updater function).
 */
export function useTableState({
  initialPageSize = 20,
  initialPageIndex = 0
}: UseTableStateOptions = {}) {
  const [pagination, setPaginationState] = useState<PaginationState>({
    pageIndex: initialPageIndex,
    pageSize: initialPageSize
  });
  const [globalFilter, setGlobalFilterState] = useState('');
  const [sorting, setSortingState] = useState<SortingState>([]);
  const [columnFilters, setColumnFiltersState] = useState<ColumnFiltersState>([]);
  const [expanded, setExpandedState] = useState<ExpandedState>({});
  const [rowSelection, setRowSelectionState] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibilityState] = useState<Record<string, boolean>>({});

  const resolveUpdater = <T>(updaterOrValue: T | ((old: T) => T), old: T): T =>
    typeof updaterOrValue === 'function'
      ? (updaterOrValue as (old: T) => T)(old)
      : updaterOrValue;

  const setPagination = useCallback<OnChangeFn<PaginationState>>((updaterOrValue) => {
    setPaginationState((old) => resolveUpdater(updaterOrValue, old));
  }, []);

  const setGlobalFilter = useCallback<OnChangeFn<string>>((updaterOrValue) => {
    setGlobalFilterState((old) => {
      const next = resolveUpdater(updaterOrValue, old);
      return next;
    });
    setPaginationState((p) => ({ ...p, pageIndex: 0 }));
  }, []);

  const setSorting = useCallback<OnChangeFn<SortingState>>((updaterOrValue) => {
    setSortingState((old) => resolveUpdater(updaterOrValue, old));
    setPaginationState((p) => ({ ...p, pageIndex: 0 }));
  }, []);

  const setColumnFilters = useCallback<OnChangeFn<ColumnFiltersState>>((updaterOrValue) => {
    setColumnFiltersState((old) => resolveUpdater(updaterOrValue, old));
    setPaginationState((p) => ({ ...p, pageIndex: 0 }));
  }, []);

  const setExpanded = useCallback<OnChangeFn<ExpandedState>>((updaterOrValue) => {
    setExpandedState((old) => resolveUpdater(updaterOrValue, old));
  }, []);

  const setRowSelection = useCallback<OnChangeFn<RowSelectionState>>((updaterOrValue) => {
    setRowSelectionState((old) => resolveUpdater(updaterOrValue, old));
  }, []);

  const setColumnVisibility = useCallback<OnChangeFn<Record<string, boolean>>>((updaterOrValue) => {
    setColumnVisibilityState((old) => resolveUpdater(updaterOrValue, old));
  }, []);

  const selectedRowCount = useMemo(
    () => Object.values(rowSelection).filter(Boolean).length,
    [rowSelection]
  );

  const resetRowSelection = useCallback(() => setRowSelectionState({}), []);
  const resetPagination = useCallback(
    () => setPaginationState((p) => ({ ...p, pageIndex: 0 })),
    []
  );
  const resetFilters = useCallback(() => {
    setGlobalFilterState('');
    setColumnFiltersState([]);
    setPaginationState((p) => ({ ...p, pageIndex: 0 }));
  }, []);

  return useMemo(
    () => ({
      pagination,
      globalFilter,
      sorting,
      columnFilters,
      expanded,
      rowSelection,
      columnVisibility,
      selectedRowCount,
      setPagination,
      setGlobalFilter,
      setSorting,
      setColumnFilters,
      setExpanded,
      setRowSelection,
      setColumnVisibility,
      resetPagination,
      resetRowSelection,
      resetFilters
    }),
    [
      pagination,
      globalFilter,
      sorting,
      columnFilters,
      expanded,
      rowSelection,
      columnVisibility,
      selectedRowCount,
      setPagination,
      setGlobalFilter,
      setSorting,
      setColumnFilters,
      setExpanded,
      setRowSelection,
      setColumnVisibility,
      resetPagination,
      resetRowSelection,
      resetFilters
    ]
  );
}

export type TableState = ReturnType<typeof useTableState>;
