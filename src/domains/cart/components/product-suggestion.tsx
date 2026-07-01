'use client';

import { IconAlertCircle, IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';

import { AppImage } from '@/components/ui/app-image';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/domains/home/lib/home-utils';
import { IMAGE_FALLBACK } from '@/lib/images';
import { type CartItemPayload, useCartController } from '~/src/hooks/useCartController';
import { usePostProductsSuggestions } from '~/src/services/-products-suggestions-post';

export function ProductSuggestion() {
  const { items, increment } = useCartController();

  // Create a stable key from the product IDs (sorted, unique, joined)
  const productIdsKey = useMemo(() => {
    const ids = items
      .map((item) => item.product_id)
      .filter((id): id is number => id !== undefined && id !== null)
      .sort((a, b) => a - b);
    return ids.join(',');
  }, [items]);

  const {
    mutate: getSuggestions,
    data: suggestionsData,
    isPending,
    isError,
    reset
  } = usePostProductsSuggestions();

  useEffect(() => {
    if (!productIdsKey) {
      reset();
      return;
    }
    const productIds = productIdsKey.split(',').map(Number);
    getSuggestions({ data: { product_ids: productIds, limit: 4 } });
  }, [productIdsKey, getSuggestions, reset]);

  const suggestions = suggestionsData?.data ?? [];

  if (!isPending && suggestions.length === 0 && !isError) return null;

  if (isPending) {
    return (
      <div className='mt-12'>
        <h3 className='mb-4 text-lg font-semibold'>You might also like</h3>
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='space-y-2'>
              <Skeleton className='aspect-square w-full rounded-xl' />
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-4 w-1/2' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='border-destructive/20 bg-destructive/5 mt-12 rounded-lg border p-4 text-center'>
        <IconAlertCircle className='text-destructive mx-auto mb-2 h-8 w-8' />
        <p className='text-muted-foreground text-sm'>
          Couldn’t load suggestions. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className='mt-12 border-t pt-10'>
      <div className='mb-5 flex items-end justify-between gap-4'>
        <div>
          <p className='text-accent mb-1 text-xs font-medium tracking-[0.2em] uppercase'>
            Complete the look
          </p>
          <h3 className='font-display text-xl font-semibold'>You might also like</h3>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
        {suggestions.map((product) => {
          const payload: CartItemPayload = {
            product_id: product.id,
            product_name: product.name,
            price: product.price,
            image_url: product.images?.[0],
            stock: product.stock
          };

          return (
            <div key={product.id} className='group relative'>
              <Link href={`/product/${product.id}`} className='block'>
                <div className='bg-muted relative mb-2 aspect-square overflow-hidden rounded-xl'>
                  <AppImage
                    src={product.images?.[0] || IMAGE_FALLBACK}
                    alt={product.name as string}
                    fill
                    className='object-cover transition-transform duration-300 group-hover:scale-105'
                    sizes='(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw'
                  />
                </div>
                <p className='group-hover:text-accent line-clamp-2 text-sm leading-snug font-medium transition-colors'>
                  {product.name}
                </p>
                <div className='mt-1 flex items-baseline gap-1.5 text-sm'>
                  <span className='font-semibold tabular-nums'>{formatPrice(product.price)}</span>
                  {product.compare_at_price && product.compare_at_price > Number(product.price) && (
                    <span className='text-muted-foreground text-xs tabular-nums line-through'>
                      {formatPrice(product.compare_at_price)}
                    </span>
                  )}
                </div>
              </Link>
              <Button
                type='button'
                size='icon-sm'
                variant='secondary'
                className='absolute top-2 right-2 rounded-full opacity-0 shadow-sm transition-opacity group-hover:opacity-100'
                aria-label={`Add ${product.name} to cart`}
                onClick={() => increment(payload)}
              >
                <IconPlus className='h-4 w-4' />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
