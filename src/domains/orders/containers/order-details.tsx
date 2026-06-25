'use client';

import { IconAlertTriangle } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { EntityWorkflowPanel } from '@/domains/workflows/components/entity-workflow-panel';
import { formatCurrency } from '@/lib/format';
import { usePostOrdersIdCancel } from '@/services/-orders-{id}-cancel-post';
import { getGetOrdersIdQueryKey, useGetOrdersId } from '@/services/-orders-{id}-get';
import type { DtoAdminOrderDetailResponse } from '@/services/-orders-{id}-get.schemas';
import { getGetOrdersQueryKey } from '@/services/-orders-get';

import { OrderCustomerCard } from '../sections/customer-order-detail';
import { OrderActivityCard } from '../sections/order-activity-card';
import { OrderDetailSkeleton } from '../sections/order-detail-skeleton';
import { OrderDetailHeader } from '../sections/order-details-header';
import { OrderLineItems } from '../sections/order-line-items';
import { OrderPaymentSummary } from '../sections/order-payment-summary';
import { OrderShippingCard } from '../sections/order-shipping-card';

interface OrderDetailDomainProps {
  orderId: string;
}

export function OrderDetailDomain({ orderId }: OrderDetailDomainProps) {
  const numericId = Number(orderId);
  const queryClient = useQueryClient();
  const isValidId = Number.isFinite(numericId) && numericId > 0;

  const { data, isLoading, isError, error, refetch } = useGetOrdersId(numericId, {
    query: { enabled: isValidId }
  });

  const { mutateAsync: cancelOrder, isPending: isCancelling } = usePostOrdersIdCancel();

  const invalidateOrderQueries = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: getGetOrdersIdQueryKey(numericId) });
    void queryClient.invalidateQueries({ queryKey: getGetOrdersQueryKey() });
  }, [numericId, queryClient]);

  const handleCancel = useCallback(async () => {
    try {
      await cancelOrder({ id: numericId });
      invalidateOrderQueries();
      toast.success('Order cancelled');
    } catch (cancelError) {
      toast.error('Could not cancel order', {
        description:
          cancelError instanceof Error ? cancelError.message : 'Something went wrong'
      });
      throw cancelError;
    }
  }, [cancelOrder, invalidateOrderQueries, numericId]);

  if (!isValidId) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className='mx-auto max-w-350 px-6 py-8'>
        <OrderDetailSkeleton />
      </div>
    );
  }

  if (isError) {
    const message =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message?: string }).message)
        : 'Failed to load order';

    return (
      <div className='flex min-h-[50vh] items-center justify-center p-8'>
        <div className='max-w-md rounded-2xl border-2 border-dashed p-12 text-center'>
          <IconAlertTriangle className='text-destructive mx-auto mb-4 h-12 w-12' />
          <h3 className='text-lg font-bold tracking-tight'>Order unavailable</h3>
          <p className='text-muted-foreground mt-2 text-sm'>{message}</p>
          <Button className='mt-4' variant='outline' onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const order = data?.data;
  if (!order?.id) {
    notFound();
  }

  return (
    <OrderDetailView
      order={order}
      onCancel={handleCancel}
      isCancelling={isCancelling}
      onWorkflowChange={invalidateOrderQueries}
    />
  );
}

interface OrderDetailViewProps {
  order: DtoAdminOrderDetailResponse;
  onCancel: () => Promise<void>;
  isCancelling: boolean;
  onWorkflowChange: () => void;
}

function OrderDetailView({ order, onCancel, isCancelling, onWorkflowChange }: OrderDetailViewProps) {
  const orderId = order.id!;
  const currency = order.currency ?? 'USD';
  const items = order.items ?? [];
  const itemsCount = items.length;

  const summaryStats = [
    { label: 'Items', value: String(itemsCount) },
    { label: 'Total', value: formatCurrency(order.total_amount ?? 0, currency) },
    { label: 'Carrier', value: order.carrier?.trim() || '—' },
    { label: 'Tracking', value: order.tracking_number?.trim() ? 'Assigned' : 'Pending' }
  ];

  return (
    <div className='bg-background min-h-screen'>
      <div className='bg-card/80 border-border/40 sticky top-0 z-20 border-b backdrop-blur-sm'>
        <div className='mx-auto max-w-350 px-6 py-4'>
          <OrderDetailHeader order={order} onCancel={onCancel} isCancelling={isCancelling} />
        </div>
      </div>

      <div className='mx-auto max-w-350 space-y-6 px-6 py-8'>
        <EntityWorkflowPanel
          workflowKey='order'
          entityId={orderId}
          title='Fulfillment workflow'
          description='Advance this order through paid, shipped, delivered, or handle exceptions.'
          onTransitionSuccess={onWorkflowChange}
        />

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
              {summaryStats.map(({ label, value }) => (
                <div
                  key={label}
                  className='bg-card border-border/40 rounded-2xl border p-4 text-center shadow-sm'
                >
                  <p className='text-muted-foreground text-[9px] font-black tracking-widest uppercase'>
                    {label}
                  </p>
                  <p className='text-foreground mt-1.5 truncate text-lg font-black tabular-nums'>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {itemsCount > 0 ? <OrderLineItems items={items} currency={currency} /> : null}

            <OrderActivityCard orderId={orderId} />
          </div>

          <div className='space-y-5'>
            <OrderPaymentSummary order={order} />
            <OrderCustomerCard order={order} />
            <OrderShippingCard order={order} />
          </div>
        </div>
      </div>
    </div>
  );
}
