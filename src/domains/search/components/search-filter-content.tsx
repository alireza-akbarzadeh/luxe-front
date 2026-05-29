'use client';

import { IconShoppingCart, IconTag } from '@tabler/icons-react';
import Image from 'next/image';
import { useMemo } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Button } from '~/src/components/ui/button';
import type {
  DtoCategoryResponse,
  DtoProductResponse,
  DtoStoreResponse} from '~/src/services/-search-get.schemas';

import { useSearchParams } from '../hooks/useSearchParams';

interface SearchFilterContentProps {
  products: DtoProductResponse[];
  stores: DtoStoreResponse[];
  categories?: DtoCategoryResponse[]; // optional, from search API
}

export function SearchFilterContent({
  products,
  stores,
  categories: searchCategories
}: SearchFilterContentProps) {
  const searchParams = useSearchParams();

  // Use search API categories if provided, otherwise derive from products
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
      {/* Categories */}
      <div>
        <h3 className='mb-3 flex items-center gap-2 font-semibold'>
          <IconTag className='h-4 w-4' />
          Categories
        </h3>
        <div className='max-h-48 space-y-2 overflow-y-auto'>
          {availableCategories.map((cat) => (
            <label key={cat} className='group flex cursor-pointer items-center gap-2'>
              <Checkbox
                checked={searchParams.categories.includes(cat)}
                onCheckedChange={() => searchParams.toggleCategory(cat)}
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

      {/* Stores */}
      <div>
        <h3 className='mb-3 flex items-center gap-2 font-semibold'>
          <IconShoppingCart className='h-4 w-4' />
          Stores
        </h3>
        <div className='space-y-2'>
          {stores.map((store) => (
            <label key={store.id} className='group flex cursor-pointer items-center gap-2'>
              <Checkbox
                checked={store.id ? searchParams.stores.includes(store.id.toString()) : false}
                onCheckedChange={() => {
                  if (store.id) searchParams.toggleStore(store.id.toString());
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

      {/* Price Range */}
      <div>
        <h3 className='mb-3 font-semibold'>Price Range</h3>
        <Slider
          value={searchParams.priceRange}
          min={0}
          max={1000}
          step={10}
          onValueChange={(v) => searchParams.setPriceRange(v as [number, number])}
          className='mb-2'
        />
        <div className='text-muted-foreground flex items-center justify-between text-sm'>
          <span>${searchParams.priceRange[0]}</span>
          <span>${searchParams.priceRange[1]}</span>
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h3 className='mb-3 font-semibold'>Minimum Rating</h3>
        <div className='flex gap-1'>
          {[0, 3, 4, 4.5].map((rating) => (
            <Button
              key={rating}
              variant={searchParams.minRating === rating ? 'default' : 'outline'}
              size='sm'
              onClick={() => searchParams.setMinRating(rating)}
              className='flex-1'
            >
              {rating === 0 ? 'Any' : `${rating}+`}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Quick Filters */}
      <div>
        <h3 className='mb-3 font-semibold'>Quick Filters</h3>
        <div className='space-y-2'>
          <label className='flex cursor-pointer items-center gap-2'>
            <Checkbox
              checked={searchParams.onSale}
              onCheckedChange={(checked) => searchParams.setOnSale(!!checked)}
            />
            <span className='text-sm'>On Sale</span>
          </label>
          <label className='flex cursor-pointer items-center gap-2'>
            <Checkbox
              checked={searchParams.isNew}
              onCheckedChange={(checked) => searchParams.setIsNew(!!checked)}
            />
            <span className='text-sm'>New Arrivals</span>
          </label>
          <label className='flex cursor-pointer items-center gap-2'>
            <Checkbox
              checked={searchParams.isDigital}
              onCheckedChange={(checked) => searchParams.setIsDigital(!!checked)}
            />
            <span className='text-sm'>Digital Products</span>
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      {searchParams.hasActiveFilters && (
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
