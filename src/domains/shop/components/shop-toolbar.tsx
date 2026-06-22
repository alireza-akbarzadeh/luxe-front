'use client';

import {
  IconArrowsHorizontal,
  IconLayoutGrid,
  IconLayoutGridRemove,
  IconLoader2,
  IconSearch
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className='border-border mb-8 flex flex-col items-start justify-between gap-4 border-b pb-8 sm:flex-row sm:items-center'
    >
      <div className='flex w-full items-center gap-4 sm:w-auto'>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='outline' className='gap-2 lg:hidden'>
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
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>

        <div className='relative min-w-0 flex-1 sm:w-72 sm:flex-initial'>
          <IconSearch className='text-muted-foreground absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2' />
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='ps-10'
          />
        </div>
      </div>

      <div className='flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end'>
        <span
          className={cn(
            'text-muted-foreground flex items-center gap-2 text-sm tabular-nums',
            isFetching && 'opacity-70'
          )}
        >
          {isFetching && <IconLoader2 className='h-3.5 w-3.5 animate-spin' />}
          {resultsLabel}
        </span>

        <div className='flex items-center gap-3'>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className='w-40 gap-2 sm:w-44'>
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

          <div className='border-border hidden items-center gap-1 rounded-lg border p-1 md:flex'>
            <Button
              variant={gridCols === 3 ? 'secondary' : 'ghost'}
              size='icon'
              className='h-8 w-8'
              onClick={() => setGridCols(3)}
              aria-label={t('grid3')}
            >
              <IconLayoutGridRemove className='h-4 w-4' />
            </Button>
            <Button
              variant={gridCols === 4 ? 'secondary' : 'ghost'}
              size='icon'
              className='h-8 w-8'
              onClick={() => setGridCols(4)}
              aria-label={t('grid4')}
            >
              <IconLayoutGrid className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <p className='text-muted-foreground w-full text-xs sm:hidden'>
          {t('filtersActive', { count: activeFilterCount })}
        </p>
      )}
    </motion.div>
  );
}
