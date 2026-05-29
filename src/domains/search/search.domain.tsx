'use client';

import { IconClock, IconFilter2, IconLoader2 } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/domains/shop/components/product-card';
import { mapSortToAPI } from '~/src/domains/search/search.utils';
import { useGetCategories } from '~/src/services/-categories-get';
import { useGetSearch } from '~/src/services/-search-get';
import type { GetSearchParams } from '~/src/services/-search-get.schemas';

import { SearchActiveFilters } from './components/search-active-filters';
import { SearchFilterContent } from './components/search-filter-content';
import { ProductGridList } from './containers/product-grid-list';
import { ResultHeader } from './containers/result-header';
import { SearchHero } from './containers/search-hero';
import { useSearchParams } from './hooks/useSearchParams';
import { useSearchStore } from './search.store';

export default function SearchDomain() {
  const searchParams = useSearchParams();
  const searchStore = useSearchStore();

  const { data: categoriesData } = useGetCategories({ limit: 100 });
  const categoriesList = categoriesData?.data?.categories || [];
  const category = searchParams.categories[0]
    ? categoriesList.find((c) => c.name === searchParams.categories[0])
    : undefined;

  const searchQueryParams: GetSearchParams = {
    q: searchParams.query,
    limit: searchParams.perPage,
    offset: (searchParams.page - 1) * searchParams.perPage,
    min_price: searchParams.priceRange[0] > 0 ? searchParams.priceRange[0] : undefined,
    max_price: searchParams.priceRange[1] < 1000 ? searchParams.priceRange[1] : undefined,
    min_rating: searchParams.minRating > 0 ? searchParams.minRating : undefined,
    is_digital: searchParams.isDigital || undefined,
    is_new: searchParams.isNew || undefined,
    sort: mapSortToAPI(searchParams.sortBy),
    category_slug: category?.slug,
    category_id: category?.id
  };

  const { data: searchData, isLoading, error } = useGetSearch(searchQueryParams);

  const products = searchData?.data?.products || [];
  const total = searchData?.data?.total || 0;

  const stores = searchData?.data?.stores || [];
  const categories = searchData?.data?.categories || [];

  // Recently viewed products (client-side only)
  const recentlyViewedProducts = products.filter((p) =>
    searchStore.recentlyViewedProducts.includes(p.id as number)
  );

  if (isLoading) {
    return (
      <div className='flex justify-center py-20'>
        <IconLoader2 className='text-primary h-8 w-8 animate-spin' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='py-20 text-center'>
        <p className='text-destructive'>Failed to load search results. Please try again.</p>
        <Button variant='outline' className='mt-4' onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <SearchHero />
      <section className='py-8'>
        <div className='flex flex-col gap-8 lg:flex-row'>
          {/* Desktop Filters Sidebar – keep but note: filters don't affect search API yet */}
          <aside className='hidden w-64 shrink-0 lg:block'>
            <div className='bg-card sticky top-24 rounded-2xl border p-6'>
              <h2 className='mb-4 flex items-center gap-2 font-semibold'>
                <IconFilter2 className='h-4 w-4' />
                Filters
                {searchParams.activeFilterCount > 0 && (
                  <Badge variant='secondary' className='ml-auto'>
                    {searchParams.activeFilterCount}
                  </Badge>
                )}
              </h2>
              <SearchFilterContent categories={categories} stores={stores} products={products} />
            </div>
          </aside>

          <div className='flex-1'>
            <ResultHeader
              productCount={products.length}
              total={total}
              stores={stores}
              products={products}
              categories={categories}
            />
            {searchParams.hasActiveFilters && <SearchActiveFilters />}
            <ProductGridList products={products} />
          </div>
        </div>

        {/* Recently Viewed */}
        {recentlyViewedProducts.length > 0 && (
          <section className='mt-16 border-t pt-8'>
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='flex items-center gap-2 text-xl font-semibold'>
                <IconClock className='h-5 w-5' />
                Recently Viewed
              </h2>
              <Button variant='ghost' size='sm' onClick={searchStore.clearRecentlyViewedProducts}>
                Clear
              </Button>
            </div>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6'>
              {recentlyViewedProducts.slice(0, 6).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </section>
        )}
      </section>
    </>
  );
}
