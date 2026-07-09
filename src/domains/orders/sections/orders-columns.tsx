import { IconCopy, IconEye } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Flex } from '@/components/ui/flex';
import {
  ApiOrderStatusBadge,
  ApiPaymentStatusBadge,
  ApiShipmentStatusBadge
} from '@/domains/orders/components/order-api-badges';
import { WorkflowStateBadge } from '@/domains/workflows/components/workflow-state-badge';
import { formatCurrency } from '@/lib/format';
import { copyToClipboard } from '@/lib/utils';
import { createSelectColumn } from '~/src/components/table/data-table';
import type { DtoAdminOrderListItem } from '~/src/services/-orders-get.schemas';

function formatOrderDate(value?: string) {
  if (!value) return '—';
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'MMM d, yyyy · h:mm a');
}

export const orderColumns: ColumnDef<DtoAdminOrderListItem>[] = [
  createSelectColumn<DtoAdminOrderListItem>(),

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
        <p className='text-muted-foreground truncate text-xs'>
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
    accessorKey: 'shipment_status',
    header: 'Shipment',
    cell: ({ row }) => <ApiShipmentStatusBadge status={row.original.shipment_status} />
  },

  {
    id: 'workflow_state',
    header: 'Workflow',
    cell: ({ row }) => <WorkflowStateBadge state={row.original.workflow_state} fallbackLabel='—' />
  },

  {
    id: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const tags = row.original.tags ?? [];
      if (tags.length === 0) {
        return <span className='text-muted-foreground text-xs'>—</span>;
      }

      return (
        <Flex direction='row' wrap='wrap' className='max-w-[160px] gap-1'>
          {tags.map((tag) => (
            <Badge key={tag} variant='outline' className='text-[9px] font-medium'>
              {tag}
            </Badge>
          ))}
        </Flex>
      );
    }
  },

  {
    accessorKey: 'total_amount',
    header: 'Total',
    cell: ({ row }) => (
      <span className='text-sm font-semibold tabular-nums'>
        {formatCurrency(row.original.total_amount ?? 0, row.original.currency ?? 'USD')}
      </span>
    )
  },

  {
    accessorKey: 'items_count',
    header: 'Items',
    cell: ({ row }) => (
      <span className='bg-muted inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold tabular-nums'>
        {row.original.items_count ?? 0}
      </span>
    )
  },

  {
    accessorKey: 'created_at',
    header: 'Placed',
    cell: ({ row }) => (
      <span className='text-muted-foreground text-xs tabular-nums'>
        {formatOrderDate(row.original.created_at)}
      </span>
    )
  }
];

export function orderRowMenuActions(order: DtoAdminOrderListItem, onView: (id: number) => void) {
  const id = order.id;
  if (!id) return null;

  return (
    <>
      <DropdownMenuItem className='gap-2 text-[11px] font-semibold' onClick={() => onView(id)}>
        <IconEye className='size-3.5' />
        View order
      </DropdownMenuItem>
      <DropdownMenuItem
        className='gap-2 text-[11px] font-semibold'
        onClick={() => void copyToClipboard(order.order_number ?? String(id), 'order number')}
      >
        <IconCopy className='size-3.5' />
        Copy order #
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className='gap-2 text-[11px] font-semibold' onClick={() => onView(id)}>
        Open fulfillment
      </DropdownMenuItem>
    </>
  );
}
