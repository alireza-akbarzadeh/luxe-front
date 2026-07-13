'use client';

import { IconStar, IconStarFilled } from '@tabler/icons-react';

import { cn } from '@/lib/utils';

export function ProductCardStarRating({
  rating = 0,
  compact = false
}: {
  rating?: number;
  compact?: boolean;
}) {
  const rounded = Math.round(rating);

  return (
    <div className='flex items-center gap-0.5'>
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < rounded;
        const Icon = filled ? IconStarFilled : IconStar;

        return (
          <Icon
            key={index}
            className={cn(
              compact ? 'h-3 w-3' : 'h-3.5 w-3.5',
              filled ? 'fill-accent text-accent' : 'text-muted-foreground/35'
            )}
          />
        );
      })}
    </div>
  );
}

export function ProductCardColorSwatches({
  colors,
  compact = false,
  moreColorsLabel
}: {
  colors?: unknown[];
  compact?: boolean;
  moreColorsLabel?: (count: number) => string;
}) {
  const swatches = (colors ?? [])
    .map((color) => (typeof color === 'string' ? color : null))
    .filter(Boolean)
    .slice(0, compact ? 3 : 4) as string[];

  if (swatches.length === 0) return null;

  const remaining = (colors?.length ?? 0) - swatches.length;

  return (
    <div className='flex items-center gap-1.5'>
      {swatches.map((color) => (
        <span
          key={color}
          title={color}
          className={cn(
            'ring-border/60 rounded-full ring-1 ring-inset',
            compact ? 'h-3 w-3' : 'h-3.5 w-3.5'
          )}
          style={{ backgroundColor: color }}
        />
      ))}
      {remaining > 0 && moreColorsLabel ? (
        <span className='text-muted-foreground text-[10px] font-medium tabular-nums'>
          {moreColorsLabel(remaining)}
        </span>
      ) : null}
    </div>
  );
}
