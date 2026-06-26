'use client';

import { IconCheck, IconPackage } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { InfiniteScrollSentinel } from '@/domains/products/components/infinite-scroll-sentinel';
import { StoreProductsGridSkeleton } from '@/domains/store/components/store-skeleton-loading';
import type { DtoProductResponse } from '@/services/-stores-{slug}-products-get.schemas';

import { ProductCard } from '../../shop/components/product-card';
import { useStoreFilters } from '../hooks/useStoreFilter';

interface StoreProductsInfiniteGridProps {
  apiProducts: DtoProductResponse[];
  totalProducts: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

export function StoreProductsInfiniteGrid({
  apiProducts,
  totalProducts,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore
}: StoreProductsInfiniteGridProps) {
  const t = useTranslations('stores.detail.results');
  const tFilters = useTranslations('stores.detail.filters');
  const { showOnlySale, gridCols, clearFilters } = useStoreFilters([]);

  const filteredProducts = showOnlySale
    ? apiProducts.filter((p) => p.compare_at_price && p.compare_at_price > (p.price ?? 0))
    : apiProducts;

  const adaptedProducts = filteredProducts.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    compare_at_price: product.compare_at_price,
    rating: product.rating ?? 0,
    reviews_count: product.reviews_count ?? 0,
    is_new: product.is_new ?? false,
    images: product.images ?? [],
    category: product.category
      ? {
          name: product.category.name ?? '',
          slug: product.category.slug ?? '',
          id: product.category.id ?? 0
        }
      : undefined,
    colors: product.colors ?? [],
    sizes: product.sizes ?? [],
    sku: product.sku ?? '',
    slug: product.slug ?? '',
    stock: product.stock ?? 0,
    status: product.status ?? 'active',
    description: product.description ?? '',
    isLike: false
  }));

  if (adaptedProducts.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='py-16 text-center'>
        <div className='bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
          <IconPackage className='text-muted-foreground h-8 w-8' />
        </div>
        <h3 className='text-lg font-medium'>{t('emptyTitle')}</h3>
        <p className='text-muted-foreground mt-1'>{t('emptyDescription')}</p>
        <Button variant='outline' className='mt-4 rounded-full' onClick={clearFilters}>
          {tFilters('clearAll')}
        </Button>
      </motion.div>
    );
  }

  const gridClassName =
    gridCols === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <p className='text-muted-foreground text-sm'>
          {t('showing', { shown: adaptedProducts.length, total: totalProducts })}
        </p>
      </div>

      <div className={`grid gap-4 ${gridClassName}`}>
        {adaptedProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} priority={index < 4} />
        ))}
      </div>

      {hasNextPage ? (
        <>
          <InfiniteScrollSentinel
            enabled={hasNextPage && !isFetchingNextPage}
            onIntersect={onLoadMore}
          />
          {isFetchingNextPage ? <StoreProductsGridSkeleton /> : null}
          <div className='mt-6 flex justify-center'>
            <Button
              variant='outline'
              className='rounded-full px-8'
              disabled={isFetchingNextPage}
              onClick={onLoadMore}
            >
              {isFetchingNextPage ? t('loading') : t('loadMore')}
            </Button>
          </div>
        </>
      ) : (
        adaptedProducts.length > 0 && (
          <div className='border-gold/15 bg-muted/20 mt-10 flex flex-col items-center gap-2 rounded-2xl border px-6 py-10 text-center'>
            <IconCheck className='text-gold h-8 w-8' />
            <p className='font-medium'>{t('allSeenTitle')}</p>
            <p className='text-muted-foreground text-sm'>
              {t('allSeenDescription', { count: adaptedProducts.length })}
            </p>
          </div>
        )
      )}
    </>
  );
}
