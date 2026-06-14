'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import type { TableState } from '~/src/components/table/data-table';
import { Table, useServerTable } from '~/src/components/table/data-table';
import { productColumns } from '~/src/domains/product-dashboard/sections/product-columns';
import { useGetProducts } from '~/src/services/-products-get';
import type { DtoProductWithLike, GetProducts200 } from '~/src/services/-products-get.schemas';

export function ProductsDomains() {
  const { push } = useRouter();

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      limit: state.pagination.pageSize,
      offset: state.pagination.pageIndex * state.pagination.pageSize,
      name: filter || undefined
    }),
    []
  );

  const getRows = useCallback((data: GetProducts200 | undefined) => data?.data?.products ?? [], []);

  const getTotal = useCallback((data: GetProducts200 | undefined) => data?.data?.total ?? 0, []);
  const serverTable = useServerTable({
    columns: productColumns,
    initialPageSize: 20,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetProducts
  });

  return (
    <Table.Root {...serverTable.rootProps}>
      <Table.Toolbar
        searchPlaceholder='Search by name or SKU'
        showRefresh
        onRefresh={serverTable.refetch}
        isLoading={serverTable.isFetching}
        showCreate
        onCreate={() => push('/dashboard/products/create')}
        showClear
      />
      <Table.Grid<DtoProductWithLike>
        onRowDoubleClick={(row) => push(`/dashboard/products/edit/${row.original.id}`)}
        isLoading={serverTable.isLoading}
      />
      <Table.Pagination />
    </Table.Root>
  );
}
