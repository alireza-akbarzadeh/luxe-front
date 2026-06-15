'use client';

import { IconGridDots, IconList } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { type SortBy } from '@/domains/search/hooks/useSearchParams';
import type { DtoCategoryResponse, DtoProductWithLike } from '@/services/-products-get.schemas';
import type { DtoStoreResponse } from '@/services/-stores-get.schemas';

import { SearchMobileFilterSheet } from '../components/search-mobile-filter-sheet';
import { useSearchParams } from '../hooks/useSearchParams';

const sortOptions = [
  { label: 'Most Relevant', value: 'relevance' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Most Popular', value: 'popular' }
];

interface ResultHeaderProps {
  productCount: number;
  total: number;
  products: DtoProductWithLike[];
  stores: DtoStoreResponse[];
  categories?: DtoCategoryResponse[];
}

export function ResultHeader(props: ResultHeaderProps) {
  const { productCount, total, products, stores, categories } = props;
  const searchParams = useSearchParams();
  const resultLabel =
    total > 0
      ? `${total} product${total === 1 ? '' : 's'} found`
      : `${productCount} product${productCount === 1 ? '' : 's'} found`;

  return (
    <div className='mb-6 space-y-4'>
      <div>
        <h2 className='font-display text-lg font-semibold md:text-xl'>
          {searchParams.query ? <>Results for &quot;{searchParams.query}&quot;</> : 'All Products'}
        </h2>
        <p className='text-muted-foreground mt-1 text-sm'>{resultLabel}</p>
      </div>

      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex min-w-0 items-center gap-2 lg:hidden'>
          <SearchMobileFilterSheet
            total={total}
            products={products}
            stores={stores}
            categories={categories}
          />
          <Select
            value={searchParams.sortBy}
            onValueChange={(value: SortBy) => searchParams.setSortBy(value)}
          >
            <SelectTrigger className='h-10 min-w-0 flex-1 rounded-full'>
              <SelectValue placeholder='Sort by' />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='hidden items-center gap-2 lg:flex'>
          <Select
            value={searchParams.sortBy}
            onValueChange={(value: SortBy) => searchParams.setSortBy(value)}
          >
            <SelectTrigger className='w-44'>
              <SelectValue placeholder='Sort by' />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className='flex items-center rounded-lg border p-1'>
            <Button
              variant={searchParams.view === 'grid' ? 'secondary' : 'ghost'}
              size='icon'
              className='h-8 w-8'
              onClick={() => searchParams.setView('grid')}
              aria-label='Grid view'
            >
              <IconGridDots className='h-4 w-4' />
            </Button>
            <Button
              variant={searchParams.view === 'list' ? 'secondary' : 'ghost'}
              size='icon'
              className='h-8 w-8'
              onClick={() => searchParams.setView('list')}
              aria-label='List view'
            >
              <IconList className='h-4 w-4' />
            </Button>
          </div>
        </div>

        <div className='flex items-center gap-2 sm:hidden'>
          <div className='border-border flex flex-1 items-center justify-center rounded-full border p-1'>
            <Button
              variant={searchParams.view === 'grid' ? 'secondary' : 'ghost'}
              size='icon'
              className='h-8 w-8 rounded-full'
              onClick={() => searchParams.setView('grid')}
              aria-label='Grid view'
            >
              <IconGridDots className='h-4 w-4' />
            </Button>
            <Button
              variant={searchParams.view === 'list' ? 'secondary' : 'ghost'}
              size='icon'
              className='h-8 w-8 rounded-full'
              onClick={() => searchParams.setView('list')}
              aria-label='List view'
            >
              <IconList className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
