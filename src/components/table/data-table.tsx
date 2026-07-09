import { TableContainer } from '~/src/components/table/table-container';

import { TableBulkActions } from './table-bulk-actions';
import { TableRoot } from './table-context';
import { TableFilterTabs } from './table-filter-tabs';
import { TableGrid } from './table-grid';
import { TableLoading } from './table-loading';
import { TableMobileList } from './table-mobile-list';
import { TablePagination } from './table-pagination';
import { TableSearch } from './table-search';
import { TableStatusFilters } from './table-status-filters';
import { TableToolbar } from './table-toolbar';
import { useServerTable } from './use-server-table';
import { useTableState } from './use-table-state';

export { useServerTable, useTableState };
export type { TableControlledState } from './table-context';
export { createSelectColumn } from './table-select-column';
export type { TableState } from './use-table-state';

/**
 * Compound table system powered by TanStack Table + React Context.
 *
 * ## Quick start (server-driven)
 * ```tsx
 * const serverTable = useServerTable({
 *   columns: productColumns,
 *   getQueryParams: (state, filter) => ({ limit: state.pagination.pageSize, ... }),
 *   getRows: (data) => data?.data?.products ?? [],
 *   getTotal: (data) => data?.data?.total,
 *   useQuery: useGetProducts,
 * });
 *
 * <Table.Root {...serverTable.rootProps}>
 *   <Table.Toolbar searchPlaceholder="Search..." showRefresh onRefresh={serverTable.refetch} />
 *   <Table.Grid isLoading={serverTable.isLoading} />
 *   <Table.Pagination />
 * </Table.Root>
 * ```
 *
 * ## Client-driven (no server pagination)
 * ```tsx
 * <Table.Root data={rows} columns={columns}>
 *   <Table.Toolbar searchPlaceholder="Search..." />
 *   <Table.Grid />
 *   <Table.Pagination />
 * </Table.Root>
 * ```
 */
export const Table = {
  Root: TableRoot,
  Search: TableSearch,
  FilterTabs: TableFilterTabs,
  StatusFilters: TableStatusFilters,
  Grid: TableGrid,
  MobileList: TableMobileList,
  Pagination: TablePagination,
  BulkActions: TableBulkActions,
  Loading: TableLoading,
  Toolbar: TableToolbar,
  Container: TableContainer
};
