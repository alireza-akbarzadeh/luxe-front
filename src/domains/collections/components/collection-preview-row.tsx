'use client';

import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';

import { ProductCard } from '@/domains/shop/components/product-card';
import { cn } from '@/lib/utils';
import { useGetProducts } from '@/services/-products-get';
import type { GetProductsParams } from '@/services/-products-get.schemas';

import type { CuratedCollection } from '../lib/collections.config';

interface CollectionPreviewRowProps {
  collection: CuratedCollection;
  className?: string;
}

export function CollectionPreviewRow({ collection, className }: CollectionPreviewRowProps) {
  const previewParams: GetProductsParams = {
    status: 'active',
    limit: 4,
    offset: 0,
    ...collection.previewParams
  };

  const { data, isLoading } = useGetProducts(previewParams);

  const products = data?.data?.products ?? [];
  const total = data?.data?.total;

  if (isLoading) {
    return (
      <div className={cn('mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4', className)}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className='bg-muted aspect-[4/5] animate-pulse rounded-2xl' />
        ))}
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <div className={cn('mt-6 lg:mt-8', className)}>
      <div className='mb-4 flex flex-wrap items-end justify-between gap-3'>
        <div>
          <p className='text-accent text-[11px] font-semibold tracking-[0.2em] uppercase'>
            From this edit
          </p>
          <p className='text-muted-foreground mt-1 text-sm'>
            {typeof total === 'number' && total > 0
              ? `${total} pieces in this collection`
              : 'Hand-picked preview from the catalog'}
          </p>
        </div>
        <Link
          href={collection.href}
          className='text-foreground hover:text-accent inline-flex items-center gap-1.5 text-sm font-medium transition-colors'
        >
          View all
          <IconArrowRight className='size-4' />
        </Link>
      </div>

      <div className='custom-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0'>
        {products.map((product, index) => (
          <div key={product.id ?? index} className='min-w-[42vw] shrink-0 sm:min-w-[30vw] lg:min-w-0'>
            <ProductCard product={product} index={index} size='compact' />
          </div>
        ))}
      </div>
    </div>
  );
}
