import type { ColumnDef } from '@tanstack/react-table';
import { useDeferredValue, useMemo } from 'react';

import type { TableControlledState } from './table-context';
import type { TableState } from './use-table-state';
import { useTableState } from './use-table-state';

interface QueryResult<TQueryData> {
  data: TQueryData | undefined;
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
  error?: unknown;
  isError?: boolean;
}

interface UseServerTableOptions<TData, TQueryData, TQueryParams> {
  columns: ColumnDef<TData>[];
  initialPageSize?: number;
  /** Build API params from current table state + deferred filter */
  getQueryParams: (state: TableState, deferredFilter: string) => TQueryParams;
  /** Extract row array from query response */
  getRows: (data: TQueryData | undefined) => TData[];
  /** Extract total count from query response (for server pagination). Omit or return undefined to fall back to current row count. */
  getTotal?: (data: TQueryData | undefined) => number | undefined;
  /** TanStack Query hook — called with computed params */
  useQuery: (params: TQueryParams) => QueryResult<TQueryData>;
  manualPagination?: boolean;
  manualFiltering?: boolean;
  manualSorting?: boolean;
  enableRowSelection?: boolean;
}

/**
 * Bundles table state + server query into props ready for `<Table.Root>`.
 * Eliminates repetitive state wiring for server-driven tables.
 *
 * @example
 * ```tsx
 * const serverTable = useServerTable({
 *   columns: productColumns,
 *   getQueryParams: (state, filter) => ({
 *     limit: state.pagination.pageSize,
 *     offset: state.pagination.pageIndex * state.pagination.pageSize,
 *     name: filter || undefined,
 *   }),
 *   getRows: (data) => data?.data?.products ?? [],
 *   getTotal: (data) => data?.data?.total,
 *   useQuery: useGetProducts,
 * });
 *
 * return (
 *   <Table.Root {...serverTable.rootProps}>
 *     <Table.Toolbar onRefresh={serverTable.refetch} ... />
 *     <Table.Grid isLoading={serverTable.isLoading} />
 *     <Table.Pagination />
 *   </Table.Root>
 * );
 * ```
 */
export function useServerTable<TData, TQueryData, TQueryParams>({
  columns,
  initialPageSize = 20,
  getQueryParams,
  getRows,
  getTotal,
  useQuery,
  manualPagination = true,
  manualFiltering = true,
  manualSorting = false,
  enableRowSelection = true
}: UseServerTableOptions<TData, TQueryData, TQueryParams>) {
  const tableState = useTableState({ initialPageSize });
  const deferredFilter = useDeferredValue(tableState.globalFilter);

  const { pageIndex, pageSize: rawPageSize } = tableState.pagination;
  const pageSize = Math.max(1, rawPageSize);

  const queryParams = useMemo(
    () => getQueryParams(tableState, deferredFilter),
    [tableState, deferredFilter, getQueryParams, pageIndex, pageSize]
  );

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery(queryParams);

  const rows = useMemo(() => getRows(data), [data, getRows]);
  const reportedTotal = getTotal?.(data);
  const total =
    typeof reportedTotal === 'number' && Number.isFinite(reportedTotal)
      ? reportedTotal
      : rows.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const rootProps = useMemo(
    () =>
      ({
        data: rows,
        columns,
        tableState,
        pageCount,
        rowCount: total,
        manualPagination,
        manualFiltering,
        manualSorting,
        enableRowSelection
      }) satisfies TableControlledState & {
        data: TData[];
        columns: ColumnDef<TData>[];
        tableState: TableState;
        pageCount: number;
        rowCount: number;
        manualPagination: boolean;
        manualFiltering: boolean;
        manualSorting: boolean;
        enableRowSelection: boolean;
      },
    [
      rows,
      columns,
      tableState,
      pageCount,
      total,
      manualPagination,
      manualFiltering,
      manualSorting,
      enableRowSelection
    ]
  );

  return {
    tableState,
    rootProps,
    rows,
    total,
    isLoading,
    isFetching,
    refetch,
    error,
    isError
  };
}
