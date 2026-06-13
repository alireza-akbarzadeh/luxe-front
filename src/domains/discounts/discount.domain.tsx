// src/domains/discounts/discount.domain.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useDeferredValue } from 'react';

import { Table, useTableState } from '~/src/components/table/data-table';
import { couponColumns } from '~/src/domains/discounts/sections/discount-column';
import { useGetCoupons } from '~/src/services/-coupons-get';
import type { ModelsCoupon } from '~/src/services/-coupons-get.schemas';

export function DiscountDomain() {
  const { push } = useRouter();
  const tableState = useTableState({ initialPageSize: 20 });
  const deferredFilter = useDeferredValue(tableState.globalFilter);

  const { data, isLoading, isFetching, refetch } = useGetCoupons({
    limit: tableState.pagination.pageSize,
    offset: tableState.pagination.pageIndex * tableState.pagination.pageSize,
    code: deferredFilter || undefined
  });

  const coupons = data?.data?.coupons ?? [];
  const total = data?.data?.total ?? 0;

  return (
    <Table.Root
      data={coupons}
      columns={couponColumns}
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
        searchPlaceholder='Search by coupon code...'
        showRefresh
        onRefresh={refetch}
        isLoading={isFetching}
        showCreate
        onCreate={() => push('/dashboard/discounts/create')}
        showClear
        onClearFilter={() => tableState.setGlobalFilter('')}
        globalFilter={tableState.globalFilter}
        showColumnVisibility
        showSorting
        showExport
        showBulkActions
      />
      <Table.Grid<ModelsCoupon>
        onRowDoubleClick={(row) => push(`/dashboard/discounts/edit/${row.original.id}`)}
        columnsCount={9}
        isLoading={isLoading}
      />
      <Table.Pagination
        showPageSize
        showTotalRows
        showJumpToPage
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </Table.Root>
  );
}
