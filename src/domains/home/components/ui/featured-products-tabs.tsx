'use client';

import { IconClock, IconSparkles, IconTrendingUp } from '@tabler/icons-react';
import type { ReactNode } from 'react';

import { Flex } from '@/components/ui/flex';
import { cn } from '@/lib/utils';

export type FeaturedProductTab = 'featured' | 'new' | 'trending';

type TabOption = {
  value: FeaturedProductTab;
  label: string;
};

type FeaturedProductsTabsProps = {
  value: FeaturedProductTab;
  onChange: (value: FeaturedProductTab) => void;
  tabs: TabOption[];
};

const tabIcons: Record<FeaturedProductTab, ReactNode> = {
  featured: <IconSparkles className='size-4 shrink-0' stroke={1.75} />,
  new: <IconClock className='size-4 shrink-0' stroke={1.75} />,
  trending: <IconTrendingUp className='size-4 shrink-0' stroke={1.75} />
};

/** Horizontal scrollable pill tabs for the featured products panel. */
export function FeaturedProductsTabs({ value, onChange, tabs }: FeaturedProductsTabsProps) {
  if (tabs.length === 0) return null;

  return (
    <Flex
      direction='row'
      gap={2}
      className='-mx-1 mt-4 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value;
        return (
          <button
            key={tab.value}
            type='button'
            onClick={() => onChange(tab.value)}
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors',
              isActive
                ? 'border-foreground bg-foreground text-background shadow-sm dark:border-white dark:bg-white dark:text-[#141414]'
                : 'border-border/70 bg-background/90 text-foreground hover:border-border dark:border-white/15 dark:bg-white/5 dark:text-white/85 dark:hover:border-white/25'
            )}
          >
            {tabIcons[tab.value]}
            {tab.label}
          </button>
        );
      })}
    </Flex>
  );
}
