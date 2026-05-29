'use client';

import { IconFilter } from '@tabler/icons-react';
import { notFound } from 'next/navigation';
import { useMemo } from 'react';

import {
  StoreProductsGridSkeleton,
  StoreSkeleton
} from '@/domains/store/components/store-skeleton-loading';
import { useGetStoresSlug } from '@/services/-stores-{slug}-get';
import { useGetStoresSlugProducts } from '@/services/-stores-{slug}-products-get';
import { AppDialog } from '~/src/components/app-dialog';
import { ActiveFilters } from '~/src/domains/store/sections/store-active-filter';
import { StoreFilterSidebar } from '~/src/domains/store/sections/store-details-filter';
import { StoreProductsGrid } from '~/src/domains/store/sections/store-product-grid';
import { StoreHeader } from '~/src/domains/store/sections/store-sort-header';
import { StoreToolbar } from '~/src/domains/store/sections/store-sort-toolbar';
import type { GetStoresSlugProductsParams } from '~/src/services/-stores-{slug}-products-get.schemas';

import { StoreErrorState } from '../components/store-error-state';
import { useStoreFilters } from '../hooks/useStoreFilter';
import { useStoreStore } from '../hooks/useStoreStore';
import { mapToStoreEssentials } from '../store.utils';

export function StoreDomain({ slug }: { slug: string }) {
  const {
    data: storeData,
    isLoading: storeLoading,
    error: storeError,
    refetch: refetchStore
  } = useGetStoresSlug(slug);

  const store = storeData?.data ? mapToStoreEssentials(storeData.data) : null;
  const storeCategories = store?.categories ?? [];

  const filters = useStoreFilters(storeCategories.map((c) => c.name ?? ''));
  const { category, priceRange, minRating, isDigital, showOnlyNew, sortBy, page, searchQuery } =
    filters;

  const categoryId = useMemo(() => {
    if (!category || !store) return undefined;
    const catObj = store.categories?.find((c) => c.name === category);
    return catObj?.id;
  }, [category, store]);

  const apiParams = useMemo<GetStoresSlugProductsParams>(() => {
    const params: GetStoresSlugProductsParams = {
      limit: 20,
      offset: (page - 1) * 20
    };
    if (categoryId) params.category_id = categoryId;
    if (priceRange[0] > 0) params.min_price = priceRange[0];
    if (priceRange[1] < 500) params.max_price = priceRange[1];
    if (minRating > 0) params.min_rating = minRating;
    if (isDigital) params.is_digital = true;
    if (showOnlyNew) params.is_new = true;
    if (searchQuery) params.name = searchQuery;
    switch (sortBy) {
      case 'price-asc':
        params.sort = 'price_asc';
        break;
      case 'price-desc':
        params.sort = 'price_desc';
        break;
      case 'rating':
        params.sort = 'rating_desc';
        break;
      case 'newest':
        params.sort = 'newest';
        break;
      default:
        params.sort = 'rating_desc';
    }
    return params;
  }, [categoryId, priceRange, minRating, isDigital, showOnlyNew, sortBy, page, searchQuery]);

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts
  } = useGetStoresSlugProducts(slug, apiParams);

  const filterMobileSheetOpen = useStoreStore((state) => state.filterMobileSheetOpen);
  const toggleFilterMobileSheet = useStoreStore((state) => state.toggleFilterMobileSheet);

  const apiProducts = productsData?.data?.products || [];
  const totalProducts = productsData?.data?.total || 0;

  if (storeLoading) {
    return <StoreSkeleton />;
  }

  if (storeError || productsError || !store) {
    return (
      <StoreErrorState
        message={storeError?.message || productsError?.message || 'Store not found'}
        onRetryAction={() => {
          refetchStore();
          refetchProducts();
        }}
      />
    );
  }
  if (!store) notFound();

  return (
    <>
      <StoreHeader store={store} totalProducts={totalProducts} />
      <section className='py-8'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <StoreToolbar />
          <ActiveFilters />
          <div className='flex gap-8'>
            <aside className='hidden w-64 shrink-0 lg:block'>
              <div className='sticky top-24'>
                <h2 className='mb-4 flex items-center gap-2 font-semibold'>
                  <IconFilter className='h-4 w-4' />
                  Filters
                </h2>
                <StoreFilterSidebar
                  storeCategories={store.categories}
                  apiProducts={apiProducts}
                  totalProducts={totalProducts}
                />
              </div>
            </aside>
            <div className='flex-1'>
              {productsLoading ? (
                <StoreProductsGridSkeleton />
              ) : (
                <StoreProductsGrid apiProducts={apiProducts} totalProducts={totalProducts} />
              )}
            </div>
          </div>
        </div>
      </section>

      <AppDialog
        title='Filters'
        component='sheet'
        onOpenChange={toggleFilterMobileSheet}
        open={filterMobileSheetOpen}
      >
        <div className='mt-6 px-4'>
          <StoreFilterSidebar
            storeCategories={store.categories}
            apiProducts={apiProducts}
            totalProducts={totalProducts}
          />
        </div>
      </AppDialog>
    </>
  );
}
