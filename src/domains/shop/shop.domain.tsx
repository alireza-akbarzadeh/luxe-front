'use client';

import { IconRefresh } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { SHOP_PAGE_SIZE } from '@/domains/shop/useProductFilters';
import { cn } from '@/lib/utils';

import { ActiveFilter } from './components/active-filter';
import { FilterContent } from './components/filter-content';
import { ProductGrid } from './components/product-grid';
import { ShopPagination } from './components/shop-pagination';
import { ShopProductsSkeleton } from './components/shop-products-skeleton';
import { ShopToolbar } from './components/shop-toolbar';
import { useShopCatalog } from './hooks/useShopCatalog';

export function ShopDomain() {
  const t = useTranslations('shop');
  const {
    products,
    total,
    apiProducts,
    showOnlySale,
    usesSearchApi,
    page,
    isLoading,
    isError,
    refetch,
    isFetching
  } = useShopCatalog();

  const totalPages = Math.max(1, Math.ceil(total / SHOP_PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : (page - 1) * SHOP_PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * SHOP_PAGE_SIZE, total);
  const isInitialLoading = isLoading && products.length === 0 && !isError;
  const isPageLoading = isFetching && !isInitialLoading;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <div className='app-container mt-10 pb-16'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='mb-12'
      >
        <h1 className='font-display text-4xl font-bold tracking-tight lg:text-5xl'>
          {t('hero.title')}
        </h1>
        <p className='text-muted-foreground mt-4 max-w-2xl'>{t('hero.subtitle')}</p>
      </motion.div>

      <ShopToolbar
        total={total}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        isFetching={isPageLoading}
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
              <p className='text-muted-foreground'>{t('results.loadFailed')}</p>
              <Button variant='outline' onClick={() => refetch()} className='gap-2 rounded-full'>
                <IconRefresh className='h-4 w-4' />
                {t('results.retry')}
              </Button>
            </div>
          ) : isInitialLoading ? (
            <ShopProductsSkeleton />
          ) : (
            <>
              {showOnlySale && !usesSearchApi && products.length < apiProducts.length && (
                <p className='text-muted-foreground mb-4 text-sm'>{t('results.salePageNote')}</p>
              )}
              <div className={cn('relative', isPageLoading && 'pointer-events-none opacity-60')}>
                <ProductGrid products={products} />
              </div>
              <ShopPagination page={page} totalPages={totalPages} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
