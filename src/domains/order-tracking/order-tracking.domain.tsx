'use client';

import { notFound, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { useCheckoutStore } from '@/domains/checkout/store/checkout.store';
import { OrderStatus } from '@/lib/constants/enum-statuses';
import { useGetOrdersId } from '~/src/services/-orders-{id}-get';

import { OrderBoxNumber } from './components/order-box-number';
import { OrderItemSummary } from './components/order-item-summary';
import { OrderTrackingSkeleton } from './components/order-loading';
import { OrderTrackingActivityFeed } from './components/order-tracking-activity';
import { OrderTrackingProgress } from './components/order-tracking-progress';
import { OrderTrackingStatusHero } from './components/order-tracking-status-hero';
import { OrderTrackingSummary } from './components/order-tracking-summary';
import { PaymentDetails } from './components/payment-details';
import { ShipmentTraking } from './components/shipment-traking';
import { TrakingFooter } from './components/traking-footer';
import { useOrderTrackingLive } from './hooks/use-order-tracking-live';
import {
  getOrderProgressState,
  getOrderSubtotal,
  getOrderTax,
  mergeOrderWithLive
} from './lib/order-tracking-utils';

interface OrderTrackingDomainProps {
  orderId: string;
}

export function OrderTrackingDomain({ orderId }: OrderTrackingDomainProps) {
  const id = Number(orderId);
  const searchParams = useSearchParams();
  const isFreshCheckout = searchParams.get('confirmed') === '1';

  const { data: initialData, isLoading, error } = useGetOrdersId(id);
  const { connectionStatus, liveState, clearPulsingStep } = useOrderTrackingLive(id);

  useEffect(() => {
    useCheckoutStore.getState().reset();
  }, []);

  if (isLoading) return <OrderTrackingSkeleton />;
  if (error || !initialData?.data) return notFound();

  const order = mergeOrderWithLive(initialData.data, liveState);
  const currentStatus = order.status ?? OrderStatus.Pending;
  const progress = getOrderProgressState(currentStatus);

  const payment = order.payment;
  const shipment = order.shipment;

  const subtotal = getOrderSubtotal(order.items);
  const shippingCost = shipment?.shipping_price ?? 0;
  const tax = getOrderTax(subtotal, shippingCost, order.total_amount);
  const total = order.total_amount ?? subtotal + shippingCost + tax;

  const highlightPayment = liveState.pulsingStepKey === 'processing';
  const highlightShipment =
    liveState.pulsingStepKey === 'shipped' || liveState.pulsingStepKey === 'processing';

  return (
    <div className='pt-24 pb-16'>
      <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
        <OrderTrackingStatusHero
          orderNumber={order.order_number ?? '—'}
          status={currentStatus}
          createdAt={String(order.created_at)}
          isFreshCheckout={isFreshCheckout}
          connectionStatus={connectionStatus}
        />

        <OrderBoxNumber order_number={order.order_number || ''} />

        <OrderTrackingProgress
          progress={progress}
          pulsingStepKey={liveState.pulsingStepKey}
          onPulseComplete={clearPulsingStep}
        />

        <div className='mb-12 grid gap-8 lg:grid-cols-3'>
          <OrderItemSummary orderItems={order.items || []} />
          <OrderTrackingSummary
            currency={order.currency || ''}
            shippingCost={shippingCost}
            subtotal={subtotal}
            tax={tax}
            total={total}
          />
        </div>

        <div className='mb-12 grid gap-6 lg:grid-cols-3'>
          <PaymentDetails
            currentStatus={currentStatus}
            payment={payment}
            highlight={highlightPayment}
          />
          <ShipmentTraking shipment={shipment} highlight={highlightShipment} />
          <OrderTrackingActivityFeed activities={liveState.activities} className='lg:col-span-1' />
        </div>

        <TrakingFooter />
      </div>
    </div>
  );
}
