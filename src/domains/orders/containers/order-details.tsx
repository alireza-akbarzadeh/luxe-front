'use client';
import { notFound } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';

import { OrderRevenueChart } from '@/domains/orders/components/order-revenue-chart';
import { OrderStatusDonut } from '@/domains/orders/components/order-status-donut';
import { OrderVolumeChart } from '@/domains/orders/components/order-volume-chart';
import { TopProductsTable } from '@/domains/orders/components/top-products-table';
import { MOCK_ORDERS } from '@/domains/orders/mock_order';
import type { OrderStatus } from '@/domains/orders/orders-types';
import { OrderCustomerCard } from '@/domains/orders/sections/customer-order-detail';
import { OrderDetailHeader } from '@/domains/orders/sections/order-details-header';
import { OrderLineItems } from '@/domains/orders/sections/order-line-items';
import { OrderPaymentSummary } from '@/domains/orders/sections/order-payment-summary';
import { OrderShippingCard } from '@/domains/orders/sections/order-shipping-card';
import { OrderTimeline } from '@/domains/orders/sections/order-timeline';

interface OrderDetailDomainProps {
  orderId: string;
}

export function OrderDetailDomain({ orderId }: OrderDetailDomainProps) {
  const initialOrder = MOCK_ORDERS.find((o) => o.id === orderId);

  if (!initialOrder) {
    throw notFound();
  }

  const [currentOrder, setCurrentOrder] = React.useState({ ...initialOrder });

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      setCurrentOrder((prev) => {
        const updated = { ...prev, status: newStatus };

        if (updated.timeline) {
          updated.timeline = [
            {
              event: newStatus,
              timestamp: new Date().toISOString(),
              description: `Order status manually changed to ${newStatus}`,
              actor: 'Admin'
            },
            ...updated.timeline
          ];
        }
        return updated;
      });

      toast.success(`Order status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className='bg-background min-h-screen'>
      {/* STICKY HEADER */}
      <div className='bg-card/80 border-border/40 sticky top-0 z-20 border-b backdrop-blur-sm'>
        <div className='mx-auto max-w-350 px-6 py-4'>
          <OrderDetailHeader order={currentOrder} onStatusChange={handleStatusChange} />
        </div>
      </div>

      {/* MAIN BODY */}
      <div className='mx-auto max-w-350 px-6 py-8'>
        {/* ANALYTICS SECTION */}
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
            {/* Revenue & Orders spans 2 */}
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

        {/* ORDER DETAIL GRID */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* LEFT COLUMN — main content */}
          <div className='space-y-6 lg:col-span-2'>
            {/* Order Summary KPIs */}
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
              {[
                { label: 'Items', value: currentOrder.items?.length ?? 0 },
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

            {/* Line Items Container */}
            {currentOrder.items && currentOrder.items.length > 0 && (
              <OrderLineItems items={currentOrder.items} />
            )}

            {/* Live Operational Timeline Section */}
            {currentOrder.timeline && currentOrder.timeline.length > 0 && (
              <OrderTimeline timeline={currentOrder.timeline} />
            )}
          </div>

          {/* RIGHT COLUMN — sidebar logistics links */}
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
