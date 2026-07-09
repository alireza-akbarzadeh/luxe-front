import { IconCalendar, IconHash, IconMapPin, IconTruck } from '@tabler/icons-react';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { ApiShipmentStatusBadge } from '@/domains/orders/components/order-api-badges';
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

function formatAddress(order: DtoAdminOrderDetailResponse) {
  const address = order.shipping_address;
  if (!address) return null;

  const lines = [
    address.address_line1,
    address.address_line2,
    [address.city, address.state, address.postal_code].filter(Boolean).join(', '),
    address.country
  ].filter(Boolean);

  return lines.length > 0 ? lines : null;
}

export function OrderShippingCard({ order }: OrderShippingCardProps) {
  const carrier = order.carrier?.trim();
  const tracking = order.tracking_number?.trim();
  const trackUrl = tracking && carrier ? (CARRIER_TRACK[carrier] ?? '#') + tracking : null;
  const estimatedDelivery = formatDeliveryDate(order.estimated_delivery);
  const addressLines = formatAddress(order);

  return (
    <div className='bg-card border-border/40 overflow-hidden rounded-2xl border shadow-sm'>
      <div className='bg-muted/20 border-border/10 border-b px-6 py-4'>
        <Text variant='overline' className='text-muted-foreground'>
          Shipping & fulfillment
        </Text>
      </div>
      <Flex direction='column' spacing={4} className='p-6'>
        <Flex direction='row' align='center' justify='between'>
          <Flex direction='row' align='center' className='text-muted-foreground gap-2 text-xs'>
            <IconTruck className='h-3.5 w-3.5' />
            Shipment status
          </Flex>
          <ApiShipmentStatusBadge status={order.shipment_status} size='md' />
        </Flex>

        <Flex direction='row' align='center' justify='between'>
          <Flex direction='row' align='center' className='text-muted-foreground gap-2 text-xs'>
            <IconTruck className='h-3.5 w-3.5' />
            Carrier
          </Flex>
          <Text variant='small' className='font-bold'>
            {carrier || '—'}
          </Text>
        </Flex>

        <Flex direction='row' align='center' justify='between'>
          <Flex direction='row' align='center' className='text-muted-foreground gap-2 text-xs'>
            <IconHash className='h-3.5 w-3.5' />
            Tracking
          </Flex>
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
              <Text variant='small' className='font-mono font-semibold'>
                {tracking}
              </Text>
            )
          ) : (
            <Text variant='muted' className='text-xs italic'>
              Not assigned
            </Text>
          )}
        </Flex>

        <Flex direction='row' align='center' justify='between'>
          <Flex direction='row' align='center' className='text-muted-foreground gap-2 text-xs'>
            <IconCalendar className='h-3.5 w-3.5' />
            Est. delivery
          </Flex>
          <Text variant='small' className='font-semibold'>
            {estimatedDelivery ?? '—'}
          </Text>
        </Flex>

        {addressLines ? (
          <div className='border-border/40 border-t pt-4'>
            <Flex
              direction='row'
              align='start'
              className='text-muted-foreground mb-2 gap-2 text-xs'
            >
              <IconMapPin className='mt-0.5 h-3.5 w-3.5 shrink-0' />
              Ship to
            </Flex>
            <address className='text-foreground space-y-0.5 text-xs leading-relaxed not-italic'>
              {addressLines.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </address>
          </div>
        ) : null}
      </Flex>
    </div>
  );
}
