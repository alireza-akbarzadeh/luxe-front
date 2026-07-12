'use client';

import { notFound } from 'next/navigation';
import { useEffect } from 'react';

import { Flex } from '@/components/ui/flex';
import { useCheckoutStore } from '@/domains/checkout/store/checkout.store';
import { useGetOrdersId } from '@/services/-orders-{id}-get';

import { OrderTrackingSkeleton } from './components/order-loading';
import { OrderTrackingActivitySupport } from './components/order-tracking-activity-support';
import { OrderTrackingDeliverySection } from './components/order-tracking-delivery-section';
import { OrderTrackingItemsPayment } from './components/order-tracking-items-payment';
import { OrderTrackingMilestones } from './components/order-tracking-milestones';
import { OrderTrackingMobileActions } from './components/order-tracking-mobile-action-bar';
import { OrderTrackingPageFooter } from './components/order-tracking-page-footer';
import { OrderTrackingPageHeader } from './components/order-tracking-page-header';
import { useOrderTrackingLive } from './hooks/use-order-tracking-live';
import { mapOrderToTrackingPageView } from './lib/order-tracking-page-mapper';
import { mergeOrderWithLive, normalizeOrderForTracking } from './lib/order-tracking-utils';

interface OrderTrackingDomainProps {
  orderId: string;
}

export function OrderTrackingDomain({ orderId }: OrderTrackingDomainProps) {
  const id = Number(orderId);

  const { data: initialData, isLoading, error } = useGetOrdersId(id);
  const { connectionStatus, liveState } = useOrderTrackingLive(id);

  useEffect(() => {
    useCheckoutStore.getState().reset();
  }, []);

  if (isLoading) return <OrderTrackingSkeleton />;
  if (error || !initialData?.data) return notFound();

  const liveOrder = mergeOrderWithLive(normalizeOrderForTracking(initialData.data), liveState);
  const view = mapOrderToTrackingPageView({
    ...initialData.data,
    status: liveOrder.status ?? initialData.data.status,
    tracking_number: liveOrder.shipment?.tracking_number ?? initialData.data.tracking_number,
    carrier: liveOrder.shipment?.carrier ?? initialData.data.carrier,
    shipment_status: liveOrder.shipment?.status ?? initialData.data.shipment_status
  });

  const tracking = view.tracking;

  return (
    <Flex direction='column' className='pt-20 pb-24 sm:pt-24 lg:pb-16'>
      <Flex direction='column' spacing={0} className='app-container max-w-6xl'>
        <OrderTrackingPageHeader
          orderId={view.id}
          orderNumber={view.orderNumber}
          statusLabel={tracking.status_label ?? view.status}
          estimatedArrival={tracking.estimated_arrival}
          progressPercent={tracking.progress_percent ?? 8}
          courier={tracking.courier}
          connectionStatus={connectionStatus}
        />

        <OrderTrackingMilestones milestones={tracking.milestones ?? []} />

        <OrderTrackingMobileActions orderNumber={view.orderNumber} />

        <OrderTrackingDeliverySection
          delivery={tracking.delivery}
          estimatedArrival={tracking.estimated_arrival}
        />

        <OrderTrackingItemsPayment
          items={view.items}
          payment={tracking.payment_summary}
          shipmentStatus={liveOrder.shipment?.status}
        />

        <OrderTrackingActivitySupport
          events={tracking.events ?? []}
          liveActivities={liveState.activities}
          driver={tracking.driver}
        />

        <OrderTrackingPageFooter />
      </Flex>
    </Flex>
  );
}
