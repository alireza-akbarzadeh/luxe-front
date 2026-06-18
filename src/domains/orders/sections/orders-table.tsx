'use client';

import { IconDownload, IconFilter } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrdersQueryState } from '@/domains/orders/hooks/use-orders-query';
import { downloadOrdersCsv } from '@/domains/orders/lib/order-export';
import {
  getOrdersFromListResponse,
  getOrdersTotalFromListResponse
} from '@/domains/orders/lib/order-list';
import type { OrderStatusFilter } from '@/domains/orders/orders.schema';
import { ORDER_STATUS_TABS } from '@/domains/orders/orders.schema';
import { orderColumns, orderRowMenuActions } from '@/domains/orders/sections/orders-columns';
import { OrdersFilterSheet } from '@/domains/orders/sections/orders-filter-sheet';
import { usePostAdminOrdersBulkStatus } from '@/services/-admin-orders-bulk-status-post';
import type { DtoBulkUpdateOrderStatusRequestStatus } from '@/services/-admin-orders-bulk-status-post.schemas';
import { getGetOrdersQueryKey, useGetOrders } from '@/services/-orders-get';
import type { DtoAdminOrderListItem, GetOrders200 } from '@/services/-orders-get.schemas';

export function OrdersTable() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filterOpen, setFilterOpen] = useState(false);

  const {
    status,
    setStatus,
    fromDate,
    toDate,
    minAmount,
    maxAmount,
    hasActiveFilters,
    resetFilters
  } = useOrdersQueryState();

  const { mutateAsync: bulkUpdateStatus } = usePostAdminOrdersBulkStatus();

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      limit: state.pagination.pageSize,
      offset: state.pagination.pageIndex * state.pagination.pageSize,
      search: filter.trim() || undefined,
      status: status === 'all' ? undefined : status,
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
      min_amount: minAmount ?? undefined,
      max_amount: maxAmount ?? undefined
    }),
    [status, fromDate, toDate, minAmount, maxAmount]
  );

  const getRows = useCallback(
    (data: GetOrders200 | undefined) => getOrdersFromListResponse(data),
    []
  );

  const getTotal = useCallback(
    (data: GetOrders200 | undefined) => getOrdersTotalFromListResponse(data),
    []
  );

  const serverTable = useServerTable({
    columns: orderColumns,
    initialPageSize: 20,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetOrders
  });

  const getSelectedOrderIds = useCallback(() => {
    return Object.entries(serverTable.tableState.rowSelection)
      .filter(([, selected]) => selected)
      .map(([id]) => Number(id))
      .filter((id) => Number.isFinite(id) && id > 0);
  }, [serverTable.tableState.rowSelection]);

  const handleBulkStatus = useCallback(
    async (nextStatus: DtoBulkUpdateOrderStatusRequestStatus, label: string) => {
      const orderIds = getSelectedOrderIds();
      if (orderIds.length === 0) {
        toast.error('Select at least one order');
        return;
      }

      const confirmed = window.confirm(`${label} for ${orderIds.length} order(s)?`);
      if (!confirmed) return;

      try {
        const result = await bulkUpdateStatus({
          data: { order_ids: orderIds, status: nextStatus }
        });
        const updated = result.data?.updated ?? orderIds.length;
        void queryClient.invalidateQueries({ queryKey: getGetOrdersQueryKey() });
        serverTable.tableState.resetRowSelection();
        toast.success(`Updated ${updated} order(s)`);
      } catch (error) {
        toast.error('Bulk update failed', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    },
    [bulkUpdateStatus, getSelectedOrderIds, queryClient, serverTable.tableState]
  );

  const handleExport = useCallback(async () => {
    try {
      await downloadOrdersCsv({
        status: status === 'all' ? undefined : status,
        from_date: fromDate || undefined,
        to_date: toDate || undefined
      });
      toast.success('Export started');
    } catch (error) {
      toast.error('Export failed', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    }
  }, [status, fromDate, toDate]);

  const openOrder = useCallback(
    (id: number) => {
      router.push(`/dashboard/orders/${id}`);
    },
    [router]
  );

  if (serverTable.isError) {
    return (
      <div className='rounded-xl border border-dashed p-12 text-center'>
        <p className='text-lg font-semibold'>Orders unavailable</p>
        <p className='text-muted-foreground mt-1 text-sm'>Check your connection and try again.</p>
        <Button className='mt-4' variant='outline' onClick={() => serverTable.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <Table.Root {...serverTable.rootProps}>
        <Tabs
          value={status}
          onValueChange={(value) => void setStatus(value as OrderStatusFilter)}
          className='px-1'
        >
          <TabsList className='mb-3 h-auto flex-wrap'>
            {ORDER_STATUS_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className='text-xs'>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Table.Toolbar
          searchPlaceholder='Search order #, customer name, or email'
          showRefresh
          onRefresh={serverTable.refetch}
          isLoading={serverTable.isFetching}
          showClear
          showColumnVisibility
          showSorting={false}
          showBulkActions
          onDelete={() => void handleBulkStatus('cancelled', 'Cancel')}
        >
          <Button type='button' variant='outline' size='sm' onClick={() => setFilterOpen(true)}>
            <IconFilter className='size-4' />
            Filters
            {hasActiveFilters ? (
              <span className='bg-primary text-primary-foreground ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold'>
                ON
              </span>
            ) : null}
          </Button>

          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => void handleBulkStatus('shipped', 'Mark as shipped')}
          >
            Mark shipped
          </Button>

          <Button type='button' variant='outline' size='sm' onClick={() => void handleExport()}>
            <IconDownload className='size-4' />
            Export CSV
          </Button>
        </Table.Toolbar>

        <Table.Grid<DtoAdminOrderListItem>
          isLoading={serverTable.isLoading && serverTable.rows.length === 0}
          onRowDoubleClick={(row) => row.original.id && openOrder(row.original.id)}
          getDetailsUrl={(row) =>
            row.original.id ? `/dashboard/orders/${row.original.id}` : '/dashboard/orders'
          }
          extendMenuActions={(row) => orderRowMenuActions(row.original, openOrder)}
        />

        <Table.Pagination
          showPageSize
          showTotalRows
          showJumpToPage
          pageSizeOptions={[10, 20, 50, 100]}
        />
      </Table.Root>

      <OrdersFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        onReset={() => void resetFilters()}
      />
    </>
  );
}
