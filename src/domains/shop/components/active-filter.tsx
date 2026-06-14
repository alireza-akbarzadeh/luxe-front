'use client';

import { IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';

import { useGetCategories } from '~/src/services/-categories-get';

import { useProductFilters } from '../useProductFilters';

export function ActiveFilter() {
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
          {/* Category badge (if any) */}
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
              Search: &ldquo;{searchQuery}&rdquo;
              <button onClick={() => setSearchQuery('')} className='hover:text-foreground'>
                <IconX className='h-3 w-3' />
              </button>
            </motion.span>
          )}

          {/* New arrivals */}
          {showOnlyNew && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className='bg-secondary inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm'
            >
              New Arrivals
              <button onClick={() => setShowOnlyNew(false)} className='hover:text-foreground'>
                <IconX className='h-3 w-3' />
              </button>
            </motion.span>
          )}

          {/* On sale (client‑side only, but we keep it) */}
          {showOnlySale && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className='bg-secondary inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm'
            >
              On Sale
              <button onClick={() => setShowOnlySale(false)} className='hover:text-foreground'>
                <IconX className='h-3 w-3' />
              </button>
            </motion.span>
          )}

          {/* Price range */}
          {(priceRange[0] > 0 || priceRange[1] < 500) && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className='bg-secondary inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm'
            >
              ${priceRange[0]} - ${priceRange[1]}
              <button onClick={() => setPriceRange([0, 500])} className='hover:text-foreground'>
                <IconX className='h-3 w-3' />
              </button>
            </motion.span>
          )}

          {/* Rating range */}
          {(minRating > 0 || maxRating < 5) && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className='bg-secondary inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm'
            >
              Rating: {minRating} – {maxRating} ★
              <button onClick={() => setRatingRange(0, 5)} className='hover:text-foreground'>
                <IconX className='h-3 w-3' />
              </button>
            </motion.span>
          )}

          {/* Reviews count range */}
          {(minReviews > 0 || maxReviews < 1000) && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className='bg-secondary inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm'
            >
              Reviews: {minReviews} – {maxReviews}
              <button onClick={() => setReviewsRange(0, 1000)} className='hover:text-foreground'>
                <IconX className='h-3 w-3' />
              </button>
            </motion.span>
          )}

          {/* Digital products only */}
          {isDigital && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className='bg-secondary inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm'
            >
              Digital Only
              <button onClick={() => setIsDigital(false)} className='hover:text-foreground'>
                <IconX className='h-3 w-3' />
              </button>
            </motion.span>
          )}

          {/* Clear all button */}
          <button
            onClick={clearFilters}
            className='text-muted-foreground hover:text-foreground text-sm underline transition-colors'
          >
            Clear all
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
