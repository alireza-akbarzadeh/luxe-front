'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { EmptyProducts } from '@/domains/products/components/empty-products';
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
  const t = useTranslations('products.grid');
  const { gridCols, clearFilters } = useProductFilters();

  // Vertical ProductCards — default / preferred: 3 columns
  const gridClassName =
    gridCols === 4
      ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3';

  if (products.length === 0 && !isRefetching) {
    return <EmptyProducts onReset={clearFilters} />;
  }

  return (
    <>
      <div className={`grid gap-4 md:gap-5 lg:gap-6 ${gridClassName}`}>
        {products.map((product, index) => (
          <ProductCard
            key={product.id ?? `product-${index}`}
            product={product}
            index={Math.min(index, 11)}
            priority={index < 3}
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
          <div className='mt-8 flex justify-center'>
            <Button
              variant='outline'
              className='h-11 rounded-full px-8'
              disabled={isFetchingNextPage}
              onClick={onLoadMore}
            >
              {isFetchingNextPage ? t('loadingMore') : t('loadMore')}
            </Button>
          </div>
        </>
      ) : (
        products.length > 0 && <ProductsEndState loadedCount={products.length} />
      )}

      {total > 0 && products.length < total && !hasNextPage && (
        <p className='text-muted-foreground mt-4 text-center text-xs'>
          {t('filteredNote', { shown: products.length, total })}
        </p>
      )}
    </>
  );
}
