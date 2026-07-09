import { IconEye } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';

import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Flex } from '@/components/ui/flex';
import { getQueueAction } from '@/domains/fulfillment/lib/fulfillment-queues';
import type { FulfillmentQueue } from '@/domains/fulfillment/schemas/fulfillment.schema';
import { WorkflowStateBadge } from '@/domains/workflows/components/workflow-state-badge';
import { formatCurrency } from '@/lib/format';
import type { DtoAdminOrderListItem } from '@/services/-orders-get.schemas';

function formatOrderDate(value?: string) {
  if (!value) return '—';
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'MMM d, yyyy · h:mm a');
}

interface CreateFulfillmentOrderColumnsOptions {
  queue: Exclude<FulfillmentQueue, 'tracking'>;
  onAction: (order: DtoAdminOrderListItem) => void;
  isPending: boolean;
}

export function createFulfillmentOrderColumns({
  queue,
  onAction,
  isPending
}: CreateFulfillmentOrderColumnsOptions): ColumnDef<DtoAdminOrderListItem>[] {
  const action = getQueueAction(queue);

  return [
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
      id: 'workflow_state',
      header: 'Stage',
      cell: ({ row }) => (
        <WorkflowStateBadge state={row.original.workflow_state} fallbackLabel='—' />
      )
    },
    {
      accessorKey: 'items_count',
      header: 'Items',
      cell: ({ row }) => (
        <span className='text-sm tabular-nums'>{row.original.items_count ?? 0}</span>
      )
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
      accessorKey: 'created_at',
      header: 'Placed',
      cell: ({ row }) => (
        <span className='text-muted-foreground text-xs'>
          {formatOrderDate(row.original.created_at)}
        </span>
      )
    },
    {
      id: 'action',
      header: '',
      cell: ({ row }) => (
        <Flex justify='end'>
          <Button
            type='button'
            size='sm'
            className='rounded-xl'
            disabled={isPending || !row.original.id}
            onClick={(event) => {
              event.stopPropagation();
              onAction(row.original);
            }}
          >
            {action.label}
          </Button>
        </Flex>
      )
    }
  ];
}

export function fulfillmentOrderRowMenuActions(
  order: DtoAdminOrderListItem,
  openOrder: (id: number) => void
) {
  if (!order.id) return null;

  return (
    <>
      <DropdownMenuItem onClick={() => openOrder(order.id!)}>
        <IconEye className='size-4' />
        View order
      </DropdownMenuItem>
    </>
  );
}
