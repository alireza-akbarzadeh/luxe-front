'use client';

import { IconArrowLeft, IconBan, IconCopy, IconDots, IconPrinter } from '@tabler/icons-react';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';

import { AppDialog } from '@/components/app-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  ApiOrderStatusBadge,
  ApiPaymentStatusBadge
} from '@/domains/orders/components/order-api-badges';
import { copyToClipboard } from '@/lib/utils';
import type { DtoAdminOrderDetailResponse } from '@/services/-orders-{id}-get.schemas';

interface OrderDetailHeaderProps {
  order: DtoAdminOrderDetailResponse;
  onCancel: () => Promise<void>;
  isCancelling?: boolean;
}

function formatPlacedAt(value?: string) {
  if (!value) return '—';
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

const CANCELLABLE_STATUSES = new Set(['pending', 'paid', 'delayed']);

export function OrderDetailHeader({ order, onCancel, isCancelling }: OrderDetailHeaderProps) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const canCancel = CANCELLABLE_STATUSES.has((order.status ?? '').toLowerCase());

  const handleCancel = async () => {
    try {
      await onCancel();
      setCancelOpen(false);
    } catch {
      // Toast handled by parent
    }
  };

  return (
    <>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
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
                {order.order_number ?? `#${order.id}`}
              </h1>
              <ApiOrderStatusBadge status={order.status} size='md' />
              <ApiPaymentStatusBadge status={order.payment_status} size='md' />
            </div>
            <p className='text-muted-foreground mt-1.5 text-xs font-medium'>
              Placed {formatPlacedAt(order.created_at)}
              {order.updated_at && order.updated_at !== order.created_at ? (
                <span className='text-muted-foreground/70'>
                  {' '}
                  · Updated {formatPlacedAt(order.updated_at)}
                </span>
              ) : null}
            </p>
          </div>
        </div>

        <div className='flex shrink-0 items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='h-9 gap-2 rounded-xl text-[10px] font-bold tracking-wide uppercase'
            onClick={() =>
              void copyToClipboard(order.order_number ?? String(order.id), 'order number')
            }
          >
            <IconCopy className='h-3.5 w-3.5' />
            Copy #
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='h-9 gap-2 rounded-xl text-[10px] font-bold tracking-wide uppercase'
            onClick={() => typeof window !== 'undefined' && window.print()}
          >
            <IconPrinter className='h-3.5 w-3.5' />
            Print
          </Button>

          {canCancel ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='icon' className='h-9 w-9 rounded-xl'>
                  <IconDots className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-48 rounded-xl'>
                <DropdownMenuItem
                  className='text-destructive focus:text-destructive gap-2 text-[11px] font-bold tracking-wider uppercase'
                  onClick={() => setCancelOpen(true)}
                >
                  <IconBan className='h-3.5 w-3.5' />
                  Cancel order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>

      <AppDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title='Cancel this order?'
        description='Stock will be restored and wallet payments refunded where applicable. This cannot be undone.'
        size='sm'
      >
        <div className='flex justify-end gap-2'>
          <Button type='button' variant='ghost' onClick={() => setCancelOpen(false)}>
            Keep order
          </Button>
          <Button
            type='button'
            variant='destructive'
            disabled={isCancelling}
            onClick={() => void handleCancel()}
          >
            {isCancelling ? 'Cancelling…' : 'Cancel order'}
          </Button>
        </div>
      </AppDialog>
    </>
  );
}
