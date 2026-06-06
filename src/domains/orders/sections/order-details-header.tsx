import {
  IconArrowLeft,
  IconBan,
  IconCircleCheck,
  IconCopy,
  IconDots,
  IconPrinter,
  IconRefresh,
  IconSend
} from '@tabler/icons-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
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
import type { OrderStatus, PaymentStatus, PriorityLevel } from '@/domains/orders/orders-types';

export interface HeaderOrderDetails {
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  priority: PriorityLevel;
  ordered_at: string | Date;
  channel: string;
  tags?: string[] | null;
}

export interface OrderDetailHeaderProps {
  order: HeaderOrderDetails;
  onStatusChange: (status: OrderStatus) => void | Promise<void>;
}

export function OrderDetailHeader({ order, onStatusChange }: OrderDetailHeaderProps) {
  // Clipboard copying helper with strict typing
  const handleCopy = async (val: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(val);
      toast.success('Copied order number to clipboard');
    }
  };

  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
      {/* Back Button & Main Heading Meta */}
      <div className='flex items-start gap-4'>
        <Link href='/dashboard/orders'>
          <Button
            variant='ghost'
            size='icon'
            className='border-border/60 h-9 w-9 shrink-0 rounded-xl border shadow-sm'
          >
            <IconArrowLeft className='h-4 w-4' />
          </Button>
        </Link>
        <div>
          <div className='flex flex-wrap items-center gap-3'>
            <h1 className='text-foreground font-mono text-xl font-black tracking-tight'>
              {order.order_number}
            </h1>
            <OrderStatusBadge status={order.status} />
            <PaymentBadge status={order.payment_status} />
            <PriorityBadge priority={order.priority} />
          </div>

          <div className='text-muted-foreground mt-1.5 flex flex-wrap items-center gap-3 text-xs font-medium'>
            <span>Placed {format(new Date(order.ordered_at), "MMM d, yyyy 'at' h:mm a")}</span>
            <span className='hidden opacity-40 sm:inline'>·</span>
            <span className='capitalize'>{order.channel}</span>
            {order.tags?.map((tag) => (
              <span
                key={tag}
                className='bg-secondary text-secondary-foreground border-border/10 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase'
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons & Operations Dropdown */}
      <div className='flex shrink-0 items-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => handleCopy(order.order_number)}
          className='h-9 gap-2 rounded-xl text-[10px] font-bold tracking-wide uppercase'
        >
          <IconCopy className='h-3.5 w-3.5' /> Copy #
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => typeof window !== 'undefined' && window.print()}
          className='h-9 gap-2 rounded-xl text-[10px] font-bold tracking-wide uppercase'
        >
          <IconPrinter className='h-3.5 w-3.5' /> Print
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='icon' className='h-9 w-9 rounded-xl'>
              <IconDots className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='border-border/40 w-48 rounded-xl border shadow-xl'
          >
            <DropdownMenuItem
              className='gap-2 text-[11px] font-bold tracking-wider uppercase'
              onClick={() => onStatusChange('Processing')}
            >
              <IconRefresh className='h-3.5 w-3.5 text-amber-500' /> Mark as Processing
            </DropdownMenuItem>
            <DropdownMenuItem
              className='gap-2 text-[11px] font-bold tracking-wider uppercase'
              onClick={() => onStatusChange('Fulfilled')}
            >
              <IconCircleCheck className='h-3.5 w-3.5 text-sky-500' /> Mark as Fulfilled
            </DropdownMenuItem>
            <DropdownMenuItem
              className='gap-2 text-[11px] font-bold tracking-wider uppercase'
              onClick={() => onStatusChange('Shipped')}
            >
              <IconSend className='h-3.5 w-3.5 text-blue-500' /> Mark as Shipped
            </DropdownMenuItem>
            <DropdownMenuItem
              className='gap-2 text-[11px] font-bold tracking-wider uppercase'
              onClick={() => onStatusChange('Delivered')}
            >
              <IconCircleCheck className='h-3.5 w-3.5 text-emerald-500' /> Mark as Delivered
            </DropdownMenuItem>
            <DropdownMenuSeparator className='bg-border/40' />
            <DropdownMenuItem
              className='text-destructive focus:text-destructive gap-2 text-[11px] font-bold tracking-wider uppercase'
              onClick={() => onStatusChange('Cancelled')}
            >
              <IconBan className='h-3.5 w-3.5' /> Cancel Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
