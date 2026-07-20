import { IconEye } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ApiPaymentStatusBadge } from '@/domains/orders/components/order-api-badges';
import { formatCurrency } from '@/lib/format';
import type { DtoAdminPaymentListItem } from '@/services/-admin-payments-get.schemas';

function formatTxDate(value?: string) {
  if (!value) return '—';
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'MMM d, yyyy · h:mm a');
}

export const paymentColumns: ColumnDef<DtoAdminPaymentListItem>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <span className='font-mono text-xs font-semibold'>#{row.original.id ?? '—'}</span>
    )
  },
  {
    accessorKey: 'order_number',
    header: 'Order',
    cell: ({ row }) => {
      const orderId = row.original.order_id;
      const orderNumber = row.original.order_number ?? (orderId ? `#${orderId}` : '—');

      if (!orderId) {
        return <span className='font-mono text-xs'>{orderNumber}</span>;
      }

      return (
        <Link
          href={`/dashboard/orders/${orderId}`}
          className='text-primary font-mono text-xs font-semibold hover:underline'
          onClick={(event) => event.stopPropagation()}
        >
          {orderNumber}
        </Link>
      );
    }
  },
  {
    accessorKey: 'customer_name',
    header: 'Customer',
    cell: ({ row }) => (
      <div className='min-w-32'>
        <p className='text-xs font-medium'>{row.original.customer_name?.trim() || '—'}</p>
        {row.original.customer_email ? (
          <p className='text-muted-foreground truncate text-[10px]'>
            {row.original.customer_email}
          </p>
        ) : null}
      </div>
    )
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <span className='text-sm font-semibold tabular-nums'>
        {formatCurrency(row.original.amount ?? 0, row.original.currency ?? 'USD')}
      </span>
    )
  },
  {
    accessorKey: 'method',
    header: 'Method',
    cell: ({ row }) => (
      <span className='text-xs font-semibold capitalize'>{row.original.method ?? '—'}</span>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <ApiPaymentStatusBadge status={row.original.status} />
  },
  {
    accessorKey: 'transaction_id',
    header: 'Reference',
    cell: ({ row }) => (
      <span className='text-muted-foreground max-w-32 truncate font-mono text-[10px]'>
        {row.original.transaction_id ?? row.original.stripe_session_id ?? '—'}
      </span>
    )
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => (
      <span className='text-muted-foreground text-xs tabular-nums'>
        {formatTxDate(row.original.created_at)}
      </span>
    )
  }
];

export function paymentRowMenuActions(
  payment: DtoAdminPaymentListItem,
  onView: (id: number) => void
) {
  const id = payment.id;
  if (!id) return null;

  return (
    <DropdownMenuItem className='gap-2 text-[11px] font-semibold' onClick={() => onView(id)}>
      <IconEye className='size-3.5' />
      View payment
    </DropdownMenuItem>
  );
}
