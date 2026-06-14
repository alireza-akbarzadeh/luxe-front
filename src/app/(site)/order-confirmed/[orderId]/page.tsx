import { Suspense } from 'react';

import { OrderConfirmedDomain } from '@/domains/order-confirmed/order-confirmed.domain';
import { OrderTrackingSkeleton } from '@/domains/order-tracking/components/order-loading';

interface OrderConfirmedPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderConfirmedPage(props: OrderConfirmedPageProps) {
  const { orderId } = await props.params;

  return (
    <Suspense fallback={<OrderTrackingSkeleton />}>
      <OrderConfirmedDomain orderId={orderId} />
    </Suspense>
  );
}
