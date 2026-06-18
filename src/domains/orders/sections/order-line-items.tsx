import Image from 'next/image';

import { formatCurrency } from '@/lib/format';
import type { DtoAdminOrderItemView } from '@/services/-orders-{id}-get.schemas';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=80&h=80&fit=crop';

interface OrderLineItemsProps {
  items: DtoAdminOrderItemView[];
  currency?: string;
}

export function OrderLineItems({ items, currency = 'USD' }: OrderLineItemsProps) {
  const subtotal = items.reduce((sum, item) => sum + (item.total_price ?? 0), 0);

  return (
    <div className='bg-card border-border/40 overflow-hidden rounded-2xl border shadow-sm'>
      <div className='bg-muted/20 border-border/10 border-b px-6 py-4'>
        <h2 className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
          Line items{' '}
          <span className='bg-primary/10 text-primary ml-1 rounded-full px-2 py-0.5 text-[10px] leading-none font-black'>
            {items.length}
          </span>
        </h2>
      </div>

      <div className='divide-border/40 divide-y'>
        {items.map((item) => (
          <div
            key={item.id ?? `${item.sku}-${item.product_id}`}
            className='hover:bg-muted/20 flex items-center gap-4 px-6 py-4 transition-colors'
          >
            <div className='border-border/40 bg-muted relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border shadow-sm'>
              <Image
                fill
                src={item.image || PLACEHOLDER_IMAGE}
                alt={item.name ?? 'Product'}
                className='object-cover'
                sizes='56px'
              />
            </div>

            <div className='min-w-0 flex-1'>
              <p className='text-foreground truncate text-sm font-semibold'>
                {item.name ?? 'Product'}
              </p>
              <div className='text-muted-foreground mt-0.5 flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-wider uppercase'>
                {item.sku ? (
                  <span className='text-muted-foreground/80 font-mono tracking-normal'>{item.sku}</span>
                ) : null}
                {item.category ? (
                  <>
                    {item.sku ? <span className='opacity-40'>·</span> : null}
                    <span className='bg-secondary border-border/10 text-secondary-foreground rounded border px-1.5 py-0.5 text-[9px] font-black'>
                      {item.category}
                    </span>
                  </>
                ) : null}
              </div>
            </div>

            <div className='flex items-center gap-6 text-right'>
              <div>
                <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                  Unit
                </p>
                <p className='text-foreground mt-0.5 text-sm font-semibold tabular-nums'>
                  {formatCurrency(item.unit_price ?? 0, currency)}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-center text-[10px] font-bold tracking-widest uppercase'>
                  Qty
                </p>
                <p className='text-foreground mt-0.5 text-center text-sm font-black tabular-nums'>
                  {item.quantity ?? 0}
                </p>
              </div>
              <div className='min-w-20'>
                <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                  Total
                </p>
                <p className='text-foreground mt-0.5 text-sm font-black tabular-nums'>
                  {formatCurrency(item.total_price ?? 0, currency)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='bg-muted/10 border-border/10 border-t px-6 py-5'>
        <div className='flex justify-between text-xs font-semibold'>
          <span className='text-muted-foreground text-[11px] font-bold tracking-wide uppercase'>
            Subtotal
          </span>
          <span className='text-foreground text-sm font-black tabular-nums'>
            {formatCurrency(subtotal, currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
