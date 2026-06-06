import {
  IconAdjustmentsHorizontal,
  IconBan,
  IconChevronDown,
  IconCopy,
  IconEye,
  IconRefresh
} from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  OrderStatusBadge,
  PaymentBadge,
  PriorityBadge
} from '@/domains/orders/components/order-statuses-badge';
import type { Order } from '@/domains/orders/orders-types';
import { formatCurrency } from '@/lib/format';
import { copyToClipboard } from '@/lib/utils';

export const orderColumns: ColumnDef<Order>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'order_number',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='-ml-3 h-8 text-[10px] font-bold tracking-widest uppercase'
      >
        Order
        <IconChevronDown className='ml-1 h-3 w-3' />
      </Button>
    ),
    cell: ({ row }) => (
      <span className='flex min-w-30 font-mono text-xs font-bold'>{row.original.order_number}</span>
    )
  },
  {
    accessorKey: 'customer_name',
    header: () => <span className='text-[10px] font-bold tracking-widest uppercase'>Customer</span>,
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className='flex min-w-45 items-center gap-3'>
          <Image
            width={32}
            height={32}
            src={order.customer_avatar}
            alt={order.customer_name}
            className='ring-border h-8 w-8 shrink-0 rounded-full object-cover ring-2'
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(order.customer_name)}&background=random`;
            }}
          />
          <div>
            <p className='text-xs leading-tight font-semibold'>{order.customer_name}</p>
            <p className='text-muted-foreground text-[10px]'>{order.customer_email}</p>
          </div>
        </div>
      );
    },
    enableSorting: false
  },
  {
    accessorKey: 'status',
    header: () => <span className='text-[10px] font-bold tracking-widest uppercase'>Status</span>,
    cell: ({ row }) => <OrderStatusBadge status={row.original.status} />
  },
  {
    accessorKey: 'payment_status',
    header: () => <span className='text-[10px] font-bold tracking-widest uppercase'>Payment</span>,
    cell: ({ row }) => <PaymentBadge status={row.original.payment_status} />
  },
  {
    accessorKey: 'total',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='-ml-3 h-8 text-[10px] font-bold tracking-widest uppercase'
      >
        Total
        <IconChevronDown className='ml-1 h-3 w-3' />
      </Button>
    ),
    cell: ({ row }) => (
      <span className='text-sm font-bold tabular-nums'>
        {formatCurrency(row.original.total, row.original.currency)}
      </span>
    )
  },
  {
    accessorKey: 'channel',
    header: () => <span className='text-[10px] font-bold tracking-widest uppercase'>Channel</span>,
    cell: ({ row }) => (
      <span className='bg-secondary text-secondary-foreground inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold'>
        {row.original.channel}
      </span>
    )
  },
  {
    accessorKey: 'priority',
    header: () => <span className='text-[10px] font-bold tracking-widest uppercase'>Priority</span>,
    cell: ({ row }) => <PriorityBadge priority={row.original.priority} />
  },
  {
    accessorKey: 'ordered_at',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='-ml-3 h-8 text-[10px] font-bold tracking-widest uppercase'
      >
        Date
        <IconChevronDown className='ml-1 h-3 w-3' />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.original.ordered_at;
      return date ? (
        <span className='text-muted-foreground text-xs tabular-nums'>
          {format(new Date(date), 'MMM d, yyyy')}
          <br />
          <span className='text-[10px]'>{format(new Date(date), 'h:mm a')}</span>
        </span>
      ) : (
        <span className='text-muted-foreground'>—</span>
      );
    }
  },
  {
    id: 'items_count',
    header: () => <span className='text-[10px] font-bold tracking-widest uppercase'>Items</span>,
    cell: ({ row }) => (
      <span className='bg-muted inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold'>
        {row.original.items?.length ?? 0}
      </span>
    ),
    enableSorting: false
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const order = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant='ghost' size='icon' className='h-7 w-7 rounded-lg'>
              <IconAdjustmentsHorizontal className='h-3.5 w-3.5' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-44 rounded-xl shadow-xl'>
            <DropdownMenuItem
              className='gap-2 text-[11px] font-semibold'
              onClick={() => (window.location.href = `/dashboard/orders/${order.id}`)}
            >
              <IconEye className='h-3.5 w-3.5' /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              className='gap-2 text-[11px] font-semibold'
              onClick={async () => {
                await copyToClipboard(order.order_number, 'order number');
              }}
            >
              <IconCopy className='h-3.5 w-3.5' /> Copy Order #
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2 text-[11px] font-semibold text-amber-600'>
              <IconRefresh className='h-3.5 w-3.5' /> Reprocess
            </DropdownMenuItem>
            <DropdownMenuItem className='text-destructive gap-2 text-[11px] font-semibold'>
              <IconBan className='h-3.5 w-3.5' /> Cancel Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false
  }
];
