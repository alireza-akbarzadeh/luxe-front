'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import type { TableState } from '~/src/components/table/data-table';
import { Table, useServerTable } from '~/src/components/table/data-table';
import { brandColumns } from '~/src/domains/brands/sections/brand-columns';
import { useGetBrands } from '~/src/services/-brands-get';
import type { DtoBrandResponse, GetBrands200 } from '~/src/services/-brands-get.schemas';

export function BrandsDomains() {
  const { push } = useRouter();

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      limit: state.pagination.pageSize,
      page: state.pagination.pageIndex * state.pagination.pageSize,
      search: filter || undefined
    }),
    []
  );

  const getRows = useCallback((data: GetBrands200 | undefined) => data?.data ?? [], []);

  // API does not return total count — estimate from current page size
  const getTotal = useCallback((data: GetBrands200 | undefined) => data?.data?.length ?? 0, []);

  const serverTable = useServerTable({
    columns: brandColumns,
    initialPageSize: 20,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetBrands
  });

  return (
    <Table.Root {...serverTable.rootProps}>
      <Table.Toolbar
        searchPlaceholder='Search by name'
        showRefresh
        onRefresh={serverTable.refetch}
        isLoading={serverTable.isFetching}
        showCreate
        onCreate={() => push('/dashboard/products/create')}
        showClear
        showColumnVisibility
        showBulkActions
      />
      <Table.Grid<DtoBrandResponse>
        isLoading={serverTable.isLoading}
        onRowDoubleClick={(row) => push(`/dashboard/brands/edit/${row.original.id}`)}
      />
      <Table.Pagination
        showPageSize
        showTotalRows
        showJumpToPage
        pageSizeOptions={[10, 20, 50, 100, 200]}
      />
    </Table.Root>
  );
}
