'use client';
import { IconLayoutGrid, IconLayoutList, IconStack3 } from '@tabler/icons-react';

import { useStoresFilters } from '@/domains/store/hooks/useStoresFilter';
import type { ViewMode } from '@/domains/store/store.types';
import { cn } from '@/lib/utils';

const MODES: { value: ViewMode; icon: typeof IconLayoutGrid; label: string }[] = [
  { value: 'grid', icon: IconLayoutGrid, label: 'Grid view' },
  { value: 'compact', icon: IconStack3, label: 'Compact view' },
  { value: 'list', icon: IconLayoutList, label: 'List view' }
];
export function ViewModeToggle() {
  const { filters, setFilters } = useStoresFilters();
  return (
    <div
      role='radiogroup'
      aria-label='View mode'
      className='border-border bg-card/40 inline-flex rounded-full border p-1'
    >
      {MODES.map(({ value, icon: Icon, label }) => {
        const active = filters.view === value;
        return (
          <button
            key={value}
            role='radio'
            aria-checked={active}
            aria-label={label}
            onClick={() => setFilters({ view: value })}
            className={cn(
              'rounded-full p-1.5 transition-colors',
              active
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className='h-4 w-4' />
          </button>
        );
      })}
    </div>
  );
}
