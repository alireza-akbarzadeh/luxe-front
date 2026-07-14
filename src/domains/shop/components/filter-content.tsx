'use client';

import { IconSearch, IconStar, IconStarFilled } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { cn } from '@/lib/utils';
import { useGetBrands } from '~/src/services/-brands-get';
import { useGetCategories } from '~/src/services/-categories-get';

import { useProductFilters } from '../useProductFilters';

const PRICE_PRESETS = [
  { key: 'under50', range: [0, 50] as const },
  { key: '50to100', range: [50, 100] as const },
  { key: '100to250', range: [100, 250] as const },
  { key: 'premium', range: [250, 500] as const }
] as const;

const RATING_OPTIONS = [5, 4, 3, 2, 1] as const;

interface FilterContentProps {
  variant?: 'sidebar' | 'sheet';
  onApply?: () => void;
}

export function FilterContent({ variant = 'sidebar', onApply }: FilterContentProps) {
  const t = useTranslations('shop.filters');
  const { formatPrice, moneyClassName } = useLocaleFormatters();
  const [filterSearch, setFilterSearch] = useState('');
  const [brandSearch, setBrandSearch] = useState('');
  const {
    categoryId,
    brandId,
    priceRange,
    showOnlyNew,
    showOnlySale,
    inStock,
    minRating,
    isDigital,
    setCategoryId,
    setBrandId,
    setPriceRange,
    setShowOnlyNew,
    setShowOnlySale,
    setInStock,
    setMinRating,
    setIsDigital,
    hasActiveFilters,
    clearFilters
  } = useProductFilters();

  const { data: categoriesData } = useGetCategories();
  const { data: brandsData } = useGetBrands({ limit: 80, status: 'active' });
  const categories = categoriesData?.data?.categories ?? [];
  const brands = brandsData?.data?.brands ?? [];
  const query = filterSearch.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!query) return categories;
    return categories.filter((c) => c.name?.toLowerCase().includes(query));
  }, [categories, query]);

  const filteredBrands = useMemo(() => {
    const q = brandSearch.trim().toLowerCase() || query;
    if (!q) return brands;
    return brands.filter((b) => b.name?.toLowerCase().includes(q));
  }, [brands, brandSearch, query]);

  const isPresetActive = (range: readonly [number, number]) =>
    priceRange[0] === range[0] && priceRange[1] === range[1];

  return (
    <div className={cn('flex flex-col', variant === 'sidebar' && 'h-full min-h-0')}>
      <div className='relative mb-5 shrink-0'>
        <IconSearch
          className='text-muted-foreground pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2'
          aria-hidden
        />
        <Input
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
          placeholder={t('searchFilters')}
          aria-label={t('searchFilters')}
          className='h-10 rounded-xl ps-9'
        />
      </div>

      <div
        className={cn(
          'min-h-0 space-y-1',
          variant === 'sidebar' && 'flex-1 overflow-y-auto overscroll-contain pe-1'
        )}
      >
        <Accordion
          type='multiple'
          defaultValue={['price', 'rating', 'categories', 'brands', 'availability', 'discount']}
          className='w-full'
        >
          <AccordionItem value='price' className='border-border/70'>
            <AccordionTrigger className='py-3 text-sm font-semibold hover:no-underline'>
              {t('priceRange')}
            </AccordionTrigger>
            <AccordionContent className='space-y-4 pb-4'>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={500}
                step={10}
              />
              <div
                className={cn(
                  'text-muted-foreground flex justify-between text-sm tabular-nums',
                  moneyClassName
                )}
              >
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
              <div className='grid grid-cols-2 gap-2'>
                {PRICE_PRESETS.map((preset) => (
                  <Button
                    key={preset.key}
                    type='button'
                    size='sm'
                    variant={isPresetActive(preset.range) ? 'default' : 'outline'}
                    className='h-9 rounded-full text-xs'
                    onClick={() => setPriceRange([preset.range[0], preset.range[1]])}
                  >
                    {t(`presets.${preset.key}`)}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='rating' className='border-border/70'>
            <AccordionTrigger className='py-3 text-sm font-semibold hover:no-underline'>
              {t('rating')}
            </AccordionTrigger>
            <AccordionContent className='space-y-2 pb-4'>
              <button
                type='button'
                onClick={() => setMinRating(0)}
                className={cn(
                  'hover:bg-muted/60 flex w-full rounded-xl px-2 py-2 text-sm',
                  minRating === 0 && 'bg-muted'
                )}
              >
                {t('anyRating')}
              </button>
              {RATING_OPTIONS.map((rating) => (
                <button
                  key={rating}
                  type='button'
                  onClick={() => setMinRating(rating)}
                  className={cn(
                    'hover:bg-muted/60 flex w-full items-center gap-2 rounded-xl px-2 py-2',
                    minRating === rating && 'bg-muted'
                  )}
                >
                  <span className='flex items-center gap-0.5'>
                    {Array.from({ length: 5 }).map((_, i) =>
                      i < rating ? (
                        <IconStarFilled key={i} className='h-3.5 w-3.5 text-amber-400' />
                      ) : (
                        <IconStar key={i} className='text-muted-foreground/40 h-3.5 w-3.5' />
                      )
                    )}
                  </span>
                  <span className='text-muted-foreground text-xs'>{t('ratingAndUp')}</span>
                </button>
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='categories' className='border-border/70'>
            <AccordionTrigger className='py-3 text-sm font-semibold hover:no-underline'>
              {t('categories')}
            </AccordionTrigger>
            <AccordionContent className='pb-4'>
              <RadioGroup
                value={categoryId > 0 ? categoryId.toString() : ''}
                onValueChange={(val) => setCategoryId(val ? Number(val) : null)}
                className={cn(
                  'space-y-1',
                  variant === 'sidebar' && 'max-h-52 overflow-y-auto pe-1'
                )}
              >
                <div className='hover:bg-muted/50 flex items-center gap-2 rounded-lg px-2 py-1.5'>
                  <RadioGroupItem value='' id='category-all' />
                  <Label
                    htmlFor='category-all'
                    className='flex-1 cursor-pointer text-sm font-normal'
                  >
                    {t('allCategories')}
                  </Label>
                </div>
                {filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className='hover:bg-muted/50 flex items-center gap-2 rounded-lg px-2 py-1.5'
                  >
                    <RadioGroupItem value={category.id!.toString()} id={`cat-${category.id}`} />
                    <Label
                      htmlFor={`cat-${category.id}`}
                      className='flex-1 cursor-pointer text-sm font-normal'
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='brands' className='border-border/70'>
            <AccordionTrigger className='py-3 text-sm font-semibold hover:no-underline'>
              {t('brands')}
            </AccordionTrigger>
            <AccordionContent className='space-y-3 pb-4'>
              <Input
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder={t('searchBrands')}
                className='h-9 rounded-xl'
              />
              <div className={cn('space-y-1', variant === 'sidebar' && 'max-h-52 overflow-y-auto')}>
                <button
                  type='button'
                  onClick={() => setBrandId(null)}
                  className={cn(
                    'hover:bg-muted/50 w-full rounded-lg px-2 py-1.5 text-start text-sm',
                    brandId === 0 && 'bg-muted'
                  )}
                >
                  {t('allBrands')}
                </button>
                {filteredBrands.map((brand) => (
                  <button
                    key={brand.id}
                    type='button'
                    onClick={() => setBrandId(brand.id ?? null)}
                    className={cn(
                      'hover:bg-muted/50 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-start text-sm',
                      brandId === brand.id && 'bg-muted'
                    )}
                  >
                    {brand.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={brand.logo_url}
                        alt=''
                        className='h-5 w-5 rounded-full object-cover'
                      />
                    ) : (
                      <span className='bg-secondary flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold'>
                        {brand.name?.charAt(0) ?? '?'}
                      </span>
                    )}
                    <span className='truncate'>{brand.name}</span>
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='availability' className='border-border/70'>
            <AccordionTrigger className='py-3 text-sm font-semibold hover:no-underline'>
              {t('availability')}
            </AccordionTrigger>
            <AccordionContent className='space-y-3 pb-4'>
              <div className='flex items-center gap-2'>
                <Checkbox
                  id='in-stock'
                  checked={inStock}
                  onCheckedChange={(c) => setInStock(c === true)}
                />
                <Label htmlFor='in-stock' className='text-sm'>
                  {t('inStock')}
                </Label>
              </div>
              <div className='flex items-center gap-2'>
                <Checkbox
                  id='digital'
                  checked={isDigital}
                  onCheckedChange={(c) => setIsDigital(c === true)}
                />
                <Label htmlFor='digital' className='text-sm'>
                  {t('digitalOnly')}
                </Label>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='discount' className='border-border/70'>
            <AccordionTrigger className='py-3 text-sm font-semibold hover:no-underline'>
              {t('discount')}
            </AccordionTrigger>
            <AccordionContent className='space-y-3 pb-4'>
              <div className='flex items-center gap-2'>
                <Checkbox
                  id='sale-only'
                  checked={showOnlySale}
                  onCheckedChange={(c) => setShowOnlySale(c === true)}
                />
                <Label htmlFor='sale-only' className='text-sm'>
                  {t('onSaleOnly')}
                </Label>
              </div>
              <div className='flex items-center gap-2'>
                <Checkbox
                  id='new-only'
                  checked={showOnlyNew}
                  onCheckedChange={(c) => setShowOnlyNew(c === true)}
                />
                <Label htmlFor='new-only' className='text-sm'>
                  {t('newArrivalsOnly')}
                </Label>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className='bg-background/95 border-border mt-4 flex shrink-0 gap-2 border-t pt-4'>
        <Button
          type='button'
          variant='outline'
          className='h-11 flex-1 rounded-full'
          disabled={!hasActiveFilters}
          onClick={clearFilters}
        >
          {t('resetAll')}
        </Button>
        {onApply ? (
          <Button type='button' className='h-11 flex-1 rounded-full' onClick={onApply}>
            {t('applyFilters')}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
