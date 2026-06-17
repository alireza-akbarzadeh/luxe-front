'use client';

import { IconAlertTriangle } from '@tabler/icons-react';
import { notFound } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { OrderRevenueChart } from '@/domains/orders/components/order-revenue-chart';
import { OrderStatusDonut } from '@/domains/orders/components/order-status-donut';
import { OrderVolumeChart } from '@/domains/orders/components/order-volume-chart';
import { TopProductsTable } from '@/domains/orders/components/top-products-table';
import { mapApiOrderDetailToDomain } from '@/domains/orders/order.utils';
import type { Order, OrderStatus } from '@/domains/orders/orders-types';
import { OrderCustomerCard } from '@/domains/orders/sections/customer-order-detail';
import { OrderDetailHeader } from '@/domains/orders/sections/order-details-header';
import { OrderLineItems } from '@/domains/orders/sections/order-line-items';
import { OrderPaymentSummary } from '@/domains/orders/sections/order-payment-summary';
import { OrderShippingCard } from '@/domains/orders/sections/order-shipping-card';
import { OrderTimeline } from '@/domains/orders/sections/order-timeline';
import { useGetOrdersId } from '@/services/-orders-{id}-get';

interface OrderDetailDomainProps {
  orderId: string;
}

export function OrderDetailDomain({ orderId }: OrderDetailDomainProps) {
  const numericId = Number(orderId);
  const { data, isLoading, isError, error, refetch } = useGetOrdersId(numericId, {
    query: { enabled: Number.isFinite(numericId) && numericId > 0 }
  });

  if (isLoading) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center'>
        <p className='text-muted-foreground text-sm font-medium'>Loading order…</p>
      </div>
    );
  }

  if (isError) {
    const message =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message?: string }).message)
        : 'Failed to load order';

    return (
      <div className='bg-background flex min-h-screen items-center justify-center p-8'>
        <div className='max-w-md rounded-2xl border-2 border-dashed p-12 text-center'>
          <IconAlertTriangle className='text-destructive mx-auto mb-4 h-12 w-12' />
          <h3 className='text-lg font-bold tracking-tight uppercase italic'>Order unavailable</h3>
          <p className='text-muted-foreground text-sm font-medium'>{message}</p>
          <Button className='mt-4' variant='outline' onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    notFound();
  }

  return (
    <OrderDetailContent
      key={data.data.id}
      initialOrder={mapApiOrderDetailToDomain(data.data)}
    />
  );
}

function OrderDetailContent({ initialOrder }: { initialOrder: Order }) {
  const [currentOrder, setCurrentOrder] = React.useState(initialOrder);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      setCurrentOrder((prev) => {
        const updated = { ...prev, status: newStatus };
        updated.timeline = [
          {
            event: newStatus,
            timestamp: new Date().toISOString(),
            description: `Order status manually changed to ${newStatus}`,
            actor: 'Admin'
          },
          ...updated.timeline
        ];
        return updated;
      });

      toast.success(`Order status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className='bg-background min-h-screen'>
      <div className='bg-card/80 border-border/40 sticky top-0 z-20 border-b backdrop-blur-sm'>
        <div className='mx-auto max-w-350 px-6 py-4'>
          <OrderDetailHeader order={currentOrder} onStatusChange={handleStatusChange} />
        </div>
      </div>

      <div className='mx-auto max-w-350 px-6 py-8'>
        <div className='mb-8'>
          <div className='mb-4'>
            <h2 className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
              Store Analytics
            </h2>
            <p className='text-muted-foreground mt-0.5 text-xs font-medium'>
              Revenue, volume and product performance across all orders
            </p>
          </div>
          <div className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
            <div className='md:col-span-2'>
              <OrderRevenueChart />
            </div>
            <div className='md:col-span-2'>
              <OrderStatusDonut />
            </div>
          </div>
          <div className='mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
            <div className='md:col-span-2'>
              <TopProductsTable />
            </div>
            <div className='md:col-span-2'>
              <OrderVolumeChart />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
              {[
                {
                  label: 'Items',
                  value: currentOrder.items_count ?? currentOrder.items?.length ?? 0
                },
                {
                  label: 'Total',
                  value: new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currentOrder.currency || 'USD'
                  }).format(currentOrder.total)
                },
                { label: 'Channel', value: currentOrder.channel || '—' },
                { label: 'Carrier', value: currentOrder.carrier || '—' }
              ].map(({ label, value }) => (
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

            {currentOrder.items && currentOrder.items.length > 0 && (
              <OrderLineItems items={currentOrder.items} />
            )}

            {currentOrder.timeline && currentOrder.timeline.length > 0 && (
              <OrderTimeline timeline={currentOrder.timeline} />
            )}
          </div>

          <div className='space-y-5'>
            <OrderPaymentSummary order={currentOrder} />
            <OrderCustomerCard order={currentOrder} />
            <OrderShippingCard order={currentOrder} />
          </div>
        </div>
      </div>
    </div>
  );
}
