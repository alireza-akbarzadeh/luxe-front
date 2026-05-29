'use client';
import { IconTrendingUp } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

import { AnimatedCounter } from '~/src/domains/store/components/animate-counter';
import { StoreCardCompact } from '~/src/domains/store/components/store-compact-card';
import { mapStoreToView } from '~/src/domains/store/store.utils';
import type { DtoStoreResponse } from '~/src/services/-stores-get.schemas';

export function FeaturedCarousel({ stores, title }: { stores: DtoStoreResponse[]; title: string }) {
  const mappedStores = useMemo(() => stores.map(mapStoreToView), [stores]);

  const top = useMemo(
    () => [...mappedStores].sort((a, b) => b.trendingScore - a.trendingScore).slice(0, 10),
    [stores]
  );
  if (top.length === 0) return null;

  return (
    <section className='space-y-4'>
      <div className='flex items-end justify-between'>
        <div className='flex items-center gap-2'>
          <IconTrendingUp className='text-accent h-4 w-4' />
          <h2 className='text-lg font-semibold tracking-tight'>{title}</h2>
        </div>
        <span className='text-muted-foreground text-xs'>
          <AnimatedCounter value={top.length} /> trending now
        </span>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
      >
        {top.map((s) => (
          <div key={s.id} className='w-[280px] shrink-0 snap-start'>
            <StoreCardCompact store={s} />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
