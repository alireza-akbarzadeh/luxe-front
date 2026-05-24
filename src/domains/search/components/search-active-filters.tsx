'use client';

import { Badge } from '@/components/ui/badge';
import { useSearchParams } from '../hooks/useSearchParams';
import { IconX } from '@tabler/icons-react';
import { stores } from '../../store/data';
import { Button } from '@/components/ui/button';

export function SearchActiveFilters() {
  const searchParams = useSearchParams();
  return (
    <div className='mb-6 flex flex-wrap items-center gap-2'>
      <span className='text-muted-foreground text-sm'>Active filters:</span>
      {searchParams.categories.map((cat) => (
        <Badge
          key={cat}
          variant='secondary'
          className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
          onClick={() => searchParams.toggleCategory(cat)}
        >
          {cat}
          <IconX className='ml-1 h-3 w-3' />
        </Badge>
      ))}
      {searchParams.stores.map((storeId) => {
        const store = stores.find((s) => s.id === storeId);
        return (
          <Badge
            key={storeId}
            variant='secondary'
            className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
            onClick={() => searchParams.toggleStore(storeId)}
          >
            {store?.name || storeId}
            <IconX className='ml-1 h-3 w-3' />
          </Badge>
        );
      })}
      {(searchParams.priceRange[0] > 0 || searchParams.priceRange[1] < 1000) && (
        <Badge
          variant='secondary'
          className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
          onClick={() => searchParams.setPriceRange([0, 1000])}
        >
          ${searchParams.priceRange[0]} - ${searchParams.priceRange[1]}
          <IconX className='ml-1 h-3 w-3' />
        </Badge>
      )}
      {searchParams.minRating > 0 && (
        <Badge
          variant='secondary'
          className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
          onClick={() => searchParams.setMinRating(0)}
        >
          {searchParams.minRating}+ stars
          <IconX className='ml-1 h-3 w-3' />
        </Badge>
      )}
      {searchParams.onSale && (
        <Badge
          variant='secondary'
          className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
          onClick={() => searchParams.setOnSale(false)}
        >
          On Sale
          <IconX className='ml-1 h-3 w-3' />
        </Badge>
      )}
      {searchParams.isNew && (
        <Badge
          variant='secondary'
          className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
          onClick={() => searchParams.setIsNew(false)}
        >
          New Arrivals
          <IconX className='ml-1 h-3 w-3' />
        </Badge>
      )}
      {searchParams.isDigital && (
        <Badge
          variant='secondary'
          className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
          onClick={() => searchParams.setIsDigital(false)}
        >
          Digital
          <IconX className='ml-1 h-3 w-3' />
        </Badge>
      )}
      <Button
        variant='ghost'
        size='sm'
        className='text-primary'
        onClick={searchParams.clearFilters}
      >
        Clear all
      </Button>
    </div>
  );
}
