import { IconEye } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { createWorkflowStateColumn } from '@/domains/workflows/lib/create-workflow-state-column';
import { formatCurrency } from '@/lib/format';
import type { DtoReturnResponse } from '@/services/-admin-returns.schemas';

function formatReturnDate(value?: string) {
  if (!value) return '—';
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'MMM d, yyyy · h:mm a');
}

export const returnColumns: ColumnDef<DtoReturnResponse>[] = [
  {
    accessorKey: 'id',
    header: 'Return',
    cell: ({ row }) => (
      <div className='min-w-20'>
        <p className='font-mono text-xs font-semibold'>#{row.original.id ?? '—'}</p>
      </div>
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

  createWorkflowStateColumn<DtoReturnResponse>({
    getState: (row) => row.state,
    header: 'Status',
    fallbackLabel: 'Requested'
  }),

  {
    accessorKey: 'refund_amount',
    header: 'Refund',
    cell: ({ row }) => (
      <span className='text-sm font-semibold tabular-nums'>
        {formatCurrency(row.original.refund_amount ?? 0)}
      </span>
    )
  },

  {
    accessorKey: 'reason',
    header: 'Reason',
    cell: ({ row }) => (
      <p className='max-w-55 truncate text-xs' title={row.original.reason}>
        {row.original.reason ?? '—'}
      </p>
    )
  },

  {
    accessorKey: 'user_id',
    header: 'Customer',
    cell: ({ row }) => (
      <span className='text-muted-foreground font-mono text-xs'>User #{row.original.user_id ?? '—'}</span>
    )
  },

  {
    accessorKey: 'created_at',
    header: 'Requested',
    cell: ({ row }) => (
      <span className='text-muted-foreground text-xs tabular-nums'>
        {formatReturnDate(row.original.created_at)}
      </span>
    )
  }
];

export function returnRowMenuActions(returnItem: DtoReturnResponse, onView: (id: number) => void) {
  const id = returnItem.id;
  if (!id) return null;

  return (
    <DropdownMenuItem className='gap-2 text-[11px] font-semibold' onClick={() => onView(id)}>
      <IconEye className='size-3.5' />
      Review return
    </DropdownMenuItem>
  );
}
