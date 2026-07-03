'use client';

import { notFound, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { useCheckoutStore } from '@/domains/checkout/store/checkout.store';
import { OrderStatus } from '@/lib/constants/enum-statuses';
import { useGetOrdersId } from '@/services/-orders-{id}-get';

import { OrderBoxNumber } from './components/order-box-number';
import { OrderItemSummary } from './components/order-item-summary';
import { OrderTrackingSkeleton } from './components/order-loading';
import { OrderTrackingActivityFeed } from './components/order-tracking-activity';
import { OrderTrackingMobileActions } from './components/order-tracking-mobile-action-bar';
import { OrderTrackingMobileSummary } from './components/order-tracking-mobile-summary';
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
  const orderItems = order.items ?? [];
  const itemCount = orderItems.reduce((sum, item) => sum + (item.quantity ?? 0), 0);

  const subtotal = getOrderSubtotal(orderItems);
  const shippingCost = shipment?.shipping_price ?? 0;
  const tax = getOrderTax(subtotal, shippingCost, order.total_amount);
  const total = order.total_amount ?? subtotal + shippingCost + tax;

  const highlightPayment = liveState.pulsingStepKey === 'processing';
  const highlightShipment =
    liveState.pulsingStepKey === 'shipped' || liveState.pulsingStepKey === 'processing';

  return (
    <Flex direction='column' className='pt-20 pb-24 sm:pt-24 lg:pb-16'>
      <Flex direction='column' spacing={0} className='app-container max-w-5xl'>
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

        <OrderTrackingMobileActions orderNumber={order.order_number ?? ''} />

        <OrderTrackingMobileSummary
          itemCount={itemCount}
          subtotal={subtotal}
          shippingCost={shippingCost}
          tax={tax}
          total={total}
          currency={order.currency || ''}
        />

        <Grid gap={8} className='mb-10 grid-cols-1 lg:mb-12 lg:grid-cols-3'>
          <GridItem className='lg:col-span-2'>
            <OrderItemSummary orderItems={orderItems} />
          </GridItem>
          <GridItem className='hidden lg:block'>
            <OrderTrackingSummary
              currency={order.currency || ''}
              shippingCost={shippingCost}
              subtotal={subtotal}
              tax={tax}
              total={total}
            />
          </GridItem>
        </Grid>

        <Grid gap={6} className='mb-10 grid-cols-1 lg:mb-12 lg:grid-cols-3'>
          <GridItem>
            <PaymentDetails
              currentStatus={currentStatus}
              payment={payment}
              highlight={highlightPayment}
            />
          </GridItem>
          <GridItem>
            <ShipmentTraking shipment={shipment} highlight={highlightShipment} />
          </GridItem>
          <GridItem>
            <OrderTrackingActivityFeed activities={liveState.activities} />
          </GridItem>
        </Grid>

        <TrakingFooter />
      </Flex>
    </Flex>
  );
}
