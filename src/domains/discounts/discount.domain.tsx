'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { couponColumns } from '@/domains/discounts/sections/discount-column';
import type { DtoCouponListResponse, ModelsCoupon } from '@/services/-admin-coupons-get.schemas';
import { useGetAdminCoupons } from '@/services/-admin-coupons-get';

export function DiscountDomain() {
  const { push } = useRouter();

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      limit: state.pagination.pageSize,
      offset: state.pagination.pageIndex * state.pagination.pageSize,
      code: filter || undefined,
      status: 'all' as const
    }),
    []
  );

  const getRows = useCallback(
    (data: DtoCouponListResponse | undefined) => data?.data?.coupons ?? [],
    []
  );

  const getTotal = useCallback(
    (data: DtoCouponListResponse | undefined) => data?.data?.total ?? 0,
    []
  );

  const serverTable = useServerTable({
    columns: couponColumns,
    initialPageSize: 20,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetAdminCoupons
  });

  return (
    <Table.Root {...serverTable.rootProps}>
      <Table.Toolbar
        searchPlaceholder='Search by coupon code...'
        showRefresh
        onRefresh={serverTable.refetch}
        isLoading={serverTable.isFetching}
        showCreate
        onCreate={() => push('/dashboard/discounts/create')}
        showClear
        showColumnVisibility
        showSorting
        showExport
        showBulkActions
      />
      <Table.Grid<ModelsCoupon>
        onRowDoubleClick={(row) => push(`/dashboard/discounts/edit/${row.original.id}`)}
        isLoading={serverTable.isLoading}
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
