'use client';
import { useRouter } from 'next/navigation';
import { useDeferredValue } from 'react';

import { Table, useTableState } from '~/src/components/table/data-table';
import { productColumns } from '~/src/domains/product-dashboard/sections/product-columns';
import { useGetProducts } from '~/src/services/-products-get';
import type { DtoProductWithLike } from '~/src/services/-products-get.schemas';

export function ProductsDomains() {
  const { push } = useRouter();
  const tableState = useTableState({ initialPageSize: 20 });
  const deferredFilter = useDeferredValue(tableState.globalFilter);

  const { data, isLoading, isFetching, refetch } = useGetProducts({
    limit: tableState.pagination.pageSize,
    offset: tableState.pagination.pageIndex * tableState.pagination.pageSize,
    name: deferredFilter || undefined
  });

  const products = data?.data?.products ?? [];
  const total = data?.data?.total ?? 0;

  return (
    <Table.Root
      data={products}
      columns={productColumns}
      pagination={tableState.pagination}
      onPaginationChange={tableState.setPagination}
      globalFilter={tableState.globalFilter}
      onGlobalFilterChange={tableState.setGlobalFilter}
      sorting={tableState.sorting}
      onSortingChange={tableState.setSorting}
      columnFilters={tableState.columnFilters}
      onColumnFiltersChange={tableState.setColumnFilters}
      pageCount={Math.ceil(total / tableState.pagination.pageSize)}
      rowCount={total}
      manualPagination
      manualFiltering
    >
      <Table.Toolbar
        searchPlaceholder='Search by name or SKU'
        showRefresh
        onRefresh={refetch}
        isLoading={isFetching}
        showCreate
        onCreate={() => push('/dashboard/products/create')}
        showClear
        onClearFilter={() => tableState.setGlobalFilter('')}
        globalFilter={tableState.globalFilter}
      />
      <Table.Grid<DtoProductWithLike>
        onRowDoubleClick={(row) => push(`/dashboard/products/edit/${row.original.id}`)}
        columnsCount={8}
        isLoading={isLoading}
      />
      <Table.Pagination />
    </Table.Root>
  );
}
