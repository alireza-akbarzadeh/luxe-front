'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProductFilters } from '../useProductFilters';
import { useGetCategories } from '~/src/services/-categories-get';

export function FilterContent() {
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
      {/* Categories – Radio buttons (single selection) */}
      <div>
        <h3 className='mb-4 font-semibold'>Categories</h3>
        <RadioGroup
          value={categoryId?.toString() ?? ''}
          onValueChange={(val) => setCategoryId(val ? Number(val) : null)}
          className='space-y-3'
        >
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='' id='category-all' />
            <Label htmlFor='category-all' className='text-sm font-normal'>
              All Categories
            </Label>
          </div>
          {categories.map((category) => (
            <div key={category.id} className='flex items-center space-x-2'>
              <RadioGroupItem value={category.id!.toString()} id={`cat-${category.id}`} />
              <Label htmlFor={`cat-${category.id}`} className='text-sm font-normal'>
                {category.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Price Range */}
      <div>
        <h3 className='mb-4 font-semibold'>Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={500}
          step={10}
          className='mb-4'
        />
        <div className='text-muted-foreground flex items-center justify-between text-sm'>
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Rating Range */}
      <div>
        <h3 className='mb-4 font-semibold'>Rating</h3>
        <Slider
          value={[minRating, maxRating]}
          onValueChange={([min, max]) => setRatingRange(min as number, max as number)}
          min={0}
          max={5}
          step={0.5}
          className='mb-4'
        />
        <div className='text-muted-foreground flex items-center justify-between text-sm'>
          <span>{minRating} ★</span>
          <span>{maxRating} ★</span>
        </div>
      </div>

      {/* Reviews Count Range */}
      <div>
        <h3 className='mb-4 font-semibold'>Number of Reviews</h3>
        <div className='flex gap-3'>
          <div className='flex-1'>
            <Label htmlFor='min-reviews' className='text-xs'>
              Min
            </Label>
            <Input
              id='min-reviews'
              type='number'
              value={minReviews}
              onChange={(e) => setReviewsRange(Number(e.target.value), maxReviews)}
              min={0}
              max={maxReviews}
              className='mt-1'
            />
          </div>
          <div className='flex-1'>
            <Label htmlFor='max-reviews' className='text-xs'>
              Max
            </Label>
            <Input
              id='max-reviews'
              type='number'
              value={maxReviews}
              onChange={(e) => setReviewsRange(minReviews, Number(e.target.value))}
              min={minReviews}
              className='mt-1'
            />
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <h3 className='mb-4 font-semibold'>Quick Filters</h3>
        <div className='space-y-3'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='new-only'
              checked={showOnlyNew}
              onCheckedChange={(checked) => setShowOnlyNew(checked as boolean)}
            />
            <Label htmlFor='new-only' className='text-sm'>
              New Arrivals Only
            </Label>
          </div>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='sale-only'
              checked={showOnlySale}
              onCheckedChange={(checked) => setShowOnlySale(checked as boolean)}
            />
            <Label htmlFor='sale-only' className='text-sm'>
              On Sale Only
            </Label>
          </div>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='digital'
              checked={isDigital}
              onCheckedChange={(checked) => setIsDigital(checked as boolean)}
            />
            <Label htmlFor='digital' className='text-sm'>
              Digital Products Only
            </Label>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant='outline' className='w-full' onClick={clearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );
}
