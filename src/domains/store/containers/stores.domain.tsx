'use client';
import { useMemo } from 'react';

import { SortDropdown } from '@/domains/store/components/sort-dropdown';
import { StoresGridSkeleton } from '@/domains/store/components/store-cart-skeleton';
import { EmptyState } from '@/domains/store/components/store-empty-state';
import { StorePagination } from '@/domains/store/components/store-pagination';
import { ViewModeToggle } from '@/domains/store/components/view-mode-toggle';
import { PAGE_SIZE } from '@/domains/store/constants';
import { useStoresFilters } from '@/domains/store/hooks/useStoresFilter';
import { FeaturedCarousel } from '@/domains/store/sections/featured-carousel';
import { FilterSidebar } from '@/domains/store/sections/filter-sidebar';
import { StoreHeroSection } from '@/domains/store/sections/hero-section';
import { MobileFilterSheet } from '@/domains/store/sections/mobile-filter-sheet';
import { StoresVirtualList } from '@/domains/store/sections/store-virtual-list';
import { StoresGrid } from '@/domains/store/sections/stores-grid';
import { useGetStores } from '@/services/-stores-get';

export function StoresDomain() {
  const { filters } = useStoresFilters();

  const queryParams = useMemo(
    () => ({
      limit: PAGE_SIZE,
      offset: (filters.page - 1) * PAGE_SIZE,
      search: filters.search || undefined,
      category: filters.category.length ? filters.category : undefined,
      rating: filters.rating || undefined,
      verified: filters.verified || undefined,
      location: filters.location || undefined,
      sort: filters.sort
    }),
    [filters]
  );
  const { data, isLoading, isError, isFetching } = useGetStores(queryParams);

  const stores = data?.data?.stores ?? [];
  const total = data?.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className='pb-20'>
      <StoreHeroSection />
      <div className='mx-auto max-w-screen-2xl px-4 lg:px-8'>
        <div className='grid gap-8 py-8 lg:grid-cols-[280px_1fr]'>
          <FilterSidebar />
          <div className='min-w-0 space-y-8'>
            {stores.length > 0 && <FeaturedCarousel stores={stores} title='Trending this week' />}
            <div className='bg-background/70 border-border sticky top-16 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 backdrop-blur'>
              <div className='flex items-center gap-2'>
                <MobileFilterSheet />
                <p className='text-muted-foreground text-sm'>
                  <span className='text-foreground font-medium'>{total.toLocaleString()}</span>{' '}
                  stores
                  {isFetching && <span className='ml-2 text-xs'>updating…</span>}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <SortDropdown />
                <ViewModeToggle />
              </div>
            </div>
            {isLoading && <StoresGridSkeleton />}
            {!isLoading && !isError && stores.length === 0 && <EmptyState />}{' '}
            {!isLoading && !isError && stores.length === 0 && <EmptyState />}
            {!isLoading && !isError && stores.length > 0 && (
              <>
                {filters.view === 'grid' && <StoresGrid stores={stores} />}
                {filters.view === 'compact' && <StoresGrid stores={stores} dense />}
                {filters.view === 'list' && <StoresVirtualList stores={stores} />}
              </>
            )}
            {totalPages > 1 && <StorePagination page={filters.page} totalPages={totalPages} />}
          </div>
        </div>
      </div>
    </main>
  );
}
