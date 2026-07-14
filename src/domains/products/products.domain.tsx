'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

import { EmptyProducts, ProductsErrorState } from '@/domains/products/components/empty-products';
import { ProductsCatalogSkeleton } from '@/domains/products/components/products-page-skeleton';
import { ActiveFilter } from '@/domains/shop/components/active-filter';
import { FilterContent } from '@/domains/shop/components/filter-content';
import { ShopToolbar } from '@/domains/shop/components/shop-toolbar';

import { ProductsHero, type ProductsHeroVariant } from './components/products-hero';
import { ProductsInfiniteGrid } from './components/products-infinite-grid';
import { useInfiniteProductCatalog } from './hooks/useInfiniteProductCatalog';

interface ProductsDomainProps {
  variant?: ProductsHeroVariant;
}

export function ProductsDomain({ variant = 'default' }: ProductsDomainProps) {
  const t = useTranslations('shop.toolbar');
  const {
    products,
    total,
    loadedCount,
    isLoading,
    isError,
    refetch,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    clearFilters
  } = useInfiniteProductCatalog();

  const hasLoadedProducts = loadedCount > 0;
  const isInitialLoading = isLoading && !hasLoadedProducts;
  const isRefetching = isFetching && !isFetchingNextPage && !isInitialLoading;
  const showFetchError = isError && !hasLoadedProducts;

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <>
      <ProductsHero
        total={total}
        loadedCount={loadedCount}
        isFetching={isRefetching}
        variant={variant}
      />

      <div className='app-container pb-24'>
        <div className='bg-background/95 sticky top-16 z-20 pt-8 backdrop-blur-md lg:top-20'>
          <ShopToolbar
            total={total}
            rangeStart={loadedCount === 0 ? 0 : 1}
            rangeEnd={loadedCount}
            isFetching={isRefetching}
          />
          <ActiveFilter />
        </div>

        <div className='mt-6 flex gap-10 xl:gap-12'>
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='hidden w-72 shrink-0 lg:block'
          >
            <div className='sticky top-36'>
              <div className='bg-card/90 flex max-h-[calc(100vh-10rem)] flex-col overflow-hidden rounded-3xl border shadow-[0_12px_40px_-24px_rgba(0,0,0,0.35)] backdrop-blur-sm'>
                <div className='border-border/60 shrink-0 border-b px-5 py-4'>
                  <h2 className='font-display text-lg font-semibold'>{t('filters')}</h2>
                </div>
                <div className='flex min-h-0 flex-1 flex-col px-5 py-4'>
                  <FilterContent />
                </div>
              </div>
            </div>
          </motion.aside>

          <div className='min-w-0 flex-1'>
            {showFetchError ? (
              <ProductsErrorState onRetry={() => refetch()} />
            ) : isInitialLoading ? (
              <ProductsCatalogSkeleton />
            ) : products.length === 0 && !isRefetching ? (
              <EmptyProducts onReset={clearFilters} />
            ) : (
              <ProductsInfiniteGrid
                products={products}
                total={total}
                hasNextPage={Boolean(hasNextPage)}
                isFetchingNextPage={isFetchingNextPage}
                isRefetching={isRefetching}
                onLoadMore={handleLoadMore}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
