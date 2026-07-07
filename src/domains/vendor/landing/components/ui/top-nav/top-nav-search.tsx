'use client';

import { IconSearch } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { FlexItem } from '@/components/ui/flex-item';

interface TopNavSearchProps {
  onOpen: () => void;
}

export function TopNavSearch({ onOpen }: TopNavSearchProps) {
  const t = useTranslations('vendor.panel.topNav');

  return (
    <FlexItem grow={1} className='min-w-0'>
      <button
        type='button'
        onClick={onOpen}
        className='border-border/60 bg-muted/30 text-muted-foreground hover:border-border hover:bg-muted/50 focus-visible:ring-gold/40 flex h-9 w-full items-center gap-2 rounded-xl border px-3 text-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none md:max-w-md'
        aria-label={t('openSearch')}
      >
        <IconSearch className='size-4 shrink-0' />
        <span className='truncate'>{t('searchPlaceholder')}</span>
        <kbd className='bg-background text-muted-foreground/80 ms-auto hidden rounded-md border px-1.5 py-0.5 text-[10px] font-medium tracking-wide md:inline'>
          ⌘K
        </kbd>
      </button>
    </FlexItem>
  );
}
