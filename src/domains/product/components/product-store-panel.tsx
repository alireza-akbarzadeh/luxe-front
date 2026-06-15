'use client';

import {
  IconArrowUpRight,
  IconMapPin,
  IconStar,
  IconStarFilled,
  IconTruck
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DtoProductStoreSummary } from '@/services/-products-{id}-get.schemas';

interface ProductStorePanelProps {
  store?: DtoProductStoreSummary | null;
}

/** Seller store context on the product detail page. */
export function ProductStorePanel({ store }: ProductStorePanelProps) {
  if (!store?.slug) return null;

  const rating = store.rating ?? 0;

  return (
    <section className='border-border/60 bg-card rounded-2xl border p-6 shadow-sm'>
      <p className='text-muted-foreground mb-4 text-xs tracking-[0.2em] uppercase'>Sold by</p>

      <div className='flex items-start gap-4'>
        <div className='bg-muted relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border'>
          {store.logo_url ? (
            <Image src={store.logo_url} alt='' fill className='object-cover' sizes='64px' />
          ) : (
            <div className='flex h-full items-center justify-center text-lg font-semibold'>
              {store.name?.charAt(0)}
            </div>
          )}
        </div>

        <div className='min-w-0 flex-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <h3 className='font-display text-lg font-semibold'>{store.name}</h3>
            {store.is_verified && (
              <Badge variant='secondary' className='rounded-full text-[10px]'>
                Verified
              </Badge>
            )}
          </div>

          {store.location && (
            <p className='text-muted-foreground mt-1 flex items-center gap-1 text-xs'>
              <IconMapPin className='h-3.5 w-3.5' />
              {store.location}
            </p>
          )}

          <div className='mt-2 flex items-center gap-2'>
            <div className='flex'>
              {Array.from({ length: 5 }).map((_, i) => {
                const Icon = i < Math.round(rating) ? IconStarFilled : IconStar;
                return (
                  <Icon
                    key={i}
                    className={cn(
                      'h-3.5 w-3.5',
                      i < Math.round(rating) ? 'fill-accent text-accent' : 'text-muted-foreground/35'
                    )}
                  />
                );
              })}
            </div>
            <span className='text-muted-foreground text-xs'>
              {rating.toFixed(1)} · {store.review_count ?? 0} store reviews
            </span>
          </div>
        </div>
      </div>

      {store.shipping_info && (
        <p className='text-muted-foreground mt-4 flex gap-2 text-sm leading-relaxed'>
          <IconTruck className='text-accent mt-0.5 h-4 w-4 shrink-0' />
          {store.shipping_info}
        </p>
      )}

      {store.return_policy && (
        <p className='text-muted-foreground mt-2 text-xs leading-relaxed'>{store.return_policy}</p>
      )}

      <Button asChild variant='outline' className='mt-5 w-full rounded-full'>
        <Link href={`/store/${store.slug}`}>
          Visit store
          <IconArrowUpRight className='h-4 w-4' />
        </Link>
      </Button>
    </section>
  );
}
