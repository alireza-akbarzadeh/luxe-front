'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useSearchParams } from '../hooks/useSearchParams';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { IconFilter2, IconGrid3x3, IconList } from '@tabler/icons-react';
import { Button } from '~/src/components/ui/button';
import { Badge } from '~/src/components/ui/badge';
import { SearchFilterContent } from '../components/search-filter-content';
import type { ProductCardProps } from '../../shop/components/product-card';

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
}

export function ResultHeader(props: ResultHeaderProps) {
  const { productCount } = props;
  const searchParams = useSearchParams();
  return (
    <div className='mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
      <div>
        <h2 className='text-lg font-semibold'>
          {searchParams.query ? <>Results for &quot;{searchParams.query}&quot;</> : 'All Products'}
        </h2>
        <p className='text-muted-foreground text-sm'>{productCount} products found</p>
      </div>

      <div className='flex items-center gap-2'>
        {/* Mobile Filter Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='outline' size='sm' className='lg:hidden'>
              <IconFilter2 className='mr-2 h-4 w-4' />
              Filters
              {searchParams.activeFilterCount > 0 && (
                <Badge variant='secondary' className='ml-2'>
                  {searchParams.activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='w-80'>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className='mt-6'>
              <SearchFilterContent />
            </div>
          </SheetContent>
        </Sheet>

        {/* Sort */}
        <Select value={searchParams.sortBy} onValueChange={(v) => searchParams.setSortBy(v as any)}>
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

        {/* View Mode */}
        <div className='hidden items-center rounded-lg border p-1 sm:flex'>
          <Button
            variant={searchParams.view === 'grid' ? 'secondary' : 'ghost'}
            size='icon'
            className='h-8 w-8'
            onClick={() => searchParams.setView('grid')}
          >
            <IconGrid3x3 className='h-4 w-4' />
          </Button>
          <Button
            variant={searchParams.view === 'list' ? 'secondary' : 'ghost'}
            size='icon'
            className='h-8 w-8'
            onClick={() => searchParams.setView('list')}
          >
            <IconList className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
