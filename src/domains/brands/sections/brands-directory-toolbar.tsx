'use client';

import { IconFilter, IconSearch } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import type { BrandsDirectoryTab } from '@/domains/brands/types/brands.types';
import { cn } from '@/lib/utils';

const TABS: Array<{ id: BrandsDirectoryTab; label: string }> = [
  { id: 'all', label: 'All Brands' },
  { id: 'popular', label: 'Popular' },
  { id: 'newest', label: 'New In' },
  { id: 'name_asc', label: 'A – Z' }
];

interface BrandsDirectoryToolbarProps {
  search: string;
  tab: BrandsDirectoryTab;
  showingFrom: number;
  showingTo: number;
  total: number;
  onSearchChange: (value: string) => void;
  onTabChange: (tab: BrandsDirectoryTab) => void;
}

/** Search, tab filters, and result count for the brands directory. */
export function BrandsDirectoryToolbar({
  search,
  tab,
  showingFrom,
  showingTo,
  total,
  onSearchChange,
  onTabChange
}: BrandsDirectoryToolbarProps) {
  return (
    <Flex direction='column' gap={4}>
      <Flex direction='row' align='center' gap={3} wrap='wrap' className='justify-between'>
        <div className='relative min-w-[min(100%,16rem)] flex-1 sm:max-w-xs'>
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder='Search brands…'
            className='h-10 rounded-full pe-10'
            aria-label='Search brands'
          />
          <IconSearch
            className='text-muted-foreground pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2'
            aria-hidden
          />
        </div>

        <Flex direction='row' align='center' gap={2} wrap='wrap' className='ms-auto'>
          {TABS.map((item) => {
            const active = item.id === tab;
            return (
              <Button
                key={item.id}
                type='button'
                size='sm'
                variant={active ? 'default' : 'outline'}
                onClick={() => onTabChange(item.id)}
                className={cn('rounded-full px-4', active && 'shadow-sm')}
              >
                {item.label}
              </Button>
            );
          })}
        </Flex>
      </Flex>

      <Flex direction='row' align='center' justify='between' gap={3} wrap='wrap'>
        <Typography.Muted className='text-sm'>
          Showing{' '}
          <span className='text-foreground font-medium'>
            {total === 0 ? 0 : showingFrom}–{showingTo}
          </span>{' '}
          of <span className='text-foreground font-medium'>{total.toLocaleString('en-US')}</span>{' '}
          brands
        </Typography.Muted>
        <Button type='button' variant='outline' size='sm' className='gap-2 rounded-full' disabled>
          <IconFilter className='h-4 w-4' aria-hidden />
          Filter
        </Button>
      </Flex>
    </Flex>
  );
}
