'use client';

import { IconCheck, IconCopy, IconMapPin } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn, copyToClipboard } from '@/lib/utils';
import type { ModelsShipment } from '~/src/services/-checkout-post.schemas';

interface ShipmentTrackingProps {
  shipment: ModelsShipment | undefined;
  highlight?: boolean;
}

function getShipmentStatusClass(status?: string) {
  switch (status) {
    case 'delivered':
      return 'text-green-600';
    case 'shipped':
      return 'text-blue-600';
    case 'processing':
      return 'text-amber-600';
    default:
      return 'text-muted-foreground';
  }
}

export function ShipmentTraking({ shipment, highlight }: ShipmentTrackingProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyTracking = async () => {
    if (!shipment?.tracking_number) return;
    await copyToClipboard(shipment.tracking_number, 'tracking number');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      animate={
        highlight
          ? {
              boxShadow: [
                '0 0 0 0 rgba(59,130,246,0)',
                '0 0 0 4px rgba(59,130,246,0.12)',
                '0 0 0 0 rgba(59,130,246,0)'
              ]
            }
          : undefined
      }
      transition={{ duration: 1.2 }}
      whileHover={{ y: -2 }}
      className='bg-card border-border/50 rounded-2xl border p-5 transition-shadow hover:shadow-md'
    >
      <div className='mb-3 flex items-center gap-2'>
        <IconMapPin className='text-accent h-5 w-5' />
        <h3 className='font-semibold'>Shipping information</h3>
      </div>

      {!shipment ? (
        <p className='text-muted-foreground text-sm'>
          Shipping details will be available once the order is processed.
        </p>
      ) : (
        <div className='space-y-2 text-sm'>
          <div className='flex justify-between gap-4'>
            <span className='text-muted-foreground'>Carrier</span>
            <span className='font-medium capitalize'>
              {shipment.carrier || 'Standard shipping'}
            </span>
          </div>
          <div className='flex justify-between gap-4'>
            <span className='text-muted-foreground'>Status</span>
            <motion.span
              className={cn('font-medium capitalize', getShipmentStatusClass(shipment.status))}
              animate={
                shipment.status === 'processing' || shipment.status === 'shipped'
                  ? { scale: [1, 1.05, 1] }
                  : {}
              }
              transition={{
                duration: 0.35,
                repeat: shipment.status === 'processing' ? Infinity : 0,
                repeatDelay: 2
              }}
            >
              {shipment.status ?? 'pending'}
            </motion.span>
          </div>

          {shipment.tracking_number && (
            <div className='flex items-center justify-between gap-4'>
              <span className='text-muted-foreground'>Tracking #</span>
              <div className='flex items-center gap-1'>
                <span className='font-mono text-xs'>{shipment.tracking_number}</span>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-7 w-7 rounded-full'
                  onClick={handleCopyTracking}
                  aria-label='Copy tracking number'
                >
                  {copied ? (
                    <IconCheck className='h-3.5 w-3.5 text-green-500' />
                  ) : (
                    <IconCopy className='h-3.5 w-3.5' />
                  )}
                </Button>
              </div>
            </div>
          )}

          {shipment.shipped_at && (
            <div className='flex justify-between gap-4'>
              <span className='text-muted-foreground'>Shipped on</span>
              <span>{new Date(shipment.shipped_at).toLocaleDateString()}</span>
            </div>
          )}

          {shipment.estimated_delivery && (
            <div className='flex justify-between gap-4'>
              <span className='text-muted-foreground'>Estimated delivery</span>
              <span>{new Date(shipment.estimated_delivery).toLocaleDateString()}</span>
            </div>
          )}

          <div className='border-border mt-1 flex justify-between gap-4 border-t pt-2'>
            <span className='text-muted-foreground shrink-0'>Deliver to</span>
            <span className='text-right text-xs leading-relaxed'>
              {shipment.address_line1}
              {shipment.address_line2 && `, ${shipment.address_line2}`}
              <br />
              {shipment.city}, {shipment.state} {shipment.postal_code}
              <br />
              {shipment.country}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
