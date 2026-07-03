'use client';

import { IconClock, IconFilter2 } from '@tabler/icons-react';
import { keepPreviousData, useQueries } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductGridSkeleton } from '@/domains/home/components/product-grid-skeleton';
import { ProductCard } from '@/domains/shop/components/product-card';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { cn } from '@/lib/utils';
import { useGetCategories } from '@/services/-categories-get';
import { getGetProductsIdQueryOptions } from '@/services/-products-{id}-get';
import { useGetSearch } from '@/services/-search-get';

import { SearchActiveFilters } from './components/search-active-filters';
import { SearchFilterContent } from './components/search-filter-content';
import { SearchIntentBanner } from './components/search-intent-banner';
import { SearchPageSkeleton } from './components/search-page-skeleton';
import { SearchVisualBanner } from './components/search-visual-banner';
import { ProductGridList } from './containers/product-grid-list';
import { ResultHeader } from './containers/result-header';
import { SearchHero } from './containers/search-hero';
import { useSearchParams } from './hooks/useSearchParams';
import { useSearchStore } from './search.store';
import { buildSearchQueryParams } from './search.utils';

export default function SearchDomain() {
  const t = useTranslations('search');
  const { formatInteger } = useLocaleFormatters();
  const searchParams = useSearchParams();
  const searchStore = useSearchStore();

  const { data: categoriesData } = useGetCategories({ limit: 100 });
  const categoriesList = categoriesData?.data?.categories || [];
  const categoryId = searchParams.categories[0]
    ? categoriesList.find((c) => c.name === searchParams.categories[0])?.id
    : undefined;
  const categorySlug = searchParams.categories[0]
    ? categoriesList.find((c) => c.name === searchParams.categories[0])?.slug
    : undefined;

  const {
    page,
    perPage,
    query,
    categories: selectedCategories,
    stores: selectedStores,
    sortBy,
    priceRange,
    minRating,
    inStock,
    onSale,
    isNew,
    isDigital
  } = searchParams;

  const searchQueryParams = useMemo(
    () =>
      buildSearchQueryParams(
        {
          query,
          page,
          perPage,
          categories: selectedCategories,
          stores: selectedStores,
          sortBy,
          priceRange,
          minRating,
          inStock,
          onSale,
          isNew,
          isDigital
        },
        { id: categoryId, slug: categorySlug }
      ),
    [
      page,
      perPage,
      query,
      selectedCategories,
      selectedStores,
      sortBy,
      priceRange,
      minRating,
      inStock,
      onSale,
      isNew,
      isDigital,
      categoryId,
      categorySlug
    ]
  );

  const {
    data: searchData,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetSearch(searchQueryParams, {
    query: { placeholderData: keepPreviousData }
  });

  const products = searchData?.data?.products || [];
  const total = searchData?.data?.total || 0;
  const stores = searchData?.data?.stores || [];
  const categories = searchData?.data?.categories || [];

  const recentlyViewedIds = searchStore.recentlyViewedProducts.slice(0, 6);
  const recentlyViewedQueries = useQueries({
    queries: recentlyViewedIds.map((id) => getGetProductsIdQueryOptions(String(id)))
  });
  const recentlyViewedProducts = recentlyViewedQueries
    .map((query) => query.data?.data)
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  const isInitialLoading = isLoading && !searchData;
  const isPageLoading = isFetching && Boolean(searchData);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams.page]);

  if (isInitialLoading) {
    return <SearchPageSkeleton productCount={searchParams.perPage} />;
  }

  if (error) {
    return (
      <>
        <SearchHero />
        <div className='py-20 text-center'>
          <p className='text-destructive'>{t('error.loadFailed')}</p>
          <Button variant='outline' className='mt-4' onClick={() => refetch()}>
            {t('error.retry')}
          </Button>
        </div>
      </>
    );
  }

  return (
    <div id='search-domain' className='md:px8 px-4'>
      <SearchHero />
      <section className='py-8'>
        <div className='flex flex-col gap-8 lg:flex-row'>
          <aside className='hidden w-72 shrink-0 lg:block'>
            <div className='bg-card sticky top-24 rounded-2xl border p-6'>
              <h2 className='mb-4 flex items-center gap-2 font-semibold'>
                <IconFilter2 className='h-4 w-4' />
                {t('filters.title')}
                {searchParams.activeFilterCount > 0 ? (
                  <Badge variant='secondary' className='ms-auto tabular-nums'>
                    {formatInteger(searchParams.activeFilterCount)}
                  </Badge>
                ) : null}
              </h2>
              <SearchFilterContent categories={categories} stores={stores} products={products} />
            </div>
          </aside>

          <div className='flex-1'>
            <SearchIntentBanner />
            <SearchVisualBanner />
            <ResultHeader
              productCount={products.length}
              total={total}
              stores={stores}
              products={products}
              categories={categories}
            />
            {searchParams.hasActiveFilters && <SearchActiveFilters stores={stores} />}
            <div className={cn('relative', isPageLoading && 'pointer-events-none opacity-60')}>
              {isPageLoading && products.length === 0 ? (
                <ProductGridSkeleton count={searchParams.perPage} columns={4} />
              ) : (
                <ProductGridList products={products} total={total} />
              )}
              {isPageLoading && products.length > 0 ? (
                <div className='bg-background/40 absolute inset-0 flex items-start justify-center pt-24 backdrop-blur-[1px]'>
                  <ProductGridSkeleton count={Math.min(searchParams.perPage, 4)} columns={4} />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {recentlyViewedProducts.length > 0 && (
          <section className='mt-16 border-t pt-8'>
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='flex items-center gap-2 text-xl font-semibold'>
                <IconClock className='h-5 w-5' />
                {t('recentlyViewed.title')}
              </h2>
              <Button variant='ghost' size='sm' onClick={searchStore.clearRecentlyViewedProducts}>
                {t('recentlyViewed.clear')}
              </Button>
            </div>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6'>
              {recentlyViewedProducts.map((product, index) => (
                <ProductCard
                  key={product?.product?.id}
                  product={{ ...product.product, is_liked: product.is_liked ?? false }}
                  index={index}
                />
              ))}
            </div>
          </section>
        )}
      </section>
    </div>
  );
}
