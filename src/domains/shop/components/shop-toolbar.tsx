'use client';

import {
  IconArrowsHorizontal,
  IconLayoutGrid,
  IconLayoutGridRemove,
  IconSearch
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { sortOptions } from '@/lib/data';

import { useProductFilters } from '../useProductFilters';
import { FilterContent } from './filter-content';

interface ShopToolbarProps {
  total: number;
}

export function ShopToolbar(props: ShopToolbarProps) {
  const { total } = props;
  const {
    sortBy,
    searchQuery,
    gridCols,
    setSortBy,
    setSearchQuery,
    setGridCols,
    hasActiveFilters
  } = useProductFilters();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className='border-border mb-8 flex flex-col items-start justify-between gap-4 border-b pb-8 sm:flex-row sm:items-center'
    >
      <div className='flex w-full items-center gap-4 sm:w-auto'>
        {/* Mobile Filter Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='outline' className='gap-2 lg:hidden'>
              <IconArrowsHorizontal className='h-4 w-4' />
              Filters
              {hasActiveFilters && (
                <span className='bg-accent text-accent-foreground ml-1 flex h-5 w-5 items-center justify-center rounded-full text-xs'>
                  !
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='w-80'>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className='mt-6'>
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>

        {/* Search */}
        <div className='relative flex-1 sm:w-64 sm:flex-initial'>
          <IconSearch className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
          <Input
            placeholder='Search products...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <span className='text-muted-foreground hidden text-sm sm:block'>{total} products</span>
        {/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className='w-44 gap-2'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Grid Toggle */}
        <div className='border-border hidden items-center gap-1 rounded-lg border p-1 md:flex'>
          <Button
            variant={gridCols === 3 ? 'secondary' : 'ghost'}
            size='icon'
            className='h-8 w-8'
            onClick={() => setGridCols(3)}
          >
            <IconLayoutGridRemove className='h-4 w-4' />
          </Button>
          <Button
            variant={gridCols === 4 ? 'secondary' : 'ghost'}
            size='icon'
            className='h-8 w-8'
            onClick={() => setGridCols(4)}
          >
            <IconLayoutGrid className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
