'use client';

import { IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { cn } from '@/lib/utils';
import { useGetCategories } from '~/src/services/-categories-get';

import { useProductFilters } from '../useProductFilters';

export function ActiveFilter() {
  const t = useTranslations('shop.activeFilters');
  const { formatPrice, formatDecimal, formatInteger, moneyClassName } = useLocaleFormatters();
  const {
    categoryId,
    priceRange,
    showOnlyNew,
    showOnlySale,
    minRating,
    maxRating,
    minReviews,
    maxReviews,
    isDigital,
    searchQuery,
    hasActiveFilters,
    setCategoryId,
    setPriceRange,
    setSearchQuery,
    setShowOnlyNew,
    setShowOnlySale,
    setRatingRange,
    setReviewsRange,
    setIsDigital,
    clearFilters
  } = useProductFilters();

  const { data: categoriesData } = useGetCategories();
  const categories = categoriesData?.data?.categories ?? [];
  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <AnimatePresence>
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className='mb-8 flex flex-wrap gap-2'
        >
          {categoryId > 0 && selectedCategory && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className='bg-secondary inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm'
            >
              {selectedCategory.name}
              <button onClick={() => setCategoryId(null)} className='hover:text-foreground'>
                <IconX className='h-3 w-3' />
              </button>
            </motion.span>
          )}

          {searchQuery && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className='bg-secondary inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm'
            >
              {t('search', { query: searchQuery })}
              <button onClick={() => setSearchQuery('')} className='hover:text-foreground'>
                <IconX className='h-3 w-3' />
              </button>
            </motion.span>
          )}

          {showOnlyNew && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className='bg-secondary inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm'
            >
              {t('newArrivals')}
              <button onClick={() => setShowOnlyNew(false)} className='hover:text-foreground'>
                <IconX className='h-3 w-3' />
              </button>
            </motion.span>
          )}

          {showOnlySale && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className='bg-secondary inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm'
            >
              {t('onSale')}
              <button onClick={() => setShowOnlySale(false)} className='hover:text-foreground'>
                <IconX className='h-3 w-3' />
              </button>
            </motion.span>
          )}

          {(priceRange[0] > 0 || priceRange[1] < 500) && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={cn(
                'bg-secondary inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm tabular-nums',
                moneyClassName
              )}
            >
              {t('priceRange', {
                min: formatPrice(priceRange[0]),
                max: formatPrice(priceRange[1])
              })}
              <button onClick={() => setPriceRange([0, 500])} className='hover:text-foreground'>
                <IconX className='h-3 w-3' />
              </button>
            </motion.span>
          )}

          {(minRating > 0 || maxRating < 5) && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className='bg-secondary inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm tabular-nums'
            >
              {t('ratingRange', {
                min: formatDecimal(minRating),
                max: formatDecimal(maxRating)
              })}{' '}
              ★
              <button onClick={() => setRatingRange(0, 5)} className='hover:text-foreground'>
                <IconX className='h-3 w-3' />
              </button>
            </motion.span>
          )}

          {(minReviews > 0 || maxReviews < 1000) && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className='bg-secondary inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm tabular-nums'
            >
              {t('reviewsRange', {
                min: formatInteger(minReviews),
                max: formatInteger(maxReviews)
              })}
              <button onClick={() => setReviewsRange(0, 1000)} className='hover:text-foreground'>
                <IconX className='h-3 w-3' />
              </button>
            </motion.span>
          )}

          {isDigital && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className='bg-secondary inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm'
            >
              {t('digitalOnly')}
              <button onClick={() => setIsDigital(false)} className='hover:text-foreground'>
                <IconX className='h-3 w-3' />
              </button>
            </motion.span>
          )}

          <button
            onClick={clearFilters}
            className='text-muted-foreground hover:text-foreground text-sm underline transition-colors'
          >
            {t('clearAll')}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
