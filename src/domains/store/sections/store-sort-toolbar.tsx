'use client';
import {
  IconArrowsUpDown,
  IconFileHorizontal,
  IconGrid3x3,
  IconLayoutGrid,
  IconSearch
} from '@tabler/icons-react';
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
import { STORE_DETAIL_SORT_OPTIONS } from '@/domains/store/lib/store-sort-options';
import { Badge } from '~/src/components/ui/badge';
import { useStoreStore } from '~/src/domains/store/hooks/useStoreStore';

import { type SortBy, useStoreFilters } from '../hooks/useStoreFilter';

export function StoreToolbar() {
  const t = useTranslations('stores.detail.toolbar');
  const tSort = useTranslations('stores.detail.sort');
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    gridCols,
    setGridCols,
    activeFilterCount
  } = useStoreFilters([]);

  const toggleFilterMobileSheet = useStoreStore((state) => state.toggleFilterMobileSheet);

  return (
    <div className='mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
      <div className='relative w-full sm:w-80'>
        <IconSearch className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
        <Input
          type='text'
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='pl-10'
        />
      </div>

      <div className='flex w-full items-center gap-3 sm:w-auto'>
        <Button onClick={toggleFilterMobileSheet} variant='outline' className='gap-2 lg:hidden'>
          <IconFileHorizontal className='h-4 w-4' />
          {t('filters')}
          {activeFilterCount > 0 && (
            <Badge variant='secondary' className='ml-1'>
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
          <SelectTrigger className='w-45'>
            <IconArrowsUpDown className='mr-2 h-4 w-4' />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STORE_DETAIL_SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {tSort(option.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className='border-border hidden items-center rounded-lg border p-1 sm:flex'>
          <Button
            variant={gridCols === 3 ? 'secondary' : 'ghost'}
            size='sm'
            onClick={() => setGridCols(3)}
            className='h-8 w-8 p-0'
          >
            <IconLayoutGrid className='h-4 w-4' />
          </Button>
          <Button
            variant={gridCols === 4 ? 'secondary' : 'ghost'}
            size='sm'
            onClick={() => setGridCols(4)}
            className='h-8 w-8 p-0'
          >
            <IconGrid3x3 className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
