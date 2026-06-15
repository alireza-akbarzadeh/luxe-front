'use client';

import type { DtoProductWithLike } from '@/services/-products-get.schemas';

import { ProductMarketSnapshot } from './product-market-snapshot';
import { ProductPriceChart } from './product-price-chart';

interface ProductInsightsSectionProps {
  productId: string;
  product: DtoProductWithLike;
}

/** Two-column PDP insights: price trend + marketplace comparison. */
export function ProductInsightsSection({ productId, product }: ProductInsightsSectionProps) {
  return (
    <section className='mt-12 lg:mt-16'>
      <div className='mb-6 max-w-2xl'>
        <h2 className='font-display text-2xl font-semibold tracking-tight'>Shop with confidence</h2>
        <p className='text-muted-foreground mt-2 text-sm'>
          Track how this price has moved and see how it compares to the same model at other stores.
        </p>
      </div>

      <div className='grid items-stretch gap-6 lg:grid-cols-2'>
        <ProductPriceChart productId={productId} className='h-full' />
        <ProductMarketSnapshot
          productId={productId}
          currentPrice={Number(product.price ?? 0)}
          compareAtPrice={product.compare_at_price}
          storeName={product.store?.name ?? 'This listing'}
        />
      </div>
    </section>
  );
}
