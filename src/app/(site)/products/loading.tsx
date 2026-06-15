'use client';

import { ShopProductsSkeleton } from '@/domains/shop/components/shop-products-skeleton';

export default function ProductsLoading() {
  return (
    <div className='pb-20'>
      <div className='from-secondary/40 to-background border-b bg-linear-to-b pt-24 pb-12'>
        <div className='app-container space-y-4'>
          <div className='bg-muted h-8 w-32 animate-pulse rounded-full' />
          <div className='bg-muted h-12 w-72 max-w-full animate-pulse rounded-lg' />
          <div className='bg-muted h-4 max-w-xl animate-pulse rounded' />
        </div>
      </div>
      <div className='app-container mt-8'>
        <ShopProductsSkeleton />
      </div>
    </div>
  );
}
