'use client';

import { IconChevronDown, IconStar } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import type { DtoProductResponse } from '~/src/services/-stores-{slug}-products-get.schemas';
import type { DtoCategoryResponse } from '~/src/services/-stores-get.schemas';

import { useStoreFilters } from '../hooks/useStoreFilter';

interface FilterSidebarProps {
  storeCategories: DtoCategoryResponse[] | undefined;
  apiProducts: DtoProductResponse[];
  totalProducts: number;
}

export function StoreFilterSidebar({
  storeCategories,
  apiProducts,
  totalProducts
}: FilterSidebarProps) {
  const t = useTranslations('stores.detail.filters');
  const { formatPrice, formatInteger } = useLocaleFormatters();
  const filters = useStoreFilters(storeCategories?.map((c) => c.name ?? '') || []);
  const {
    category,
    setCategory,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    showOnlyNew,
    setShowOnlyNew,
    showOnlySale,
    setShowOnlySale,
    isDigital,
    setIsDigital,
    hasActiveFilters,
    clearFilters
  } = filters;

  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: false,
    more: false
  });
  const toggleSection = (section: keyof typeof expandedSections) =>
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));

  return (
    <div className='space-y-6'>
      <Collapsible
        open={expandedSections.categories}
        onOpenChange={() => toggleSection('categories')}
      >
        <CollapsibleTrigger className='flex w-full items-center justify-between py-2'>
          <span className='font-medium'>{t('categories')}</span>
          <IconChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.categories ? 'rotate-180' : ''}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className='space-y-2 pt-2'>
          <button
            onClick={() => setCategory('')}
            className={`block w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
              category === '' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
            }`}
          >
            {t('allProducts', { count: totalProducts })}
          </button>
          {storeCategories?.map((cat) => {
            const count = apiProducts.filter((p) => p.category?.name === cat.name).length;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.name ?? '')}
                className={`block w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                  category === cat.name
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                }`}
              >
                {cat.name} ({formatInteger(count)})
              </button>
            );
          })}
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={expandedSections.price} onOpenChange={() => toggleSection('price')}>
        <CollapsibleTrigger className='flex w-full items-center justify-between py-2'>
          <span className='font-medium'>{t('priceRange')}</span>
          <IconChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className='pt-4 pb-2'>
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            min={0}
            max={500}
            step={10}
            className='mb-4'
          />
          <div className='flex items-center justify-between text-sm'>
            <span className='bg-secondary rounded px-2 py-1'>{formatPrice(priceRange[0])}</span>
            <span className='text-muted-foreground'>{t('priceTo')}</span>
            <span className='bg-secondary rounded px-2 py-1'>{formatPrice(priceRange[1])}</span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={expandedSections.rating} onOpenChange={() => toggleSection('rating')}>
        <CollapsibleTrigger className='flex w-full items-center justify-between py-2'>
          <span className='font-medium'>{t('minimumRating')}</span>
          <IconChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.rating ? 'rotate-180' : ''}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className='space-y-2 pt-2'>
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(minRating === rating ? 0 : rating)}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                minRating === rating ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
              }`}
            >
              <div className='flex items-center'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconStar
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < rating
                        ? minRating === rating
                          ? 'fill-primary-foreground text-primary-foreground'
                          : 'fill-accent text-accent'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <span>{t('ratingAndUp')}</span>
            </button>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={expandedSections.more} onOpenChange={() => toggleSection('more')}>
        <CollapsibleTrigger className='flex w-full items-center justify-between py-2'>
          <span className='font-medium'>{t('quickFilters')}</span>
          <IconChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.more ? 'rotate-180' : ''}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className='space-y-3 pt-2'>
          <label className='flex cursor-pointer items-center gap-2'>
            <Checkbox
              checked={showOnlyNew}
              onCheckedChange={(checked) => setShowOnlyNew(checked as boolean)}
            />
            <span className='text-sm'>{t('newArrivals')}</span>
          </label>
          <label className='flex cursor-pointer items-center gap-2'>
            <Checkbox
              checked={showOnlySale}
              onCheckedChange={(checked) => setShowOnlySale(checked as boolean)}
            />
            <span className='text-sm'>{t('onSale')}</span>
          </label>
          {apiProducts.some((p) => p.is_digital) && (
            <label className='flex cursor-pointer items-center gap-2'>
              <Checkbox
                checked={isDigital}
                onCheckedChange={(checked) => setIsDigital(checked as boolean)}
              />
              <span className='text-sm'>{t('digitalOnly')}</span>
            </label>
          )}
        </CollapsibleContent>
      </Collapsible>

      {hasActiveFilters && (
        <Button variant='outline' className='w-full' onClick={clearFilters}>
          {t('clearAll')}
        </Button>
      )}
    </div>
  );
}
