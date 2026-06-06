import Image from 'next/image';
import * as React from 'react';

// 1. Define the interface for an individual item node
export interface LineItem {
  id?: string;
  name: string;
  image: string;
  sku: string;
  category: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface OrderLineItemsProps {
  items: LineItem[];
}

export function OrderLineItems({ items }: OrderLineItemsProps) {
  // Compute subtotal with type safety
  const subtotal = items.reduce((s, i) => s + i.total_price, 0);

  // Currency formatter util
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  // Handle broken product image payloads safely without crashing the client pass
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src =
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=80&h=80&fit=crop';
  };

  return (
    <div className='bg-card border-border/40 overflow-hidden rounded-2xl border shadow-sm'>
      <div className='bg-muted/20 border-border/10 border-b px-6 py-4'>
        <h2 className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
          Line Items{' '}
          <span className='bg-primary/10 text-primary ml-1 rounded-full px-2 py-0.5 text-[10px] leading-none font-black'>
            {items.length}
          </span>
        </h2>
      </div>

      <div className='divide-border/40 divide-y'>
        {items.map((item, i) => (
          <div
            key={item.id || item.sku || i}
            className='hover:bg-muted/20 flex items-center gap-4 px-6 py-4 transition-colors'
          >
            {/* Product Image Wrapper */}
            <div className='border-border/40 bg-muted relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border shadow-sm'>
              <Image
                fill
                src={item.image}
                alt={item.name}
                className='h-full w-full object-cover'
                onError={handleImageError}
              />
            </div>

            {/* Product Information Metadata */}
            <div className='min-w-0 flex-1'>
              <p className='text-foreground truncate text-sm font-semibold'>{item.name}</p>
              <div className='text-muted-foreground mt-0.5 flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase'>
                <span className='text-muted-foreground/80 font-mono tracking-normal'>
                  {item.sku}
                </span>
                <span className='opacity-40'>·</span>
                <span className='bg-secondary border-border/10 text-secondary-foreground rounded border px-1.5 py-0.5 text-[9px] font-black'>
                  {item.category}
                </span>
              </div>
            </div>

            {/* Order Price & Quantity Computations */}
            <div className='flex items-center gap-6 text-right'>
              <div>
                <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                  Unit
                </p>
                <p className='text-foreground mt-0.5 text-sm font-semibold tabular-nums'>
                  {fmt(item.unit_price)}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-center text-[10px] font-bold tracking-widest uppercase'>
                  Qty
                </p>
                <p className='text-foreground mt-0.5 text-center text-sm font-black tabular-nums'>
                  {item.quantity}
                </p>
              </div>
              <div className='min-w-20'>
                <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                  Total
                </p>
                <p className='text-foreground mt-0.5 text-sm font-black tabular-nums'>
                  {fmt(item.total_price)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer Section */}
      <div className='bg-muted/10 border-border/10 border-t px-6 py-5'>
        <div className='flex justify-between text-xs font-semibold'>
          <span className='text-muted-foreground text-[11px] font-bold tracking-wide uppercase'>
            Subtotal
          </span>
          <span className='text-foreground text-sm font-black tabular-nums'>{fmt(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}
