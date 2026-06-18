import { IconEye } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { createWorkflowStateColumn } from '@/domains/workflows/lib/create-workflow-state-column';
import type { DtoAdminShipmentListItem } from '@/services/-admin-shipments.schemas';

function formatShipmentDate(value?: string) {
  if (!value) return '—';
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'MMM d, yyyy · h:mm a');
}

export const shipmentColumns: ColumnDef<DtoAdminShipmentListItem>[] = [
  {
    accessorKey: 'id',
    header: 'Shipment',
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

  createWorkflowStateColumn<DtoAdminShipmentListItem>({
    getState: (row) => row.state,
    header: 'Status',
    fallbackLabel: 'Pending'
  }),

  {
    accessorKey: 'carrier',
    header: 'Carrier',
    cell: ({ row }) => (
      <span className='text-sm font-medium'>{row.original.carrier ?? '—'}</span>
    )
  },

  {
    accessorKey: 'tracking_number',
    header: 'Tracking',
    cell: ({ row }) => (
      <span className='font-mono text-xs'>{row.original.tracking_number ?? '—'}</span>
    )
  },

  {
    accessorKey: 'customer_name',
    header: 'Customer',
    cell: ({ row }) => (
      <span className='text-muted-foreground text-xs'>
        {row.original.customer_name?.trim() || '—'}
      </span>
    )
  },

  {
    accessorKey: 'city',
    header: 'Destination',
    cell: ({ row }) => {
      const city = row.original.city;
      const country = row.original.country;
      if (!city && !country) return <span className='text-muted-foreground text-xs'>—</span>;
      return (
        <span className='text-muted-foreground text-xs'>
          {[city, country].filter(Boolean).join(', ')}
        </span>
      );
    }
  },

  {
    accessorKey: 'shipped_at',
    header: 'Shipped',
    cell: ({ row }) => (
      <span className='text-muted-foreground text-xs tabular-nums'>
        {formatShipmentDate(row.original.shipped_at)}
      </span>
    )
  },

  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => (
      <span className='text-muted-foreground text-xs tabular-nums'>
        {formatShipmentDate(row.original.created_at)}
      </span>
    )
  }
];

export function shipmentRowMenuActions(
  shipment: DtoAdminShipmentListItem,
  onView: (id: number) => void
) {
  const id = shipment.id;
  if (!id) return null;

  return (
    <DropdownMenuItem className='gap-2 text-[11px] font-semibold' onClick={() => onView(id)}>
      <IconEye className='size-3.5' />
      View shipment
    </DropdownMenuItem>
  );
}
