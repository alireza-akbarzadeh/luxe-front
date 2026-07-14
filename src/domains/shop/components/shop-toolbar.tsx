'use client';

import {
  IconArrowsHorizontal,
  IconLayoutGrid,
  IconLayoutGridRemove,
  IconLoader2,
  IconSearch,
  IconX
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

import { useProductFilters } from '../useProductFilters';
import { FilterContent } from './filter-content';

const SHOP_SORT_OPTIONS = [
  { value: 'featured', labelKey: 'featured' },
  { value: 'popular', labelKey: 'popular' },
  { value: 'best-selling', labelKey: 'bestSelling' },
  { value: 'newest', labelKey: 'newest' },
  { value: 'price-asc', labelKey: 'priceAsc' },
  { value: 'price-desc', labelKey: 'priceDesc' },
  { value: 'rating', labelKey: 'rating' }
] as const;

interface ShopToolbarProps {
  total: number;
  rangeStart: number;
  rangeEnd: number;
  isFetching?: boolean;
}

export function ShopToolbar(props: ShopToolbarProps) {
  const { total, rangeStart, rangeEnd, isFetching = false } = props;
  const t = useTranslations('shop.toolbar');
  const tSort = useTranslations('shop.sort');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const {
    sortBy,
    searchQuery,
    gridCols,
    setSortBy,
    setSearchQuery,
    setGridCols,
    hasActiveFilters,
    activeFilterCount
  } = useProductFilters();

  const resultsLabel =
    total === 0
      ? t('noProducts')
      : total <= rangeEnd - rangeStart + 1
        ? t('productCount', { count: total })
        : t('resultsRange', { start: rangeStart, end: rangeEnd, total });

  const handleClearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className='border-border mb-8 space-y-5 border-b pb-8'
    >
      <div
        className={cn(
          'bg-background focus-within:border-primary focus-within:ring-primary/15 relative flex w-full items-center rounded-full border-2 shadow-sm transition-[border-color,box-shadow] focus-within:ring-[3px]',
          searchQuery ? 'border-primary/40' : 'border-border hover:border-primary/25'
        )}
      >
        <IconSearch
          className='text-muted-foreground pointer-events-none absolute start-4 h-5 w-5 shrink-0'
          aria-hidden
        />
        <Input
          ref={searchInputRef}
          type='text'
          enterKeyHint='search'
          autoComplete='off'
          autoCorrect='off'
          spellCheck={false}
          placeholder={t('searchPlaceholder')}
          aria-label={t('searchAriaLabel')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='h-12 border-0 bg-transparent ps-12 pe-12 text-base shadow-none focus-visible:ring-0 md:h-14 md:text-base [&::-webkit-search-cancel-button]:hidden'
        />
        {searchQuery ? (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='text-muted-foreground hover:text-foreground absolute end-2 h-9 w-9 shrink-0 rounded-full'
            aria-label={t('clearSearch')}
            onClick={handleClearSearch}
          >
            <IconX className='h-4 w-4' />
          </Button>
        ) : null}
      </div>

      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div className='flex w-full items-center gap-3 sm:w-auto'>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='outline' className='h-10 gap-2 rounded-full lg:hidden'>
                <IconArrowsHorizontal className='h-4 w-4' />
                {t('filters')}
                {activeFilterCount > 0 && (
                  <span className='bg-accent text-accent-foreground ms-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold tabular-nums'>
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-80 overflow-y-auto'>
              <SheetHeader>
                <SheetTitle>{t('filters')}</SheetTitle>
              </SheetHeader>
              <div className='mt-6 pb-8'>
                <FilterContent variant='sheet' />
              </div>
            </SheetContent>
          </Sheet>

          <span
            className={cn(
              'text-muted-foreground flex items-center gap-2 text-sm tabular-nums',
              isFetching && 'opacity-70'
            )}
          >
            {isFetching && <IconLoader2 className='h-3.5 w-3.5 animate-spin' />}
            {resultsLabel}
          </span>
        </div>

        <div className='flex w-full items-center justify-end gap-3 sm:w-auto'>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
            <SelectTrigger className='h-10 w-full gap-2 rounded-full sm:w-44'>
              <SelectValue placeholder={t('sortBy')} />
            </SelectTrigger>
            <SelectContent>
              {SHOP_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {tSort(option.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className='border-border hidden items-center gap-1 rounded-full border p-1 md:flex'>
            <Button
              variant={gridCols === 3 ? 'secondary' : 'ghost'}
              size='icon'
              className='h-8 w-8 rounded-full'
              onClick={() => setGridCols(3)}
              aria-label={t('grid3')}
            >
              <IconLayoutGridRemove className='h-4 w-4' />
            </Button>
            <Button
              variant={gridCols === 4 ? 'secondary' : 'ghost'}
              size='icon'
              className='h-8 w-8 rounded-full'
              onClick={() => setGridCols(4)}
              aria-label={t('grid4')}
            >
              <IconLayoutGrid className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <p className='text-muted-foreground -mt-2 text-xs sm:hidden'>
          {t('filtersActive', { count: activeFilterCount })}
        </p>
      )}
    </motion.div>
  );
}
