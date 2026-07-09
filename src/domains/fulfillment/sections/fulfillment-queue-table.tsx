'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FulfillmentActionDialog } from '@/domains/fulfillment/components/fulfillment-action-dialog';
import { useFulfillmentQueryState } from '@/domains/fulfillment/hooks/use-fulfillment-query';
import { useFulfillmentTransition } from '@/domains/fulfillment/hooks/use-fulfillment-transition';
import {
  getOrderWorkflowStateForQueue,
  getQueueAction,
  isOrderFulfillmentQueue
} from '@/domains/fulfillment/lib/fulfillment-queues';
import {
  FULFILLMENT_QUEUE_TABS,
  type FulfillmentQueue
} from '@/domains/fulfillment/schemas/fulfillment.schema';
import {
  createFulfillmentOrderColumns,
  fulfillmentOrderRowMenuActions
} from '@/domains/fulfillment/sections/fulfillment-order-columns';
import { FulfillmentTrackingTable } from '@/domains/fulfillment/sections/fulfillment-tracking-table';
import type { FulfillmentShipDialogState } from '@/domains/fulfillment/types/fulfillment.types';
import {
  getOrdersFromListResponse,
  getOrdersTotalFromListResponse
} from '@/domains/orders/lib/order-list';
import { useGetOrders } from '@/services/-orders-get';
import type { DtoAdminOrderListItem, GetOrders200 } from '@/services/-orders-get.schemas';

export function FulfillmentQueueTable() {
  const router = useRouter();
  const { queue, setQueue } = useFulfillmentQueryState();
  const [actionTarget, setActionTarget] = useState<FulfillmentShipDialogState | null>(null);

  const openOrder = useCallback(
    (id: number) => {
      router.push(`/dashboard/orders/${id}`);
    },
    [router]
  );

  const handleTransitionSuccess = useCallback(() => {
    setActionTarget(null);
  }, []);

  const { applyTransition, isPending } = useFulfillmentTransition(handleTransitionSuccess);

  const orderQueue = isOrderFulfillmentQueue(queue) ? queue : 'pick';

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      limit: state.pagination.pageSize,
      offset: state.pagination.pageIndex * state.pagination.pageSize,
      search: filter.trim() || undefined,
      workflow_state: getOrderWorkflowStateForQueue(orderQueue)
    }),
    [orderQueue]
  );

  const getRows = useCallback(
    (data: GetOrders200 | undefined) => getOrdersFromListResponse(data),
    []
  );

  const getTotal = useCallback(
    (data: GetOrders200 | undefined) => getOrdersTotalFromListResponse(data),
    []
  );

  const handleOrderAction = useCallback(
    (order: DtoAdminOrderListItem) => {
      if (!isOrderFulfillmentQueue(queue) || !order.id) return;
      setActionTarget({ order, queue });
    },
    [queue]
  );

  const columns = useMemo(
    () =>
      createFulfillmentOrderColumns({
        queue: orderQueue,
        onAction: handleOrderAction,
        isPending
      }),
    [orderQueue, handleOrderAction, isPending]
  );

  const serverTable = useServerTable({
    columns,
    initialPageSize: 20,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetOrders
  });

  const handleConfirmAction = useCallback(
    async ({ note, trackingNumber }: { note?: string; trackingNumber?: string }) => {
      if (!actionTarget?.order.id) return;

      const action = getQueueAction(actionTarget.queue);
      await applyTransition({
        orderId: actionTarget.order.id,
        event: action.event,
        note,
        trackingNumber
      });
      serverTable.refetch();
    },
    [actionTarget, applyTransition, serverTable]
  );

  if (queue === 'tracking') {
    return (
      <Flex direction='column' className='gap-4'>
        <QueueTabs queue={queue} onQueueChange={setQueue} />
        <FulfillmentTrackingTable />
      </Flex>
    );
  }

  if (serverTable.isError) {
    return (
      <div className='rounded-xl border border-dashed p-12 text-center'>
        <p className='text-lg font-semibold'>Fulfillment queue unavailable</p>
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
        <QueueTabs queue={queue} onQueueChange={setQueue} />

        <Table.Toolbar
          searchPlaceholder='Search order # or customer'
          showSearch
          showRefresh
          onRefresh={serverTable.refetch}
          isLoading={serverTable.isFetching}
          showClear
          showColumnVisibility
          showSorting={false}
          showExport={false}
          showBulkActions={false}
        />

        <Table.Grid<DtoAdminOrderListItem>
          isLoading={serverTable.isLoading && serverTable.rows.length === 0}
          onRowDoubleClick={(row) => row.original.id && openOrder(row.original.id)}
          getDetailsUrl={(row) =>
            row.original.id ? `/dashboard/orders/${row.original.id}` : '/dashboard/fulfillment'
          }
          extendMenuActions={(row) => fulfillmentOrderRowMenuActions(row.original, openOrder)}
        />

        <Table.Pagination
          showPageSize
          showTotalRows
          showJumpToPage
          pageSizeOptions={[10, 20, 50]}
        />
      </Table.Root>

      {actionTarget ? (
        <FulfillmentActionDialog
          target={actionTarget}
          isPending={isPending}
          onClose={() => setActionTarget(null)}
          onConfirm={handleConfirmAction}
        />
      ) : null}
    </>
  );
}

function QueueTabs({
  queue,
  onQueueChange
}: {
  queue: FulfillmentQueue;
  onQueueChange: (value: FulfillmentQueue) => void;
}) {
  return (
    <Tabs
      value={queue}
      onValueChange={(value) => void onQueueChange(value as FulfillmentQueue)}
      className='px-1'
    >
      <TabsList className='mb-3 h-auto flex-wrap'>
        {FULFILLMENT_QUEUE_TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className='text-xs'>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
