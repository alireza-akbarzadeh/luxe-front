'use client';
import { motion } from 'framer-motion';
import { useStoresFilters } from '../hooks/useStoresFilter';

import { TRENDING_CATEGORIES } from '../constants';
import { CategoryPill } from '../components/category-pill';
import { Input } from '@/components/ui/input';
import { stagger, fadeUp } from '../store.utils';
import { IconSearch, IconSparkles } from '@tabler/icons-react';

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
    <section className='border-border relative isolate overflow-hidden border-b'>
      <div className='absolute inset-0 -z-10'>
        <div className='from-accent/30 absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-to-br via-fuchsia-500/20 to-sky-500/20 blur-3xl' />
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_60%)]'
        />
      </div>
      <motion.div
        variants={stagger}
        initial='hidden'
        animate='show'
        className='mx-auto flex max-w-screen-2xl flex-col items-center px-4 py-20 text-center lg:py-28'
      >
        <motion.div
          variants={fadeUp}
          className='border-border bg-card/60 glass mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs'
        >
          <IconSparkles className='text-accent h-3.5 w-3.5' />
          <span className='text-muted-foreground'>Curated brands · Updated daily</span>
        </motion.div>
        <motion.h1
          variants={fadeUp}
          className='max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl'
        >
          Discover stores you'll{' '}
          <span className='from-accent bg-gradient-to-r to-fuchsia-500 bg-clip-text text-transparent'>
            love
          </span>
          .
        </motion.h1>
        <motion.p variants={fadeUp} className='text-muted-foreground mt-4 max-w-xl text-balance'>
          A curated marketplace of verified brands and independent makers — handpicked for taste,
          quality, and craft.
        </motion.p>
        <motion.div variants={fadeUp} className='mt-8 w-full max-w-xl'>
          <div className='glass relative flex items-center rounded-full px-4 py-1 shadow-lg'>
            <IconSearch className='text-muted-foreground h-4 w-4' />
            <Input
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
              placeholder='Search brands, stores, categories…'
              aria-label='Search stores'
              className='border-0 bg-transparent text-base shadow-none focus-visible:ring-0'
            />
          </div>
        </motion.div>
        <motion.div
          variants={fadeUp}
          className='mt-8 flex flex-wrap items-center justify-center gap-2'
        >
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
    </section>
  );
}
