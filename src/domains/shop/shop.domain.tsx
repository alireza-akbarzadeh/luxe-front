'use client';

import { IconRefresh } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';
import { useGetProducts } from '~/src/services/-products-get';

import { ActiveFilter } from './components/active-filter';
import { FilterContent } from './components/filter-content';
import { ProductGrid } from './components/product-grid';
import { ShopPagination } from './components/shop-pagination';
import { ShopProductsSkeleton } from './components/shop-products-skeleton';
import { ShopToolbar } from './components/shop-toolbar';
import { SHOP_PAGE_SIZE, useProductFilters } from './useProductFilters';

function filterSaleProducts(products: DtoProductWithLike[]) {
  return products.filter(
    (product) => product.compare_at_price && product.compare_at_price > (product.price ?? 0)
  );
}

export function ShopDomain() {
  const { apiParams, showOnlySale, page } = useProductFilters();

  const { data, isLoading, isError, refetch, isFetching } = useGetProducts(apiParams);

  const products = useMemo(() => {
    const list = data?.data?.products ?? [];
    return showOnlySale ? filterSaleProducts(list) : list;
  }, [data?.data?.products, showOnlySale]);

  const total = data?.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / SHOP_PAGE_SIZE));
  const apiProducts = data?.data?.products ?? [];
  const rangeStart = total === 0 ? 0 : (page - 1) * SHOP_PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * SHOP_PAGE_SIZE, total);

  return (
    <div className='app-container mt-10 pb-16'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='mb-12'
      >
        <h1 className='font-display text-4xl font-bold tracking-tight lg:text-5xl'>Shop All</h1>
        <p className='text-muted-foreground mt-4 max-w-2xl'>
          Explore our complete collection of premium products, curated for those who appreciate
          quality and timeless design.
        </p>
      </motion.div>

      <ShopToolbar
        total={total}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        isFetching={isFetching && !isLoading}
      />
      <ActiveFilter />

      <div className='flex gap-12'>
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='hidden w-64 shrink-0 lg:block'
        >
          <div className='sticky top-32'>
            <FilterContent />
          </div>
        </motion.aside>

        <div className='min-w-0 flex-1'>
          {isError ? (
            <div className='border-border bg-muted/20 flex flex-col items-center justify-center gap-4 rounded-2xl border py-20 text-center'>
              <p className='text-muted-foreground'>Could not load products. Please try again.</p>
              <Button variant='outline' onClick={() => refetch()} className='gap-2 rounded-full'>
                <IconRefresh className='h-4 w-4' />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <ShopProductsSkeleton />
          ) : (
            <>
              {showOnlySale && products.length < apiProducts.length && (
                <p className='text-muted-foreground mb-4 text-sm'>
                  Showing sale items from the current page of results.
                </p>
              )}
              <ProductGrid products={products} />
              <ShopPagination page={page} totalPages={totalPages} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
