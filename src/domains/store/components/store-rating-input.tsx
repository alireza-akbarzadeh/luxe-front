'use client';

import { IconStar } from '@tabler/icons-react';

import { cn } from '@/lib/utils';

interface StoreRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

/** Interactive 1–5 star picker for store reviews. */
export function StoreRatingInput({
  value,
  onChange,
  disabled = false,
  size = 'md'
}: StoreRatingInputProps) {
  const starClass = size === 'sm' ? 'h-5 w-5' : 'h-7 w-7';

  return (
    <div className='flex items-center gap-1' role='group' aria-label='Rating'>
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const filled = starValue <= value;

        return (
          <button
            key={starValue}
            type='button'
            disabled={disabled}
            aria-label={`Rate ${starValue} out of 5`}
            onClick={() => onChange(starValue)}
            className={cn(
              'rounded-md transition-transform hover:scale-110 focus-visible:ring-gold focus:outline-none focus-visible:ring-2 disabled:opacity-50',
              filled ? 'text-gold' : 'text-muted-foreground/35 hover:text-gold/70'
            )}
          >
            <IconStar className={cn(starClass, filled && 'fill-gold')} />
          </button>
        );
      })}
    </div>
  );
}
