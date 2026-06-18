import { IconMail, IconUser } from '@tabler/icons-react';

import type { DtoAdminOrderDetailResponse } from '@/services/-orders-{id}-get.schemas';

interface OrderCustomerCardProps {
  order: DtoAdminOrderDetailResponse;
}

function getInitials(name?: string) {
  if (!name?.trim()) return '?';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function OrderCustomerCard({ order }: OrderCustomerCardProps) {
  const name = order.customer_name?.trim() || 'Unknown customer';

  return (
    <div className='bg-card border-border/40 overflow-hidden rounded-2xl border shadow-sm'>
      <div className='bg-muted/20 border-border/10 border-b px-6 py-4'>
        <h2 className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
          Customer
        </h2>
      </div>
      <div className='space-y-5 p-6'>
        <div className='flex items-center gap-3'>
          <div className='bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-bold'>
            {getInitials(name)}
          </div>
          <div className='min-w-0'>
            <p className='text-foreground truncate text-sm font-bold'>{name}</p>
            <div className='text-muted-foreground mt-0.5 flex items-center gap-1.5 text-xs font-medium'>
              <IconMail className='text-muted-foreground/60 h-3.5 w-3.5 shrink-0' />
              <span className='truncate'>{order.customer_email ?? '—'}</span>
            </div>
          </div>
        </div>

        {order.notes ? (
          <div className='rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 dark:bg-amber-500/10'>
            <p className='mb-1 text-[10px] font-black tracking-widest text-amber-600 uppercase dark:text-amber-400'>
              Order notes
            </p>
            <p className='text-xs leading-relaxed font-medium text-amber-900 dark:text-amber-200/90'>
              {order.notes}
            </p>
          </div>
        ) : (
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <IconUser className='size-3.5' />
            No customer notes on this order
          </div>
        )}
      </div>
    </div>
  );
}
