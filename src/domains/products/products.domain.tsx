'use client';

import { IconRefresh } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { ProductsCatalogSkeleton } from '@/domains/products/components/products-page-skeleton';
import { ActiveFilter } from '@/domains/shop/components/active-filter';
import { FilterContent } from '@/domains/shop/components/filter-content';
import { ShopToolbar } from '@/domains/shop/components/shop-toolbar';

import { ProductsHero } from './components/products-hero';
import { ProductsInfiniteGrid } from './components/products-infinite-grid';
import { useInfiniteProductCatalog } from './hooks/useInfiniteProductCatalog';

export function ProductsDomain() {
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
    fetchNextPage
  } = useInfiniteProductCatalog();

  const hasLoadedProducts = loadedCount > 0;
  const isInitialLoading = isLoading && !hasLoadedProducts;
  const isRefetching = isFetching && !isFetchingNextPage && !isInitialLoading;
  const showFetchError = isError && !hasLoadedProducts;

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <>
      <ProductsHero total={total} loadedCount={loadedCount} isFetching={isRefetching} />

      <div className='app-container pb-20'>
        <div className='bg-background/95 sticky top-16 z-20 pt-8 backdrop-blur-md lg:top-20'>
          <ShopToolbar
            total={total}
            rangeStart={loadedCount === 0 ? 0 : 1}
            rangeEnd={loadedCount}
            isFetching={isRefetching}
          />
          <ActiveFilter />
        </div>

        <div className='mt-8 flex gap-12'>
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='hidden w-64 shrink-0 lg:block'
          >
            <div className='sticky top-28'>
              <div className='bg-card rounded-2xl border p-6 shadow-sm'>
                <h2 className='font-display mb-4 text-lg font-semibold'>Filters</h2>
                <FilterContent />
              </div>
            </div>
          </motion.aside>

          <div className='min-w-0 flex-1'>
            {showFetchError ? (
              <div className='border-border bg-muted/20 flex flex-col items-center justify-center gap-4 rounded-2xl border py-20 text-center'>
                <p className='text-muted-foreground'>Could not load products. Please try again.</p>
                <Button variant='outline' onClick={() => refetch()} className='gap-2 rounded-full'>
                  <IconRefresh className='h-4 w-4' />
                  Retry
                </Button>
              </div>
            ) : isInitialLoading ? (
              <ProductsCatalogSkeleton view='grid' />
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
