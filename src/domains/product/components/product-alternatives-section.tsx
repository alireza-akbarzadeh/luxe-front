'use client';

import { IconArrowUpRight, IconStar } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/domains/home/lib/home-utils';
import { useGetProductsIdAlternatives } from '@/services/-products-{id}-alternatives-get';

interface ProductAlternativesSectionProps {
  productId: string | number;
  productName?: string;
}

/** Same model from other stores — marketplace price comparison. */
export function ProductAlternativesSection({
  productId,
  productName
}: ProductAlternativesSectionProps) {
  const { data, isLoading } = useGetProductsIdAlternatives(String(productId));
  const alternatives = data?.data?.alternatives ?? [];

  if (isLoading) {
    return (
      <section className='mt-16'>
        <Skeleton className='mb-6 h-8 w-64' />
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-36 rounded-2xl' />
          ))}
        </div>
      </section>
    );
  }

  if (!alternatives.length) return null;

  return (
    <section className='mt-16 border-t pt-12'>
      <div className='mb-8 max-w-2xl'>
        <h2 className='font-display text-2xl font-semibold tracking-tight md:text-3xl'>
          Same model, other stores
        </h2>
        <p className='text-muted-foreground mt-2 text-sm'>
          Compare {productName ?? 'this product'} from other verified sellers on Luxe.
        </p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {alternatives.map((item) => (
          <Link
            key={item.id}
            href={`/product/${item.slug ?? item.id}`}
            className='border-border/60 bg-card hover:border-accent/40 group flex gap-4 rounded-2xl border p-4 transition-colors'
          >
            <div className='bg-muted relative h-20 w-20 shrink-0 overflow-hidden rounded-xl'>
              {item.images?.[0] && (
                <Image src={item.images[0]} alt='' fill className='object-cover' sizes='80px' />
              )}
            </div>
            <div className='min-w-0 flex-1'>
              <p className='line-clamp-2 text-sm font-medium leading-snug'>{item.name}</p>
              <p className='text-muted-foreground mt-1 text-xs'>{item.store_name}</p>
              <div className='mt-2 flex flex-wrap items-center gap-2'>
                <span className='font-semibold tabular-nums'>{formatPrice(item.price)}</span>
                {item.store_rating != null && (
                  <span className='text-muted-foreground inline-flex items-center gap-0.5 text-xs'>
                    <IconStar className='fill-accent text-accent h-3 w-3' />
                    {item.store_rating.toFixed(1)}
                  </span>
                )}
              </div>
              <Badge variant='outline' className='mt-2 rounded-full text-[10px]'>
                View listing
                <IconArrowUpRight className='ml-1 h-3 w-3' />
              </Badge>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
