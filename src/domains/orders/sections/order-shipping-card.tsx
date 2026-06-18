import { IconCalendar, IconHash, IconTruck } from '@tabler/icons-react';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

import type { DtoAdminOrderDetailResponse } from '@/services/-orders-{id}-get.schemas';

interface OrderShippingCardProps {
  order: DtoAdminOrderDetailResponse;
}

const CARRIER_TRACK: Record<string, string> = {
  UPS: 'https://www.ups.com/track?tracknum=',
  FedEx: 'https://www.fedex.com/apps/fedextrack/?tracknumbers=',
  DHL: 'https://www.dhl.com/en/express/tracking.html?AWB=',
  USPS: 'https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1='
};

function formatDeliveryDate(value?: string) {
  if (!value) return null;
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return null;
  return format(date, 'MMM d, yyyy');
}

export function OrderShippingCard({ order }: OrderShippingCardProps) {
  const carrier = order.carrier?.trim();
  const tracking = order.tracking_number?.trim();
  const trackUrl =
    tracking && carrier
      ? (CARRIER_TRACK[carrier] ?? '#') + tracking
      : null;
  const estimatedDelivery = formatDeliveryDate(order.estimated_delivery);

  return (
    <div className='bg-card border-border/40 overflow-hidden rounded-2xl border shadow-sm'>
      <div className='bg-muted/20 border-border/10 border-b px-6 py-4'>
        <h2 className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
          Shipping & fulfillment
        </h2>
      </div>
      <div className='space-y-4 p-6'>
        <div className='flex items-center justify-between'>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <IconTruck className='h-3.5 w-3.5' />
            Carrier
          </div>
          <span className='text-foreground text-xs font-bold'>{carrier || '—'}</span>
        </div>

        <div className='flex items-center justify-between'>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <IconHash className='h-3.5 w-3.5' />
            Tracking
          </div>
          {tracking ? (
            trackUrl && trackUrl !== '#' ? (
              <Link
                href={trackUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary font-mono text-[11px] font-bold hover:underline'
              >
                {tracking.length > 20 ? `${tracking.slice(0, 20)}…` : tracking}
              </Link>
            ) : (
              <span className='text-foreground font-mono text-[11px] font-semibold'>{tracking}</span>
            )
          ) : (
            <span className='text-muted-foreground text-xs font-medium italic'>Not assigned</span>
          )}
        </div>

        <div className='flex items-center justify-between'>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <IconCalendar className='h-3.5 w-3.5' />
            Est. delivery
          </div>
          <span className='text-foreground text-xs font-semibold'>
            {estimatedDelivery ?? '—'}
          </span>
        </div>
      </div>
    </div>
  );
}
