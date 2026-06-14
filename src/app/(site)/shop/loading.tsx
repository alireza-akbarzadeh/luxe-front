'use client';

import { ShopProductsSkeleton } from '@/domains/shop/components/shop-products-skeleton';

export default function ShopLoading() {
  return (
    <div className='app-container mt-10 pb-16'>
      <div className='mb-12 space-y-4'>
        <div className='bg-muted h-10 w-48 animate-pulse rounded-lg' />
        <div className='bg-muted h-4 max-w-2xl animate-pulse rounded' />
      </div>
      <ShopProductsSkeleton />
    </div>
  );
}
