'use client';
import { useRouter } from 'next/navigation';
import { useDeferredValue } from 'react';

import { Table, useTableState } from '~/src/components/table/data-table';
import { brandColumns } from '~/src/domains/brands/sections/brand-columns';
import { useGetBrands } from '~/src/services/-brands-get';
import type { ModelsCategory } from '~/src/services/-checkout-post.schemas';

export function BrandsDomains() {
  const { push } = useRouter();
  const tableState = useTableState({ initialPageSize: 20 });
  const deferredFilter = useDeferredValue(tableState.globalFilter);

  const { data, isLoading, isFetching, refetch } = useGetBrands({
    limit: tableState.pagination.pageSize,
    page: tableState.pagination.pageIndex * tableState.pagination.pageSize,
    search: deferredFilter
  });

  const brands = data?.data ?? [];
  // TODO: Update API to return total count in response
  // For now, use current page length as estimate
  const total = brands.length > 0 ? brands.length : 0;

  return (
    <Table.Root
      data={brands}
      columns={brandColumns}
      pagination={tableState.pagination}
      onPaginationChange={tableState.setPagination}
      globalFilter={tableState.globalFilter}
      onGlobalFilterChange={tableState.setGlobalFilter}
      pageCount={Math.ceil(total / tableState.pagination.pageSize)}
      rowCount={total}
      manualPagination
      manualFiltering
      enableRowSelection
    >
      <Table.Toolbar
        searchPlaceholder='Search by name'
        showRefresh
        onRefresh={refetch}
        isLoading={isFetching}
        showCreate
        onCreate={() => push('/dashboard/products/create')}
        showClear
        onClearFilter={() => tableState.setGlobalFilter('')}
        showColumnVisibility
        showBulkActions
        globalFilter={tableState.globalFilter}
      />

      <Table.Grid<ModelsCategory>
        isLoading={isLoading}
        onRowDoubleClick={(row) => push(`/dashboard/brands/edit/${row.original.id}`)}
        columnsCount={8}
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
