'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePostProductsSuggestions } from '~/src/services/-products-suggestions-post';
import { useCart } from '~/src/hooks/useCartController';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { IconAlertCircle } from '@tabler/icons-react';

export function ProductSuggestion() {
  const { items } = useCart();
  const productIds = items.map((item) => item.product_id).filter(Boolean);

  const {
    mutate: getSuggestions,
    data: suggestionsData,
    isPending,
    isError,
    reset
  } = usePostProductsSuggestions();

  // Fetch suggestions when cart changes
  React.useEffect(() => {
    if (productIds.length === 0) {
      reset();
      return;
    }
    getSuggestions({ data: { product_ids: productIds, limit: 4 } });
  }, [productIds, getSuggestions, reset]);

  const suggestions = suggestionsData?.data ?? [];

  // No suggestions to show
  if (!isPending && suggestions.length === 0 && !isError) return null;

  // Loading skeleton
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

  // Error state
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

  // Success state – show products
  return (
    <div className='mt-12'>
      <h3 className='mb-4 text-lg font-semibold'>You might also like</h3>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
        {suggestions.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className='group transition-transform hover:scale-[1.02]'
          >
            <div className='bg-muted relative mb-2 aspect-square overflow-hidden rounded-xl'>
              <Image
                src={product.images?.[0] || '/placeholder.png'}
                alt={product.name as string}
                fill
                className='object-cover transition-transform duration-300 group-hover:scale-105'
                sizes='(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw'
              />
            </div>
            <p className='group-hover:text-accent line-clamp-1 text-sm font-medium transition-colors'>
              {product.name}
            </p>
            <div className='flex items-baseline gap-1.5 text-sm'>
              <span className='font-semibold'>${product.price}</span>
              {product.compare_at_price && product.compare_at_price > Number(product.price) && (
                <span className='text-muted-foreground text-xs line-through'>
                  ${product.compare_at_price}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
