'use client';

import { IconRefresh } from '@tabler/icons-react';
import { useCallback, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { SortDropdown } from '@/domains/store/components/sort-dropdown';
import { StoresGridSkeleton } from '@/domains/store/components/store-cart-skeleton';
import { EmptyState } from '@/domains/store/components/store-empty-state';
import { StoresInfiniteSection } from '@/domains/store/components/stores-infinite-section';
import { ViewModeToggle } from '@/domains/store/components/view-mode-toggle';
import { useInfiniteStores } from '@/domains/store/hooks/useInfiniteStores';
import { useStoresFilters } from '@/domains/store/hooks/useStoresFilter';
import {
  flattenInfiniteStores,
  getInfiniteStoresTotal,
  toStoresCatalogParams
} from '@/domains/store/lib/stores.utils';
import { FeaturedCarousel } from '@/domains/store/sections/featured-carousel';
import { FilterSidebar } from '@/domains/store/sections/filter-sidebar';
import { StoreHeroSection } from '@/domains/store/sections/hero-section';
import { MobileFilterSheet } from '@/domains/store/sections/mobile-filter-sheet';

export function StoresDomain() {
  const { filters } = useStoresFilters();
  const catalogParams = useMemo(() => toStoresCatalogParams(filters), [filters]);

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useInfiniteStores(catalogParams);

  const stores = useMemo(() => flattenInfiniteStores(data?.pages ?? []), [data?.pages]);
  const total = getInfiniteStoresTotal(data?.pages);
  const loadedCount = stores.length;
  const hasLoadedStores = loadedCount > 0;
  const isInitialLoading = isLoading && !hasLoadedStores;
  const isRefetching = isFetching && !isFetchingNextPage && !isInitialLoading;

  const featuredStores = useMemo(() => data?.pages[0]?.data?.stores ?? [], [data?.pages]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className='pb-20'>
      <StoreHeroSection />
      <div className='mx-auto max-w-screen-2xl px-4 lg:px-8'>
        <div className='grid gap-8 py-8 lg:grid-cols-[280px_1fr]'>
          <FilterSidebar />
          <div className='min-w-0 space-y-8'>
            {featuredStores.length > 0 && (
              <FeaturedCarousel stores={featuredStores} title='Trending this week' />
            )}
            <div className='border-gold/15 bg-background/70 sticky top-16 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 backdrop-blur'>
              <div className='flex items-center gap-2'>
                <MobileFilterSheet />
                <p className='text-muted-foreground text-sm'>
                  <span className='text-foreground font-medium'>
                    {total.toLocaleString('en-US')}
                  </span>{' '}
                  stores
                  {loadedCount > 0 && loadedCount < total && (
                    <span className='text-muted-foreground'>
                      {' '}
                      · {loadedCount.toLocaleString('en-US')} loaded
                    </span>
                  )}
                  {isRefetching && <span className='text-gold ml-2 text-xs'>updating…</span>}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <SortDropdown />
                <ViewModeToggle />
              </div>
            </div>

            {isError && !hasLoadedStores ? (
              <div className='border-border bg-muted/20 flex flex-col items-center justify-center gap-4 rounded-2xl border py-20 text-center'>
                <p className='text-muted-foreground'>Could not load stores. Please try again.</p>
                <Button variant='outline' onClick={() => refetch()} className='gap-2 rounded-full'>
                  <IconRefresh className='h-4 w-4' />
                  Retry
                </Button>
              </div>
            ) : isInitialLoading ? (
              <StoresGridSkeleton />
            ) : stores.length === 0 ? (
              <EmptyState />
            ) : (
              <StoresInfiniteSection
                stores={stores}
                total={total}
                view={filters.view}
                hasNextPage={Boolean(hasNextPage)}
                isFetchingNextPage={isFetchingNextPage}
                onLoadMore={handleLoadMore}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
