import { motion } from 'framer-motion';

import type { ModelsShipment } from '~/src/services/-checkout-post.schemas';

interface ShipmentTrackingProps {
  shipment: ModelsShipment | undefined;
}

export function ShipmentTraking(props: ShipmentTrackingProps) {
  const { shipment } = props;

  if (!shipment)
    return (
      <p className='text-muted-foreground text-sm'>
        Shipping details will be available once the order is processed.
      </p>
    );

  return (
    <div className='space-y-2 text-sm'>
      <div className='flex justify-between'>
        <span className='text-muted-foreground'>Carrier:</span>
        <span className='font-medium capitalize'>{shipment.carrier || 'Standard Shipping'}</span>
      </div>
      <div className='flex justify-between'>
        <span className='text-muted-foreground'>Status:</span>
        <motion.span
          className={`font-medium capitalize ${
            shipment.status === 'delivered'
              ? 'text-green-600'
              : shipment.status === 'shipped'
                ? 'text-blue-600'
                : 'text-yellow-600'
          }`}
          animate={
            shipment.status === 'processing' || shipment.status === 'shipped'
              ? { scale: [1, 1.05, 1] }
              : {}
          }
          transition={{ duration: 0.3 }}
        >
          {shipment.status}
        </motion.span>
      </div>
      {shipment.tracking_number && (
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>Tracking #:</span>
          <span className='font-mono text-xs'>{shipment.tracking_number}</span>
        </div>
      )}
      {shipment.shipped_at && (
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>Shipped on:</span>
          <span>{new Date(shipment.shipped_at).toLocaleDateString()}</span>
        </div>
      )}
      <div className='border-border mt-1 flex justify-between border-t pt-2'>
        <span className='text-muted-foreground'>Deliver to:</span>
        <span className='text-right text-xs'>
          {shipment.address_line1}
          {shipment.address_line2 && `, ${shipment.address_line2}`}
          <br />
          {shipment.city}, {shipment.state} {shipment.postal_code}
          <br />
          {shipment.country}
        </span>
      </div>
    </div>
  );
}
