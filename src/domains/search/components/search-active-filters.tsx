'use client';

import { IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { cn } from '@/lib/utils';
import type { DtoStoreResponse } from '~/src/services/-stores-get.schemas';

import { useSearchParams } from '../hooks/useSearchParams';
import {
  isSearchPriceFilterActive,
  SEARCH_DEFAULT_PRICE_MAX,
  SEARCH_DEFAULT_PRICE_MIN
} from '../search.utils';

interface SearchActiveFiltersProps {
  stores?: DtoStoreResponse[];
}

export function SearchActiveFilters({ stores = [] }: SearchActiveFiltersProps) {
  const searchParams = useSearchParams();
  const t = useTranslations('search.filters');
  const { formatPrice, moneyClassName } = useLocaleFormatters();

  const getStoreName = (storeId: string) =>
    stores.find((store) => store.id?.toString() === storeId)?.name ?? t('storeFallback', { id: storeId });

  return (
    <div className='mb-6 flex flex-wrap items-center gap-2'>
      <span className='text-muted-foreground text-sm'>{t('activeLabel')}</span>

      {searchParams.categories.map((cat) => (
        <Badge
          key={cat}
          variant='secondary'
          className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
          onClick={() => searchParams.toggleCategory(cat)}
        >
          {cat}
          <IconX className='ms-1 h-3 w-3' />
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
          <IconX className='ms-1 h-3 w-3' />
        </Badge>
      ))}

      {isSearchPriceFilterActive(searchParams.priceRange) ? (
        <Badge
          variant='secondary'
          className={cn(
            'hover:bg-destructive hover:text-destructive-foreground cursor-pointer tabular-nums',
            moneyClassName
          )}
          onClick={() =>
            searchParams.setPriceRange([SEARCH_DEFAULT_PRICE_MIN, SEARCH_DEFAULT_PRICE_MAX])
          }
        >
          {formatPrice(searchParams.priceRange[0])} – {formatPrice(searchParams.priceRange[1])}
          <IconX className='ms-1 h-3 w-3' />
        </Badge>
      ) : null}

      {searchParams.minRating > 0 ? (
        <Badge
          variant='secondary'
          className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
          onClick={() => searchParams.setMinRating(0)}
        >
          {t('starsPlus', { rating: searchParams.minRating })}
          <IconX className='ms-1 h-3 w-3' />
        </Badge>
      ) : null}

      {searchParams.inStock ? (
        <Badge
          variant='secondary'
          className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
          onClick={() => searchParams.setInStock(false)}
        >
          {t('badges.inStock')}
          <IconX className='ms-1 h-3 w-3' />
        </Badge>
      ) : null}

      {searchParams.onSale ? (
        <Badge
          variant='secondary'
          className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
          onClick={() => searchParams.setOnSale(false)}
        >
          {t('badges.onSale')}
          <IconX className='ms-1 h-3 w-3' />
        </Badge>
      ) : null}

      {searchParams.isNew ? (
        <Badge
          variant='secondary'
          className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
          onClick={() => searchParams.setIsNew(false)}
        >
          {t('badges.newArrivals')}
          <IconX className='ms-1 h-3 w-3' />
        </Badge>
      ) : null}

      {searchParams.isDigital ? (
        <Badge
          variant='secondary'
          className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
          onClick={() => searchParams.setIsDigital(false)}
        >
          {t('badges.digital')}
          <IconX className='ms-1 h-3 w-3' />
        </Badge>
      ) : null}

      <Button
        variant='ghost'
        size='sm'
        className='text-primary'
        onClick={searchParams.clearFilters}
      >
        {t('clearAllShort')}
      </Button>
    </div>
  );
}
