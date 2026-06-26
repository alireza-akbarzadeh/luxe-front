import { IconEye } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  ApiOrderStatusBadge,
  ApiPaymentStatusBadge
} from '@/domains/orders/components/order-api-badges';
import type { VendorOrderListItem } from '@/lib/api/vendor-orders';
import { formatCurrency } from '@/lib/format';

function formatOrderDate(value?: string) {
  if (!value) return '—';
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'MMM d, yyyy · h:mm a');
}

export const vendorOrderColumns: ColumnDef<VendorOrderListItem>[] = [
  {
    accessorKey: 'order_number',
    header: 'Order',
    cell: ({ row }) => (
      <div className='min-w-28'>
        <p className='font-mono text-xs font-semibold'>{row.original.order_number ?? '—'}</p>
        <p className='text-muted-foreground text-[10px]'>#{row.original.id ?? '—'}</p>
      </div>
    )
  },
  {
    id: 'customer',
    header: 'Customer',
    cell: ({ row }) => (
      <div className='min-w-44'>
        <p className='text-sm font-medium'>{row.original.customer_name ?? 'Unknown'}</p>
        <p className='text-muted-foreground truncate text-xs' dir='ltr'>
          {row.original.customer_email ?? '—'}
        </p>
      </div>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <ApiOrderStatusBadge status={row.original.status} />
  },
  {
    accessorKey: 'payment_status',
    header: 'Payment',
    cell: ({ row }) => <ApiPaymentStatusBadge status={row.original.payment_status} />
  },
  {
    accessorKey: 'store_subtotal',
    header: 'Your total',
    cell: ({ row }) => (
      <div className='min-w-24'>
        <span className='text-sm font-semibold tabular-nums'>
          {formatCurrency(row.original.store_subtotal ?? 0, row.original.currency ?? 'USD')}
        </span>
        <p className='text-muted-foreground text-[10px] tabular-nums'>
          of {formatCurrency(row.original.total_amount ?? 0, row.original.currency ?? 'USD')}
        </p>
      </div>
    )
  },
  {
    accessorKey: 'store_items_count',
    header: 'Items',
    cell: ({ row }) => (
      <span className='bg-muted inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold tabular-nums'>
        {row.original.store_items_count ?? 0}
      </span>
    )
  },
  {
    id: 'shipping',
    header: 'Shipping',
    cell: ({ row }) => (
      <div className='min-w-28'>
        {row.original.tracking_number ? (
          <>
            <p className='font-mono text-[10px]'>{row.original.tracking_number}</p>
            <p className='text-muted-foreground text-[10px]'>{row.original.carrier ?? '—'}</p>
          </>
        ) : (
          <span className='text-muted-foreground text-xs'>—</span>
        )}
      </div>
    )
  },
  {
    accessorKey: 'created_at',
    header: 'Date',
    cell: ({ row }) => (
      <span className='text-muted-foreground text-xs whitespace-nowrap'>
        {formatOrderDate(row.original.created_at)}
      </span>
    )
  }
];

export function vendorOrderRowMenuActions(
  order: VendorOrderListItem,
  onView: (id: number) => void
) {
  if (!order.id) return null;

  return (
    <>
      <DropdownMenuItem onClick={() => onView(order.id)}>
        <IconEye className='size-4' />
        View order
      </DropdownMenuItem>
    </>
  );
}
