import { IconCalendar, IconHash, IconMapPin, IconTruck } from '@tabler/icons-react';
import { format } from 'date-fns';
import Link from 'next/link';

export type LogisticsCarrier = 'UPS' | 'FedEx' | 'DHL' | 'USPS';

export interface ShippingAddress {
  city: string;
  state: string;
  country: string;
}

// 3. Shape definition for the incoming order parameters
export interface ShippingOrderDetails {
  carrier?: LogisticsCarrier | string | null;
  tracking_number?: string | null;
  estimated_delivery?: string | Date | null;
  shipping_address?: ShippingAddress | null;
}

export interface OrderShippingCardProps {
  order: ShippingOrderDetails;
}

const CARRIER_TRACK: Record<LogisticsCarrier, string> = {
  UPS: 'https://www.ups.com/track?tracknum=',
  FedEx: 'https://www.fedex.com/apps/fedextrack/?tracknumbers=',
  DHL: 'https://www.dhl.com/en/express/tracking.html?AWB=',
  USPS: 'https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1='
};

export function OrderShippingCard({ order }: OrderShippingCardProps) {
  // Safe track URL calculation parsing out matched carrier records
  const trackUrl =
    order.tracking_number && order.carrier
      ? (CARRIER_TRACK[order.carrier as LogisticsCarrier] || '#') + order.tracking_number
      : null;

  return (
    <div className='bg-card border-border/40 overflow-hidden rounded-2xl border shadow-sm'>
      <div className='bg-muted/20 border-border/10 border-b px-6 py-4'>
        <h2 className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
          Shipping & Fulfillment
        </h2>
      </div>
      <div className='space-y-4 p-6'>
        {order.carrier && (
          <div className='flex items-center justify-between'>
            <div className='text-muted-foreground flex items-center gap-2 text-xs'>
              <IconTruck className='h-3.5 w-3.5' /> Carrier
            </div>
            <span className='text-foreground text-xs font-bold'>{order.carrier}</span>
          </div>
        )}

        {order.tracking_number ? (
          <div className='flex items-center justify-between'>
            <div className='text-muted-foreground flex items-center gap-2 text-xs'>
              <IconHash className='h-3.5 w-3.5' /> Tracking
            </div>
            {trackUrl && trackUrl !== '#' ? (
              <Link
                href={trackUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary font-mono text-[11px] font-bold transition-all hover:underline'
              >
                {order.tracking_number.length > 20
                  ? `${order.tracking_number.slice(0, 20)}…`
                  : order.tracking_number}
              </Link>
            ) : (
              <span className='text-foreground font-mono text-[11px] font-semibold'>
                {order.tracking_number}
              </span>
            )}
          </div>
        ) : (
          <div className='flex items-center justify-between'>
            <div className='text-muted-foreground flex items-center gap-2 text-xs'>
              <IconHash className='h-3.5 w-3.5' /> Tracking
            </div>
            <span className='text-muted-foreground text-xs font-medium italic'>
              Not yet assigned
            </span>
          </div>
        )}

        {order.estimated_delivery && (
          <div className='flex items-center justify-between'>
            <div className='text-muted-foreground flex items-center gap-2 text-xs'>
              <IconCalendar className='h-3.5 w-3.5' /> Est. Delivery
            </div>
            <span className='text-foreground text-xs font-semibold'>
              {format(new Date(order.estimated_delivery), 'MMM d, yyyy')}
            </span>
          </div>
        )}

        {order.shipping_address && (
          <div className='bg-muted/40 border-border/10 mt-2 rounded-xl border p-3'>
            <div className='mb-2 flex items-center gap-1.5'>
              <IconMapPin className='text-muted-foreground h-3 w-3' />
              <span className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                Destination
              </span>
            </div>
            <p className='text-foreground text-xs font-medium'>
              {order.shipping_address.city}, {order.shipping_address.state}
            </p>
            <p className='text-muted-foreground mt-0.5 text-[11px]'>
              {order.shipping_address.country}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
