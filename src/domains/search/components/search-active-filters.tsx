'use client';

import { IconX } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { DtoStoreResponse } from '~/src/services/-stores-get.schemas';

import { useSearchParams } from '../hooks/useSearchParams';

interface SearchActiveFiltersProps {
  stores?: DtoStoreResponse[];
}

export function SearchActiveFilters({ stores = [] }: SearchActiveFiltersProps) {
  const searchParams = useSearchParams();

  const getStoreName = (storeId: string) =>
    stores.find((store) => store.id?.toString() === storeId)?.name ?? `Store ${storeId}`;

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

      {searchParams.stores.map((storeId) => (
        <Badge
          key={storeId}
          variant='secondary'
          className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
          onClick={() => searchParams.toggleStore(storeId)}
        >
          {getStoreName(storeId)}
          <IconX className='ml-1 h-3 w-3' />
        </Badge>
      ))}

      {(searchParams.priceRange[0] > 0 || searchParams.priceRange[1] < 1000) && (
        <Badge
          variant='secondary'
          className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
          onClick={() => searchParams.setPriceRange([0, 1000])}
        >
          ${searchParams.priceRange[0]} – ${searchParams.priceRange[1]}
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

      {searchParams.inStock && (
        <Badge
          variant='secondary'
          className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
          onClick={() => searchParams.setInStock(false)}
        >
          In Stock
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
