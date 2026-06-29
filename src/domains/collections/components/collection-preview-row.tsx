'use client';

import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { useGetProducts } from '@/services/-products-get';
import type { GetProductsParams, GetProductsSort } from '@/services/-products-get.schemas';
import type { DtoCollectionResponse } from '~/src/services/-collections-get.schemas';

import { CollectionProductCard } from './collection-product-card';

interface CollectionPreviewRowProps {
  collection: DtoCollectionResponse;
  className?: string;
}

export function CollectionPreviewRow({ collection, className }: CollectionPreviewRowProps) {
  const previewParams: GetProductsParams = {
    status: 'active',
    limit: 4,
    offset: 0,
    sort: collection.preview_sort as GetProductsSort,
    is_new: true,
    category_id: collection.preview_category_id
  };

  const { data, isLoading } = useGetProducts(previewParams);

  const products = data?.data?.products ?? [];
  const total = data?.data?.total;

  if (isLoading) {
    return (
      <div className={cn('mt-8', className)}>
        <div className='mb-5 flex items-end justify-between gap-4'>
          <div className='space-y-2'>
            <div className='bg-muted h-3 w-24 animate-pulse rounded-full' />
            <div className='bg-muted h-4 w-40 animate-pulse rounded-full' />
          </div>
        </div>
        <div className='custom-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className='bg-muted/40 min-w-[44vw] shrink-0 animate-pulse rounded-[1.35rem] sm:min-w-[32vw] lg:min-w-0'
            >
              <div className='aspect-[4/5] rounded-[1.1rem] p-2.5'>
                <div className='bg-muted h-full w-full rounded-[1.1rem]' />
              </div>
              <div className='space-y-2 px-4 py-4'>
                <div className='bg-muted h-3 w-16 rounded-full' />
                <div className='bg-muted h-4 w-full rounded-full' />
                <div className='bg-muted h-4 w-2/3 rounded-full' />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <div className={cn('mt-8 lg:mt-10', className)}>
      <div className='border-border/50 mb-5 flex flex-wrap items-end justify-between gap-4 border-b pb-4'>
        <div>
          <p className='text-accent text-[11px] font-semibold tracking-[0.2em] uppercase'>
            From this edit
          </p>
          <p className='text-muted-foreground mt-1.5 text-sm'>
            {typeof total === 'number' && total > 0
              ? `${total} pieces curated in this collection`
              : 'A preview of what you will find inside'}
          </p>
        </div>
        <Link
          href={collection.href ?? ''}
          className='border-border/60 hover:border-accent/40 hover:bg-muted/40 inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors'
        >
          Shop collection
          <IconArrowRight className='size-4' />
        </Link>
      </div>

      <div className='custom-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0'>
        {products.map((product, index) => (
          <div
            key={product.id ?? index}
            className='min-w-[44vw] shrink-0 sm:min-w-[32vw] lg:min-w-0'
          >
            <CollectionProductCard product={product} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
