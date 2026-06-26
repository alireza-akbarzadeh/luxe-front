'use client';

import { IconFilter, IconRefresh } from '@tabler/icons-react';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { sectionContainerClass } from '@/domains/home/lib/home-utils';
import { StoreDetailMetaBar } from '@/domains/store/components/store-detail-breadcrumb';
import { StoreProductsInfiniteGrid } from '@/domains/store/components/store-products-infinite-grid';
import {
  StoreProductsGridSkeleton,
  StoreSkeleton
} from '@/domains/store/components/store-skeleton-loading';
import { useInfiniteStoreProducts } from '@/domains/store/hooks/useInfiniteStoreProducts';
import {
  filterStoreSaleProducts,
  flattenInfiniteStoreProducts,
  getInfiniteStoreProductsTotal,
  toStoreProductsCatalogParams
} from '@/domains/store/lib/store-products.utils';
import { useGetStoresSlug } from '@/services/-stores-{slug}-get';
import { AppDialog } from '~/src/components/app-dialog';
import { ActiveFilters } from '~/src/domains/store/sections/store-active-filter';
import { StoreFilterSidebar } from '~/src/domains/store/sections/store-details-filter';
import { StoreReviewsSection } from '~/src/domains/store/sections/store-reviews-section';
import { StoreHeader } from '~/src/domains/store/sections/store-sort-header';
import { StoreToolbar } from '~/src/domains/store/sections/store-sort-toolbar';

import { StoreErrorState } from '../components/store-error-state';
import { useStoreFilters } from '../hooks/useStoreFilter';
import { useStoreStore } from '../hooks/useStoreStore';
import { mapToStoreEssentials } from '../store.utils';

export function StoreDomain({ slug }: { slug: string }) {
  const t = useTranslations('stores.detail');
  const {
    data: storeData,
    isLoading: storeLoading,
    error: storeError,
    refetch: refetchStore
  } = useGetStoresSlug(slug);

  const store = storeData?.data ? mapToStoreEssentials(storeData.data) : null;
  const storeCategories = store?.categories ?? [];

  const filters = useStoreFilters(storeCategories.map((c) => c.name ?? ''));
  const {
    category,
    priceRange,
    minRating,
    isDigital,
    showOnlyNew,
    sortBy,
    searchQuery,
    showOnlySale
  } = filters;

  const catalogParams = useMemo(() => {
    if (!store) return {};
    return toStoreProductsCatalogParams({
      category,
      priceRange,
      minRating,
      isDigital,
      showOnlyNew,
      sortBy,
      searchQuery,
      store
    });
  }, [category, priceRange, minRating, isDigital, showOnlyNew, sortBy, searchQuery, store]);

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useInfiniteStoreProducts(slug, catalogParams);

  const filterMobileSheetOpen = useStoreStore((state) => state.filterMobileSheetOpen);
  const toggleFilterMobileSheet = useStoreStore((state) => state.toggleFilterMobileSheet);

  const rawProducts = useMemo(
    () => flattenInfiniteStoreProducts(productsData?.pages ?? []),
    [productsData?.pages]
  );

  const apiProducts = useMemo(
    () => (showOnlySale ? filterStoreSaleProducts(rawProducts) : rawProducts),
    [rawProducts, showOnlySale]
  );

  const totalProducts = getInfiniteStoreProductsTotal(productsData?.pages);
  const hasLoadedProducts = apiProducts.length > 0;
  const isInitialProductsLoading = productsLoading && !hasLoadedProducts;
  const isRefetchingProducts = isFetching && !isFetchingNextPage && !isInitialProductsLoading;

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (storeLoading) {
    return <StoreSkeleton />;
  }

  if (storeError || !store) {
    return (
      <StoreErrorState
        message={storeError?.message || t('notFound')}
        onRetryAction={() => {
          refetchStore();
        }}
      />
    );
  }
  if (!store) notFound();

  const sidebarProducts = productsData?.pages[0]?.data?.products ?? [];

  return (
    <>
      <StoreHeader store={store} totalProducts={totalProducts} />
      <StoreDetailMetaBar
        storeName={store.name ?? slug}
        returnPolicy={store.returnPolicy}
        shippingInfo={store.shippingInfo}
      />
      <section className='pt-2 pb-12'>
        <div className={sectionContainerClass}>
          <StoreToolbar />
          <ActiveFilters />
          <div className='flex gap-8'>
            <aside className='hidden w-64 shrink-0 lg:block'>
              <div className='sticky top-24'>
                <h2 className='mb-4 flex items-center gap-2 font-semibold'>
                  <IconFilter className='h-4 w-4' />
                  {t('toolbar.filtersHeading')}
                </h2>
                <StoreFilterSidebar
                  storeCategories={store.categories}
                  apiProducts={sidebarProducts}
                  totalProducts={totalProducts}
                />
              </div>
            </aside>
            <div className='flex-1'>
              {productsError && !hasLoadedProducts ? (
                <div className='border-border bg-muted/20 flex flex-col items-center justify-center gap-4 rounded-2xl border py-20 text-center'>
                  <p className='text-muted-foreground'>{t('results.loadFailed')}</p>
                  <Button
                    variant='outline'
                    onClick={() => refetchProducts()}
                    className='gap-2 rounded-full'
                  >
                    <IconRefresh className='h-4 w-4' />
                    {t('results.retry')}
                  </Button>
                </div>
              ) : isInitialProductsLoading ? (
                <StoreProductsGridSkeleton />
              ) : (
                <StoreProductsInfiniteGrid
                  apiProducts={apiProducts}
                  totalProducts={totalProducts}
                  hasNextPage={Boolean(hasNextPage)}
                  isFetchingNextPage={isFetchingNextPage}
                  onLoadMore={handleLoadMore}
                />
              )}
              {isRefetchingProducts && hasLoadedProducts && (
                <p className='text-gold mt-4 text-center text-xs'>{t('updatingProducts')}</p>
              )}
            </div>
          </div>

          <StoreReviewsSection slug={slug} storeName={store.name ?? slug} />
        </div>
      </section>

      <AppDialog
        title={t('toolbar.filtersDialogTitle')}
        component='sheet'
        onOpenChange={toggleFilterMobileSheet}
        open={filterMobileSheetOpen}
      >
        <div className='mt-6 px-4'>
          <StoreFilterSidebar
            storeCategories={store.categories}
            apiProducts={sidebarProducts}
            totalProducts={totalProducts}
          />
        </div>
      </AppDialog>
    </>
  );
}
