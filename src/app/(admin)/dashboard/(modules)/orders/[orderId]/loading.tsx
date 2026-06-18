import { OrderDetailSkeleton } from '@/domains/orders/sections/order-detail-skeleton';

export default function OrderDetailLoading() {
  return (
    <div className='mx-auto max-w-350 px-6 py-8'>
      <OrderDetailSkeleton />
    </div>
  );
}
