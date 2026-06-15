'use client';

import Link from 'next/link';

import { ProductCard } from '@/domains/shop/components/product-card';
import { useGetProducts } from '@/services/-products-get';

import type { CuratedCollection } from '../lib/collections.config';

interface CollectionPreviewRowProps {
  collection: CuratedCollection;
}

export function CollectionPreviewRow({ collection }: CollectionPreviewRowProps) {
  const params = collection.previewParams ?? { sort: 'rating_desc' };

  const { data, isLoading } = useGetProducts({
    status: 'active',
    limit: 4,
    offset: 0,
    ...params
  });

  const products = data?.data?.products ?? [];

  if (isLoading) {
    return (
      <div className='mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4'>
        {[...Array(4)].map((_, index) => (
          <div key={index} className='bg-muted aspect-[4/5] animate-pulse rounded-2xl' />
        ))}
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <div className='mt-6'>
      <div className='mb-4 flex items-center justify-between gap-4'>
        <p className='text-muted-foreground text-sm'>Preview picks</p>
        <Link href={collection.href} className='text-accent text-sm font-medium hover:underline'>
          View all
        </Link>
      </div>
      <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
        {products.map((product, index) => (
          <ProductCard key={product.id ?? index} product={product} index={index} size='compact' />
        ))}
      </div>
    </div>
  );
}
