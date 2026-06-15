import { Suspense } from 'react';

import { OrderTrackingSkeleton } from '~/src/domains/order-tracking/components/order-loading';
import { OrderTrackingDomain } from '~/src/domains/order-tracking/order-tracking.domain';

interface OrderTrackingPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderTrackingPage(props: OrderTrackingPageProps) {
  const { orderId } = await props.params;

  return (
    <Suspense fallback={<OrderTrackingSkeleton />}>
      <OrderTrackingDomain orderId={orderId} />
    </Suspense>
  );
}
