'use client';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Typography } from '@/components/ui/typography';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { cn } from '@/lib/utils';
import type { ModelsCategory } from '@/services/-categories-get.schemas';

interface BrandProductsSidebarProps {
  categories: ModelsCategory[];
  categoryId: number;
  priceMin: number;
  priceMax: number;
  gender: string;
  hasActiveFilters: boolean;
  onCategoryChange: (id: number) => void;
  onPriceChange: (min: number, max: number) => void;
  onGenderChange: (gender: string) => void;
  onClear: () => void;
  className?: string;
}

const GENDERS = [
  { id: 'all', label: 'All' },
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
  { id: 'kids', label: 'Kids' }
] as const;

/** Sticky filter sidebar for brand product listings. */
export function BrandProductsSidebar({
  categories,
  categoryId,
  priceMin,
  priceMax,
  gender,
  hasActiveFilters,
  onCategoryChange,
  onPriceChange,
  onGenderChange,
  onClear,
  className
}: BrandProductsSidebarProps) {
  const { formatPrice, moneyClassName } = useLocaleFormatters();

  return (
    <aside className={cn('space-y-8', className)}>
      <Flex direction='column' gap={3}>
        <Typography.Small className='font-semibold tracking-wide uppercase'>
          Categories
        </Typography.Small>
        <Flex direction='column' gap={1}>
          <button
            type='button'
            onClick={() => onCategoryChange(0)}
            className={cn(
              'hover:bg-muted/60 rounded-lg px-3 py-2 text-start text-sm transition-colors',
              categoryId === 0 && 'bg-muted font-medium'
            )}
          >
            All products
          </button>
          {categories.map((cat) => {
            const id = cat.id ?? 0;
            if (!id || !cat.name) return null;
            return (
              <button
                key={id}
                type='button'
                onClick={() => onCategoryChange(id)}
                className={cn(
                  'hover:bg-muted/60 rounded-lg px-3 py-2 text-start text-sm transition-colors',
                  categoryId === id && 'bg-muted font-medium'
                )}
              >
                {cat.name}
              </button>
            );
          })}
        </Flex>
      </Flex>

      <Flex direction='column' gap={3}>
        <Typography.Small className='font-semibold tracking-wide uppercase'>
          Gender
        </Typography.Small>
        <Flex direction='row' gap={2} wrap='wrap'>
          {GENDERS.map((g) => (
            <Button
              key={g.id}
              type='button'
              size='sm'
              variant={gender === g.id ? 'default' : 'outline'}
              className='rounded-full'
              onClick={() => onGenderChange(g.id)}
            >
              {g.label}
            </Button>
          ))}
        </Flex>
      </Flex>

      <Flex direction='column' gap={4}>
        <Typography.Small className='font-semibold tracking-wide uppercase'>
          Price range
        </Typography.Small>
        <Slider
          min={0}
          max={2000}
          step={10}
          value={[priceMin, priceMax]}
          onValueChange={(value) => {
            const [min, max] = value;
            onPriceChange(min ?? 0, max ?? 2000);
          }}
        />
        <Flex direction='row' justify='between'>
          <Label className={cn('text-muted-foreground text-xs', moneyClassName)}>
            {formatPrice(priceMin)}
          </Label>
          <Label className={cn('text-muted-foreground text-xs', moneyClassName)}>
            {formatPrice(priceMax)}
          </Label>
        </Flex>
      </Flex>

      {hasActiveFilters ? (
        <Button type='button' variant='outline' className='w-full rounded-full' onClick={onClear}>
          Clear all filters
        </Button>
      ) : null}
    </aside>
  );
}
