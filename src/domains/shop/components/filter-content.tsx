'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { cn } from '@/lib/utils';
import { useGetCategories } from '~/src/services/-categories-get';

import { useProductFilters } from '../useProductFilters';

export function FilterContent() {
  const t = useTranslations('shop.filters');
  const { formatPrice, formatDecimal, moneyClassName } = useLocaleFormatters();
  const {
    categoryId,
    priceRange,
    showOnlyNew,
    showOnlySale,
    minRating,
    maxRating,
    minReviews,
    maxReviews,
    isDigital,
    setCategoryId,
    setPriceRange,
    setShowOnlyNew,
    setShowOnlySale,
    setRatingRange,
    setReviewsRange,
    setIsDigital,
    hasActiveFilters,
    clearFilters
  } = useProductFilters();

  const { data } = useGetCategories();
  const categories = data?.data?.categories ?? [];

  return (
    <div className='space-y-8'>
      <div>
        <h3 className='mb-4 font-semibold'>{t('categories')}</h3>
        <RadioGroup
          value={categoryId > 0 ? categoryId.toString() : ''}
          onValueChange={(val) => setCategoryId(val ? Number(val) : null)}
          className='space-y-3'
        >
          <div className='flex items-center gap-2'>
            <RadioGroupItem value='' id='category-all' />
            <Label htmlFor='category-all' className='text-sm font-normal'>
              {t('allCategories')}
            </Label>
          </div>
          {categories.map((category) => (
            <div key={category.id} className='flex items-center gap-2'>
              <RadioGroupItem value={category.id!.toString()} id={`cat-${category.id}`} />
              <Label htmlFor={`cat-${category.id}`} className='text-sm font-normal'>
                {category.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <h3 className='mb-4 font-semibold'>{t('priceRange')}</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={500}
          step={10}
          className='mb-4'
        />
        <div
          className={cn(
            'text-muted-foreground flex items-center justify-between text-sm tabular-nums',
            moneyClassName
          )}
        >
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      <div>
        <h3 className='mb-4 font-semibold'>{t('rating')}</h3>
        <Slider
          value={[minRating, maxRating]}
          onValueChange={([min, max]) => setRatingRange(min as number, max as number)}
          min={0}
          max={5}
          step={0.5}
          className='mb-4'
        />
        <div className='text-muted-foreground flex items-center justify-between text-sm tabular-nums'>
          <span>
            {formatDecimal(minRating)} ★
          </span>
          <span>
            {formatDecimal(maxRating)} ★
          </span>
        </div>
      </div>

      <div>
        <h3 className='mb-4 font-semibold'>{t('reviewCount')}</h3>
        <div className='flex gap-3'>
          <div className='flex-1'>
            <Label htmlFor='min-reviews' className='text-xs'>
              {t('min')}
            </Label>
            <Input
              id='min-reviews'
              type='number'
              value={minReviews}
              onChange={(e) => setReviewsRange(Number(e.target.value), maxReviews)}
              min={0}
              max={maxReviews}
              className='mt-1 tabular-nums'
            />
          </div>
          <div className='flex-1'>
            <Label htmlFor='max-reviews' className='text-xs'>
              {t('max')}
            </Label>
            <Input
              id='max-reviews'
              type='number'
              value={maxReviews}
              onChange={(e) => setReviewsRange(minReviews, Number(e.target.value))}
              min={minReviews}
              className='mt-1 tabular-nums'
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className='mb-4 font-semibold'>{t('quickFilters')}</h3>
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <Checkbox
              id='new-only'
              checked={showOnlyNew}
              onCheckedChange={(checked) => setShowOnlyNew(checked as boolean)}
            />
            <Label htmlFor='new-only' className='text-sm'>
              {t('newArrivalsOnly')}
            </Label>
          </div>
          <div className='flex items-center gap-2'>
            <Checkbox
              id='sale-only'
              checked={showOnlySale}
              onCheckedChange={(checked) => setShowOnlySale(checked as boolean)}
            />
            <Label htmlFor='sale-only' className='text-sm'>
              {t('onSaleOnly')}
            </Label>
          </div>
          <div className='flex items-center gap-2'>
            <Checkbox
              id='digital'
              checked={isDigital}
              onCheckedChange={(checked) => setIsDigital(checked as boolean)}
            />
            <Label htmlFor='digital' className='text-sm'>
              {t('digitalOnly')}
            </Label>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant='outline' className='w-full' onClick={clearFilters}>
          {t('clearAll')}
        </Button>
      )}
    </div>
  );
}
