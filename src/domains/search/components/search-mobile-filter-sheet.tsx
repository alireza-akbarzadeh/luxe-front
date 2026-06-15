'use client';

import { IconFilter2 } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';
import type { DtoCategoryResponse, DtoProductResponse } from '@/services/-search-get.schemas';
import type { DtoStoreResponse } from '@/services/-stores-get.schemas';

import { useSearchFilterDraft } from '../hooks/useSearchFilterDraft';
import { useSearchParams } from '../hooks/useSearchParams';
import { useSearchStore } from '../search.store';
import { SearchFilterContent } from './search-filter-content';

const sheetCloseButtonClass = '[&>button.absolute]:hidden';

interface SearchMobileFilterSheetProps {
  products: DtoProductWithLike[] | DtoProductResponse[];
  stores: DtoStoreResponse[];
  categories?: DtoCategoryResponse[];
}

/** Mobile filter drawer — draft filters apply only when the user taps Apply. */
export function SearchMobileFilterSheet({
  products,
  stores,
  categories
}: SearchMobileFilterSheetProps) {
  const searchParams = useSearchParams();
  const isOpen = useSearchStore((state) => state.isFilterSheetOpen);
  const setFilterSheetOpen = useSearchStore((state) => state.setFilterSheetOpen);
  const closeFilterSheet = useSearchStore((state) => state.closeFilterSheet);
  const { draft, actions, syncFromUrl, resetDraft, draftFilterCount, hasDraftFilters } =
    useSearchFilterDraft(searchParams);

  const handleOpenChange = (open: boolean) => {
    setFilterSheetOpen(open);
    if (open) {
      syncFromUrl();
    }
  };

  const handleApply = () => {
    searchParams.applyFilters(draft);
    closeFilterSheet();
  };

  const appliedCount = searchParams.activeFilterCount;

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant='outline' size='sm' className='h-10 flex-1 rounded-full lg:hidden'>
          <IconFilter2 className='mr-2 h-4 w-4 shrink-0' />
          Filters
          {appliedCount > 0 && (
            <Badge variant='secondary' className='ml-2 tabular-nums'>
              {appliedCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side='bottom'
        className={`flex h-[92dvh] max-h-[92dvh] flex-col gap-0 rounded-t-3xl border-t p-0 sm:max-w-none ${sheetCloseButtonClass}`}
      >
        <div className='flex shrink-0 justify-center pt-3 pb-1' aria-hidden>
          <div className='bg-muted-foreground/25 h-1.5 w-12 rounded-full' />
        </div>

        <SheetHeader className='border-border shrink-0 border-b px-6 py-4 text-left'>
          <div className='flex items-start justify-between gap-3'>
            <div className='space-y-1'>
              <SheetTitle className='font-display text-xl'>Filters</SheetTitle>
              <SheetDescription>
                {hasDraftFilters
                  ? `${draftFilterCount} selected · tap Apply when ready`
                  : 'Refine products by category, price, and more'}
              </SheetDescription>
            </div>
            {hasDraftFilters && (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='text-muted-foreground shrink-0'
                onClick={resetDraft}
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
            draft={draft}
            draftActions={actions}
          />
        </div>

        <SheetFooter className='border-border bg-background/95 shrink-0 gap-2 border-t px-6 py-4 backdrop-blur-sm pb-[max(1rem,env(safe-area-inset-bottom))]'>
          {hasDraftFilters && (
            <Button
              type='button'
              variant='outline'
              className='w-full rounded-full'
              onClick={resetDraft}
            >
              Clear selection
            </Button>
          )}
          <Button type='button' className='h-11 w-full rounded-full' onClick={handleApply}>
            Apply filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
