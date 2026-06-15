'use client';

import { IconFilter2 } from '@tabler/icons-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import type { DtoCategoryResponse, DtoProductResponse } from '@/services/-search-get.schemas';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';
import type { DtoStoreResponse } from '@/services/-stores-get.schemas';

import { useSearchParams } from '../hooks/useSearchParams';
import { SearchFilterContent } from './search-filter-content';

interface SearchMobileFilterSheetProps {
  total: number;
  products: DtoProductWithLike[] | DtoProductResponse[];
  stores: DtoStoreResponse[];
  categories?: DtoCategoryResponse[];
}

/** Mobile-first filter drawer — bottom sheet with scroll body and sticky apply footer. */
export function SearchMobileFilterSheet({
  total,
  products,
  stores,
  categories
}: SearchMobileFilterSheetProps) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  const resultsLabel =
    total === 0
      ? 'No results'
      : `Show ${total} result${total === 1 ? '' : 's'}`;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant='outline' size='sm' className='h-10 flex-1 rounded-full lg:hidden'>
          <IconFilter2 className='mr-2 h-4 w-4 shrink-0' />
          Filters
          {searchParams.activeFilterCount > 0 && (
            <Badge variant='secondary' className='ml-2 tabular-nums'>
              {searchParams.activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side='bottom'
        className='flex h-[92dvh] max-h-[92dvh] flex-col gap-0 rounded-t-3xl border-t p-0 sm:max-w-none'
      >
        <div className='flex shrink-0 justify-center pt-3 pb-1' aria-hidden>
          <div className='bg-muted-foreground/25 h-1.5 w-12 rounded-full' />
        </div>

        <SheetHeader className='border-border shrink-0 border-b px-6 py-4 text-left'>
          <div className='flex items-start justify-between gap-3 pr-8'>
            <div className='space-y-1'>
              <SheetTitle className='font-display text-xl'>Filters</SheetTitle>
              <SheetDescription>
                {searchParams.activeFilterCount > 0
                  ? `${searchParams.activeFilterCount} filter${searchParams.activeFilterCount === 1 ? '' : 's'} applied`
                  : 'Refine products by category, price, and more'}
              </SheetDescription>
            </div>
            {searchParams.hasActiveFilters && (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='text-muted-foreground shrink-0'
                onClick={() => searchParams.clearFilters()}
              >
                Reset
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5'>
          <SearchFilterContent
            variant='sheet'
            categories={categories}
            stores={stores}
            products={products}
          />
        </div>

        <SheetFooter className='border-border bg-background/95 shrink-0 gap-2 border-t px-6 py-4 backdrop-blur-sm'>
          {searchParams.hasActiveFilters && (
            <Button
              type='button'
              variant='outline'
              className='w-full rounded-full'
              onClick={() => searchParams.clearFilters()}
            >
              Clear all filters
            </Button>
          )}
          <SheetClose asChild>
            <Button type='button' className='h-11 w-full rounded-full'>
              {resultsLabel}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
