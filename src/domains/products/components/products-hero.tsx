'use client';

import { IconSparkles } from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { Badge } from '@/components/ui/badge';
import { fullBleedClass, sectionContainerClass } from '@/domains/home/lib/home-utils';
import { cn } from '@/lib/utils';

interface ProductsHeroProps {
  total: number;
  loadedCount: number;
  isFetching: boolean;
}

export function ProductsHero({ total, loadedCount, isFetching }: ProductsHeroProps) {
  return (
    <section
      className={cn(
        fullBleedClass,
        'from-secondary/40 via-background to-background relative border-b bg-linear-to-b'
      )}
    >
      <div
        className='pointer-events-none absolute inset-0 opacity-[0.35]'
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, var(--accent) 0%, transparent 45%), radial-gradient(circle at 80% 0%, var(--primary) 0%, transparent 40%)'
        }}
      />

      <div
        className={cn(
          sectionContainerClass,
          'relative pt-10 pb-10 sm:pt-12 md:pb-12 lg:pt-14 lg:pb-14'
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className='max-w-3xl'
        >
          <Badge variant='secondary' className='mb-4 rounded-full px-3 py-1'>
            <IconSparkles className='mr-1.5 inline h-3.5 w-3.5' />
            Curated collection
          </Badge>

          <h1 className='font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl'>
            All Products
          </h1>
          <p className='text-muted-foreground mt-4 max-w-2xl text-base md:text-lg'>
            Browse the full LUXE catalog — premium pieces selected for quality, craft, and timeless
            design. Scroll to discover more.
          </p>

          <div className='text-muted-foreground mt-6 flex flex-wrap items-center gap-3 text-sm'>
            <span className='bg-background/80 border-border/60 rounded-full border px-3 py-1 tabular-nums backdrop-blur-sm'>
              {total > 0 ? `${total.toLocaleString('en-US')} products` : 'Loading catalog…'}
            </span>
            {loadedCount > 0 && (
              <span className='bg-background/80 border-border/60 rounded-full border px-3 py-1 tabular-nums backdrop-blur-sm'>
                {loadedCount.toLocaleString('en-US')} loaded
              </span>
            )}
            {isFetching && (
              <span className='text-accent animate-pulse text-xs font-medium tracking-wide uppercase'>
                Updating…
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
