// components/active-filters.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX } from '@tabler/icons-react';
import { useStoreFilters } from '../hooks/useStoreFilter';

export function ActiveFilters() {
  const {
    category,
    setCategory,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    showOnlyNew,
    setShowOnlyNew,
    showOnlySale,
    setShowOnlySale,
    isDigital,
    setIsDigital,
    searchQuery,
    setSearchQuery,
    hasActiveFilters,
    clearFilters
  } = useStoreFilters([]);

  if (!hasActiveFilters) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className='mb-6 flex flex-wrap items-center gap-2'
      >
        <span className='text-muted-foreground text-sm'>Active filters:</span>
        {category && (
          <Badge variant='secondary' className='gap-1'>
            {category}
            <button onClick={() => setCategory('')}>
              <IconX className='h-3 w-3' />
            </button>
          </Badge>
        )}
        {(priceRange[0] > 0 || priceRange[1] < 500) && (
          <Badge variant='secondary' className='gap-1'>
            ${priceRange[0]} - ${priceRange[1]}
            <button onClick={() => setPriceRange([0, 500])}>
              <IconX className='h-3 w-3' />
            </button>
          </Badge>
        )}
        {minRating > 0 && (
          <Badge variant='secondary' className='gap-1'>
            {minRating}+ stars
            <button onClick={() => setMinRating(0)}>
              <IconX className='h-3 w-3' />
            </button>
          </Badge>
        )}
        {showOnlyNew && (
          <Badge variant='secondary' className='gap-1'>
            New Arrivals
            <button onClick={() => setShowOnlyNew(false)}>
              <IconX className='h-3 w-3' />
            </button>
          </Badge>
        )}
        {showOnlySale && (
          <Badge variant='secondary' className='gap-1'>
            On Sale
            <button onClick={() => setShowOnlySale(false)}>
              <IconX className='h-3 w-3' />
            </button>
          </Badge>
        )}
        {isDigital && (
          <Badge variant='secondary' className='gap-1'>
            Digital Only
            <button onClick={() => setIsDigital(false)}>
              <IconX className='h-3 w-3' />
            </button>
          </Badge>
        )}
        {searchQuery && (
          <Badge variant='secondary' className='gap-1'>
            "{searchQuery}"
            <button onClick={() => setSearchQuery('')}>
              <IconX className='h-3 w-3' />
            </button>
          </Badge>
        )}
        <Button variant='ghost' size='sm' onClick={clearFilters} className='text-muted-foreground'>
          Clear all
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
