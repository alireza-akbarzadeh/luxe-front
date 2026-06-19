'use client';

import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDiscountsQueryState } from '@/domains/discounts/hooks/use-discounts-query';
import {
  COUPON_STATUS_TABS,
  getCouponsFromListResponse,
  getCouponsTotalFromListResponse,
  type CouponStatusFilter
} from '@/domains/discounts/lib/discount-filters';
import { couponColumns } from '@/domains/discounts/sections/discount-column';
import { getGetAdminCouponsQueryKey, useGetAdminCoupons } from '@/services/-admin-coupons-get';
import type { DtoCouponListResponse, ModelsCoupon } from '@/services/-admin-coupons-get.schemas';
import { deleteCouponsId } from '@/services/-coupons-{id}-delete';

export function DiscountTable() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { status, setStatus } = useDiscountsQueryState();

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      limit: state.pagination.pageSize,
      offset: state.pagination.pageIndex * state.pagination.pageSize,
      code: filter || undefined,
      status: status === 'all' ? 'all' : status
    }),
    [status]
  );

  const getRows = useCallback(
    (data: DtoCouponListResponse | undefined) => getCouponsFromListResponse(data),
    []
  );

  const getTotal = useCallback(
    (data: DtoCouponListResponse | undefined) => getCouponsTotalFromListResponse(data),
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

  const invalidateList = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: getGetAdminCouponsQueryKey() });
    void queryClient.invalidateQueries({ queryKey: ['coupons-kpi'] });
  }, [queryClient]);

  const openEdit = useCallback(
    (id: number) => {
      router.push(`/dashboard/discounts/edit/${id}`);
    },
    [router]
  );

  const handleDeleteCoupon = useCallback(
    async (coupon: ModelsCoupon) => {
      if (!coupon.id) return;

      const confirmed = window.confirm(`Delete coupon "${coupon.code}"?`);
      if (!confirmed) return;

      try {
        await deleteCouponsId(coupon.id);
        invalidateList();
        toast.success('Coupon deleted');
      } catch (error) {
        toast.error('Failed to delete coupon', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    },
    [invalidateList]
  );

  const handleBulkDelete = useCallback(async () => {
    const ids = Object.entries(serverTable.tableState.rowSelection)
      .filter(([, selected]) => selected)
      .map(([id]) => Number(id))
      .filter((id) => Number.isFinite(id));

    if (ids.length === 0) {
      toast.error('Select at least one coupon');
      return;
    }

    const confirmed = window.confirm(`Delete ${ids.length} selected coupon(s)?`);
    if (!confirmed) return;

    try {
      await Promise.all(ids.map((id) => deleteCouponsId(id)));
      invalidateList();
      serverTable.tableState.resetRowSelection();
      toast.success('Selected coupons deleted');
    } catch (error) {
      toast.error('Failed to delete selected coupons', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    }
  }, [invalidateList, serverTable.tableState]);

  if (serverTable.isError) {
    return (
      <div className='rounded-xl border border-dashed p-12 text-center'>
        <p className='text-lg font-semibold'>Coupons unavailable</p>
        <p className='text-muted-foreground mt-1 text-sm'>Check your connection and try again.</p>
        <Button className='mt-4' variant='outline' onClick={() => serverTable.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Table.Root {...serverTable.rootProps}>
      <Tabs
        value={status}
        onValueChange={(value) => void setStatus(value as CouponStatusFilter)}
        className='px-1'
      >
        <TabsList className='mb-3 h-auto flex-wrap'>
          {COUPON_STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className='text-xs'>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Table.Toolbar
        searchPlaceholder='Search by coupon code...'
        showRefresh
        onRefresh={serverTable.refetch}
        isLoading={serverTable.isFetching}
        showCreate
        onCreate={() => router.push('/dashboard/discounts/create')}
        showClear
        showColumnVisibility
        showSorting
        showExport
        showBulkActions
        onDelete={handleBulkDelete}
      />

      <Table.Grid<ModelsCoupon>
        onRowDoubleClick={(row) => row.original.id && openEdit(row.original.id)}
        isLoading={serverTable.isLoading && serverTable.rows.length === 0}
        extendMenuActions={(row) => (
          <>
            <DropdownMenuItem
              className='gap-2 text-[11px] font-semibold'
              onClick={() => row.original.id && openEdit(row.original.id)}
            >
              <IconPencil className='size-3.5' />
              Edit coupon
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-destructive gap-2 text-[11px] font-semibold'
              onClick={() => void handleDeleteCoupon(row.original)}
            >
              <IconTrash className='size-3.5' />
              Delete coupon
            </DropdownMenuItem>
          </>
        )}
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
