'use client';

import type { Row } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';

import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import {
  ApiOrderStatusBadge,
  ApiPaymentStatusBadge
} from '@/domains/orders/components/order-api-badges';
import { formatCurrency } from '@/lib/format';
import type { DtoAdminOrderListItem } from '@/services/-orders-get.schemas';

function formatOrderDate(value?: string) {
  if (!value) return '—';
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'MMM d, yyyy · h:mm a');
}

interface OrderMobileCardProps {
  row: Row<DtoAdminOrderListItem>;
}

export function OrderMobileCard({ row }: OrderMobileCardProps) {
  const order = row.original;

  return (
    <Flex direction='column' className='gap-3 p-4'>
      <Flex direction='row' align='start' justify='between' className='gap-2'>
        <Flex direction='column' className='min-w-0 gap-0.5'>
          <Text variant='small' className='font-mono font-semibold'>
            {order.order_number ?? '—'}
          </Text>
          <Text variant='muted' className='text-[10px]'>
            #{order.id ?? '—'}
          </Text>
        </Flex>
        <Text variant='small' className='shrink-0 font-semibold tabular-nums'>
          {formatCurrency(order.total_amount ?? 0, order.currency ?? 'USD')}
        </Text>
      </Flex>

      <Flex direction='column' className='gap-0.5'>
        <Text variant='small' className='font-medium'>
          {order.customer_name ?? 'Unknown'}
        </Text>
        <Text variant='muted' className='truncate text-xs'>
          {order.customer_email ?? '—'}
        </Text>
      </Flex>

      <Flex direction='row' align='center' wrap='wrap' className='gap-2'>
        <ApiOrderStatusBadge status={order.status} />
        <ApiPaymentStatusBadge status={order.payment_status} />
        <Text variant='muted' className='text-[11px] tabular-nums'>
          {order.items_count ?? 0} items
        </Text>
      </Flex>

      <Text variant='muted' className='text-[11px] tabular-nums'>
        Placed {formatOrderDate(order.created_at)}
      </Text>
    </Flex>
  );
}
