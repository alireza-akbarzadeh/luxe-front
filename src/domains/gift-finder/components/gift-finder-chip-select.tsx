'use client';

import { Button } from '@/components/ui/button';
import { Grid } from '@/components/ui/grid';

type GiftFinderChipSelectProps = {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  labelFor: (key: string) => string;
  columns?: 2 | 3;
};

/** Single-select chip grid for wizard steps. */
export function GiftFinderChipSelect({
  options,
  value,
  onChange,
  labelFor
}: GiftFinderChipSelectProps) {
  return (
    <Grid gap={2} autoFit='md' fullWidth>
      {options.map((option) => {
        const selected = value === option;
        return (
          <Button
            key={option}
            type='button'
            variant={selected ? 'default' : 'outline'}
            className='h-auto min-h-11 w-full rounded-2xl px-4 py-3 text-sm whitespace-normal'
            aria-pressed={selected}
            onClick={() => onChange(option)}
          >
            {labelFor(option)}
          </Button>
        );
      })}
    </Grid>
  );
}
