'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

/** Full-width segmented tab bar for the homepage featured products rail. */
export function FeaturedProductsTabs({ value, onChange, tabs }: FeaturedProductsTabsProps) {
  if (tabs.length === 0) return null;

  return (
    <Tabs
      value={value}
      onValueChange={(next) => onChange(next as FeaturedProductTab)}
      className='w-full'
    >
      <TabsList
        className={cn(
          'border-border/50 bg-muted/35 dark:bg-card/60 grid h-auto w-full gap-1 rounded-2xl border p-1.5',
          tabs.length === 2 && 'grid-cols-2',
          tabs.length === 3 && 'grid-cols-3',
          tabs.length === 1 && 'grid-cols-1'
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              'text-muted-foreground rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
              'data-[state=active]:bg-background data-[state=active]:text-foreground',
              'data-[state=active]:border-border/60 data-[state=active]:border',
              'data-[state=active]:shadow-sm dark:data-[state=active]:bg-[#252525]',
              'dark:data-[state=active]:border-white/12 dark:data-[state=active]:text-white',
              'focus-visible:ring-gold/30'
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
