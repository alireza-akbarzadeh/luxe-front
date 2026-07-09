import { IconEye } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Flex } from '@/components/ui/flex';
import { ReturnTypeBadge } from '@/domains/returns-admin/components/return-type-badge';
import type { DtoReturnResponse } from '@/domains/returns-admin/lib/return-list';
import { createWorkflowStateColumn } from '@/domains/workflows/lib/create-workflow-state-column';
import { formatCurrency } from '@/lib/format';

function formatReturnDate(value?: string) {
  if (!value) return '—';
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'MMM d, yyyy · h:mm a');
}

interface CreateReturnColumnsOptions {
  onQuickApprove?: (returnItem: DtoReturnResponse) => void;
  onQuickReject?: (returnItem: DtoReturnResponse) => void;
  isActionPending?: boolean;
}

export function createReturnColumns({
  onQuickApprove,
  onQuickReject,
  isActionPending = false
}: CreateReturnColumnsOptions = {}): ColumnDef<DtoReturnResponse>[] {
  return [
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

    {
      id: 'return_type',
      header: 'Type',
      cell: ({ row }) => <ReturnTypeBadge returnType={row.original.return_type} />
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
          {row.original.return_type === 'exchange'
            ? '—'
            : formatCurrency(row.original.refund_amount ?? 0)}
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
      id: 'customer',
      header: 'Customer',
      cell: ({ row }) => (
        <div className='min-w-36'>
          <p className='text-sm font-medium'>{row.original.customer_name?.trim() || 'Unknown'}</p>
          <p className='text-muted-foreground truncate text-xs'>
            {row.original.customer_email ?? `User #${row.original.user_id ?? '—'}`}
          </p>
        </div>
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
    },

    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const isRequested =
          row.original.status === 'requested' || row.original.state?.code === 'requested';

        if (!isRequested || !row.original.id) return null;

        return (
          <Flex justify='end' className='gap-1'>
            <Button
              type='button'
              size='sm'
              className='rounded-xl'
              disabled={isActionPending}
              onClick={(event) => {
                event.stopPropagation();
                onQuickApprove?.(row.original);
              }}
            >
              Approve
            </Button>
            <Button
              type='button'
              size='sm'
              variant='outline'
              className='rounded-xl'
              disabled={isActionPending}
              onClick={(event) => {
                event.stopPropagation();
                onQuickReject?.(row.original);
              }}
            >
              Reject
            </Button>
          </Flex>
        );
      }
    }
  ];
}

export const returnColumns = createReturnColumns();

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
