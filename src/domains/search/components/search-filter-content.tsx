'use client';

import { IconShoppingCart, IconTag } from '@tabler/icons-react';
import Image from 'next/image';
import { useMemo } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Button } from '~/src/components/ui/button';
import type {
  DtoCategoryResponse,
  DtoProductResponse,
  DtoStoreResponse} from '~/src/services/-search-get.schemas';

import type { SearchFilterDraftActions } from '../hooks/useSearchFilterDraft';
import { useSearchParams } from '../hooks/useSearchParams';
import type { SearchFilterDraft } from '../search.utils';
import {
  hasActiveSearchFilterDraft
} from '../search.utils';
import { SearchPriceRangeFilter } from './search-price-range-filter';

interface SearchFilterContentProps {
  products: DtoProductResponse[];
  stores: DtoStoreResponse[];
  categories?: DtoCategoryResponse[];
  /** Sheet layout hides duplicate clear actions — handled by the drawer footer. */
  variant?: 'sidebar' | 'sheet';
  /** Draft filters for mobile sheet — URL is updated only when the sheet is applied. */
  draft?: SearchFilterDraft;
  draftActions?: SearchFilterDraftActions;
}

export function SearchFilterContent({
  products,
  stores,
  categories: searchCategories,
  variant = 'sidebar',
  draft,
  draftActions
}: SearchFilterContentProps) {
  const searchParams = useSearchParams();
  const isDraftMode = draft != null && draftActions != null;

  const categories = isDraftMode ? draft.categories : searchParams.categories;
  const selectedStores = isDraftMode ? draft.stores : searchParams.stores;
  const minRating = isDraftMode ? draft.minRating : searchParams.minRating;
  const inStock = isDraftMode ? draft.inStock : searchParams.inStock;
  const onSale = isDraftMode ? draft.onSale : searchParams.onSale;
  const isNew = isDraftMode ? draft.isNew : searchParams.isNew;
  const isDigital = isDraftMode ? draft.isDigital : searchParams.isDigital;
  const hasActiveFilters = isDraftMode
    ? hasActiveSearchFilterDraft(draft)
    : searchParams.hasActiveFilters;

  const toggleCategory = (category: string) => {
    if (isDraftMode) {
      draftActions.toggleCategory(category);
      return;
    }
    searchParams.toggleCategory(category);
  };

  const toggleStore = (storeId: string) => {
    if (isDraftMode) {
      draftActions.toggleStore(storeId);
      return;
    }
    searchParams.toggleStore(storeId);
  };

  const setMinRating = (rating: number) => {
    if (isDraftMode) {
      draftActions.setMinRating(rating);
      return;
    }
    searchParams.setMinRating(rating);
  };

  const setInStock = (value: boolean) => {
    if (isDraftMode) {
      draftActions.setInStock(value);
      return;
    }
    searchParams.setInStock(value);
  };

  const setOnSale = (value: boolean) => {
    if (isDraftMode) {
      draftActions.setOnSale(value);
      return;
    }
    searchParams.setOnSale(value);
  };

  const setIsNew = (value: boolean) => {
    if (isDraftMode) {
      draftActions.setIsNew(value);
      return;
    }
    searchParams.setIsNew(value);
  };

  const setIsDigital = (value: boolean) => {
    if (isDraftMode) {
      draftActions.setIsDigital(value);
      return;
    }
    searchParams.setIsDigital(value);
  };

  const availableCategories = useMemo(() => {
    if (searchCategories && searchCategories.length > 0) {
      return searchCategories.map((c) => c.name).filter(Boolean);
    }
    const cats = new Set(products.map((p) => p.category?.name).filter(Boolean));
    return Array.from(cats).sort();
  }, [searchCategories, products]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const catName = p.category?.name;
      if (catName) {
        counts[catName] = (counts[catName] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='mb-3 flex items-center gap-2 font-semibold'>
          <IconTag className='h-4 w-4' />
          Categories
        </h3>
        <div className={variant === 'sheet' ? 'max-h-none space-y-2' : 'max-h-48 space-y-2 overflow-y-auto'}>
          {availableCategories.map((cat) => (
            <label key={cat} className='group flex cursor-pointer items-center gap-2'>
              <Checkbox
                checked={categories.includes(cat)}
                onCheckedChange={() => toggleCategory(cat)}
              />
              <span className='group-hover:text-primary text-sm transition-colors'>{cat}</span>
              <span className='text-muted-foreground ml-auto text-xs'>
                {categoryCounts[cat] || 0}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className='mb-3 flex items-center gap-2 font-semibold'>
          <IconShoppingCart className='h-4 w-4' />
          Stores
        </h3>
        <div className='space-y-2'>
          {stores.map((store) => (
            <label key={store.id} className='group flex cursor-pointer items-center gap-2'>
              <Checkbox
                checked={store.id ? selectedStores.includes(store.id.toString()) : false}
                onCheckedChange={() => {
                  if (store.id) toggleStore(store.id.toString());
                }}
              />
              {store.logo_url && (
                <Image
                  src={store.logo_url}
                  alt={store.name || ''}
                  width={20}
                  height={20}
                  className='rounded-full'
                />
              )}
              <span className='group-hover:text-primary text-sm transition-colors'>
                {store.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {isDraftMode ? (
        <SearchPriceRangeFilter value={draft.priceRange} onChange={draftActions.setPriceRange} />
      ) : (
        <SearchPriceRangeFilter />
      )}

      <Separator />

      <div>
        <h3 className='mb-3 font-semibold'>Minimum Rating</h3>
        <div className='flex gap-1'>
          {[0, 3, 4, 4.5].map((rating) => (
            <Button
              key={rating}
              variant={minRating === rating ? 'default' : 'outline'}
              size='sm'
              onClick={() => setMinRating(rating)}
              className='flex-1'
            >
              {rating === 0 ? 'Any' : `${rating}+`}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className='mb-3 font-semibold'>Quick Filters</h3>
        <div className='space-y-2'>
          <label className='flex cursor-pointer items-center gap-2'>
            <Checkbox checked={inStock} onCheckedChange={(checked) => setInStock(!!checked)} />
            <span className='text-sm'>In Stock</span>
          </label>
          <label className='flex cursor-pointer items-center gap-2'>
            <Checkbox checked={onSale} onCheckedChange={(checked) => setOnSale(!!checked)} />
            <span className='text-sm'>On Sale</span>
          </label>
          <label className='flex cursor-pointer items-center gap-2'>
            <Checkbox checked={isNew} onCheckedChange={(checked) => setIsNew(!!checked)} />
            <span className='text-sm'>New Arrivals</span>
          </label>
          <label className='flex cursor-pointer items-center gap-2'>
            <Checkbox checked={isDigital} onCheckedChange={(checked) => setIsDigital(!!checked)} />
            <span className='text-sm'>Digital Products</span>
          </label>
        </div>
      </div>

      {variant === 'sidebar' && hasActiveFilters && (
        <>
          <Separator />
          <Button variant='outline' className='w-full' onClick={searchParams.clearFilters}>
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  );
}
