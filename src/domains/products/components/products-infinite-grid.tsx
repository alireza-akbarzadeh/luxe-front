'use client';

import { Button } from '@/components/ui/button';
import { ProductCard } from '@/domains/shop/components/product-card';
import { useProductFilters } from '@/domains/shop/useProductFilters';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

import { InfiniteScrollSentinel } from './infinite-scroll-sentinel';
import { ProductsEndState, ProductsLoadMoreSkeleton } from './products-load-state';

interface ProductsInfiniteGridProps {
  products: DtoProductWithLike[];
  total: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isRefetching: boolean;
  onLoadMore: () => void;
}

export function ProductsInfiniteGrid({
  products,
  total,
  hasNextPage,
  isFetchingNextPage,
  isRefetching,
  onLoadMore
}: ProductsInfiniteGridProps) {
  const { gridCols, clearFilters } = useProductFilters();

  const gridClassName =
    gridCols === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  if (products.length === 0 && !isRefetching) {
    return (
      <div className='py-20 text-center'>
        <p className='text-muted-foreground mb-4'>No products found matching your criteria.</p>
        <Button variant='outline' className='rounded-full' onClick={clearFilters}>
          Clear filters
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className={`grid gap-5 md:gap-6 ${gridClassName}`}>
        {products.map((product, index) => (
          <ProductCard
            key={product.id ?? `product-${index}`}
            product={product}
            index={Math.min(index, 11)}
            priority={index < 4}
          />
        ))}
      </div>

      {hasNextPage ? (
        <>
          <InfiniteScrollSentinel
            enabled={hasNextPage && !isFetchingNextPage}
            onIntersect={onLoadMore}
          />
          {isFetchingNextPage ? <ProductsLoadMoreSkeleton /> : null}
          <div className='mt-6 flex justify-center'>
            <Button
              variant='outline'
              className='rounded-full px-8'
              disabled={isFetchingNextPage}
              onClick={onLoadMore}
            >
              {isFetchingNextPage ? 'Loading…' : 'Load more'}
            </Button>
          </div>
        </>
      ) : (
        products.length > 0 && <ProductsEndState loadedCount={products.length} />
      )}

      {total > 0 && products.length < total && !hasNextPage && (
        <p className='text-muted-foreground mt-4 text-center text-xs'>
          Showing {products.length} of {total} after filters
        </p>
      )}
    </>
  );
}
