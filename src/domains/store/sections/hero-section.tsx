'use client';

import {
  IconArrowRight,
  IconPackage,
  IconSearch,
  IconSparkles,
  IconTruck,
  IconUsers
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { fullBleedClass, sectionContainerClass } from '@/domains/home/lib/home-utils';
import { CategoryPill } from '@/domains/store/components/category-pill';
import { STORE_HERO_STATS, TRENDING_CATEGORIES } from '@/domains/store/constants';
import { useStoresFilters } from '@/domains/store/hooks/useStoresFilter';
import { fadeUp, stagger } from '@/domains/store/store.utils';
import { cn } from '@/lib/utils';

export function StoreHeroSection() {
  const { filters, setFilters } = useStoresFilters();

  const toggleCategory = (name: string) => {
    const has = filters.category.includes(name);
    setFilters({
      category: has ? filters.category.filter((c) => c !== name) : [...filters.category, name],
      page: 1
    });
  };

  return (
    <section
      className={cn(
        fullBleedClass,
        'from-background via-background to-surface relative overflow-hidden border-b bg-linear-to-b'
      )}
    >
      <div className='bg-gold/10 dark:bg-gold/15 pointer-events-none absolute -top-32 right-0 h-112 w-md rounded-full blur-3xl' />
      <div className='bg-gold/8 pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full blur-3xl' />

      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]'
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--gold) 1px, transparent 1px), linear-gradient(to bottom, var(--gold) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)'
        }}
      />

      <div
        className={cn(
          sectionContainerClass,
          'relative pt-10 pb-12 sm:pt-12 md:pb-14 lg:pt-14 lg:pb-16'
        )}
      >
        <motion.div variants={stagger} initial='hidden' animate='show' className='max-w-3xl'>
          <motion.div
            variants={fadeUp}
            className='border-gold/30 bg-card/80 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium shadow-sm backdrop-blur-sm sm:text-sm'
          >
            <IconSparkles className='text-gold h-4 w-4' />
            <span className='text-gold-strong dark:text-gold tracking-wide'>
              Curated marketplace
            </span>
            <span className='text-muted-foreground'>· Updated daily</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className='font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl'
          >
            Discover stores you&apos;ll <span className='text-gold-gradient italic'>love</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className='text-muted-foreground mt-4 max-w-xl text-base leading-relaxed sm:text-lg'
          >
            Verified brands and independent makers — handpicked for taste, quality, and craft.
            Follow your favorites and never miss a drop.
          </motion.p>

          <motion.div variants={fadeUp} className='mt-8 w-full max-w-xl'>
            <div className='border-gold/25 bg-card/70 relative flex items-center rounded-full border px-4 py-1 shadow-md backdrop-blur-sm'>
              <IconSearch className='text-muted-foreground h-4 w-4 shrink-0' />
              <Input
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
                placeholder='Search brands, stores, categories…'
                aria-label='Search stores'
                className='border-0 !bg-transparent text-base shadow-none focus-visible:ring-0'
              />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className='mt-6 flex flex-wrap items-center gap-2'>
            {TRENDING_CATEGORIES.map((c) => (
              <CategoryPill
                key={c}
                label={c}
                active={filters.category.includes(c)}
                onClick={() => toggleCategory(c)}
              />
            ))}
          </motion.div>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className='border-gold/15 mt-12 grid grid-cols-2 gap-y-6 border-t pt-8 sm:grid-cols-4 lg:gap-6'
        >
          {STORE_HERO_STATS.map((stat) => (
            <div key={stat.label} className='text-left'>
              <dt className='font-display text-2xl font-semibold sm:text-3xl'>{stat.value}</dt>
              <dd className='text-muted-foreground mt-1 text-xs tracking-wide sm:text-sm'>
                {stat.label}
              </dd>
            </div>
          ))}
        </motion.dl>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className='border-gold/15 bg-card/50 mt-8 flex flex-wrap items-center gap-4 rounded-2xl border px-5 py-4 text-sm backdrop-blur-sm'
        >
          <span className='text-gold-strong dark:text-gold inline-flex items-center gap-1.5 font-medium'>
            <IconPackage className='h-4 w-4' />
            Verified sellers only
          </span>
          <span className='text-muted-foreground bg-border hidden h-4 w-px sm:block' />
          <span className='text-muted-foreground inline-flex items-center gap-1.5'>
            <IconTruck className='h-4 w-4' />
            Fast shipping from top stores
          </span>
          <span className='text-muted-foreground bg-border hidden h-4 w-px sm:block' />
          <span className='text-muted-foreground inline-flex items-center gap-1.5'>
            <IconUsers className='h-4 w-4' />
            Follow stores for updates
          </span>
          <Link
            href='/shop'
            className='text-gold-strong dark:text-gold ml-auto inline-flex items-center gap-1 text-sm font-medium hover:underline'
          >
            Shop all products
            <IconArrowRight className='h-3.5 w-3.5' />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
