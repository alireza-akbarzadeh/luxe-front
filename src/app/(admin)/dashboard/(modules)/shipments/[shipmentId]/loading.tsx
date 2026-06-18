import { ShipmentDetailSkeleton } from '@/domains/shipments-admin/sections/shipment-detail-skeleton';

export default function ShipmentDetailLoading() {
  return (
    <div className='mx-auto max-w-350 px-6 py-8'>
      <ShipmentDetailSkeleton />
    </div>
  );
}
