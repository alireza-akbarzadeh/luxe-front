'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/domains/shop/components/product-card';
import { useMemo } from 'react';

import { IconClock, IconFilter2 } from '@tabler/icons-react';
import { products } from '../store/data';
import { SearchActiveFilters } from './components/search-active-filters';
import { SearchFilterContent } from './components/search-filter-content';
import { ProductGridList } from './containers/product-grid-list';
import { SearchHero } from './containers/search-hero';
import { useSearchParams } from './hooks/useSearchParams';
import { useSearchStore } from './search.store';
import { ResultHeader } from './containers/result-header';

export default function SearchDomain() {
  const searchParams = useSearchParams();
  const searchStore = useSearchStore();

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (searchParams.query) {
      const q = searchParams.query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (searchParams.categories.length > 0) {
      result = result.filter((p) =>
        searchParams.categories.some((c) => p.category.toLowerCase() === c.toLowerCase())
      );
    }

    // Store filter
    if (searchParams.stores.length > 0) {
      result = result.filter((p) => searchParams.stores.includes(p.storeId));
    }

    // Price range
    result = result.filter(
      (p) => p.price >= searchParams.priceRange[0] && p.price <= searchParams.priceRange[1]
    );

    // Rating filter
    if (searchParams.minRating > 0) {
      result = result.filter((p) => p.rating >= searchParams.minRating);
    }

    // On sale
    if (searchParams.onSale) {
      result = result.filter((p) => p.originalPrice && p.originalPrice > p.price);
    }

    // New arrivals
    if (searchParams.isNew) {
      result = result.filter((p) => p.isNew);
    }

    // Digital products
    if (searchParams.isDigital) {
      result = result.filter((p) => p.isDigital);
    }

    // Sort
    switch (searchParams.sortBy) {
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        result.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        // relevance - keep original order or sort by match quality
        if (searchParams.query) {
          const q = searchParams.query.toLowerCase();
          result.sort((a, b) => {
            const aNameMatch = a.name.toLowerCase().startsWith(q)
              ? 2
              : a.name.toLowerCase().includes(q)
                ? 1
                : 0;
            const bNameMatch = b.name.toLowerCase().startsWith(q)
              ? 2
              : b.name.toLowerCase().includes(q)
                ? 1
                : 0;
            return bNameMatch - aNameMatch;
          });
        }
    }

    return result;
  }, [searchParams]);

  // Recently viewed products
  const recentlyViewedProducts = products.filter((p) =>
    searchStore.recentlyViewedProducts.includes(p.id)
  );

  return (
    <>
      {/* Search Hero */}
      <SearchHero filteredProducts={filteredProducts} />
      {/* Results Section */}
      <section className='mx-auto max-w-7xl px-4 py-8'>
        <div className='flex flex-col gap-8 lg:flex-row'>
          {/* Desktop Filters Sidebar */}
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
              <SearchFilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className='flex-1'>
            {/* Results Header */}
            <ResultHeader productCount={filteredProducts.length} />
            {/* Active Filters */}
            {searchParams.hasActiveFilters && <SearchActiveFilters />}

            {/* Products Grid/List */}
            <ProductGridList filteredProducts={filteredProducts} />
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
