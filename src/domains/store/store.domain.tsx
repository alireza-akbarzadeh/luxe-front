'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import {
  IconArrowsUpDown,
  IconBell,
  IconCalendar,
  IconCheckbox,
  IconChevronDown,
  IconFileHorizontal,
  IconFilter,
  IconGrid3x3,
  IconHeart,
  IconLayoutGrid,
  IconMapPin,
  IconPackage,
  IconRotateClockwise,
  IconSearch,
  IconShare2,
  IconStar,
  IconTruck,
  IconUsers,
  IconX
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ProductCard } from '../shop/components/product-card';
import { products, sortOptions, stores } from './data';
import { useStoreFilters } from './hooks/useStoreFilter';
import { useStoreStore } from './hooks/useStoreStore';

export function StoreDomain({ slug }: { slug: string }) {
  const store = stores.find((s) => s.slug === slug);

  if (!store) {
    notFound();
  }

  const storeProducts = products.filter((p) => p.storeId === store.id);
  const { followStore, unfollowStore, isFollowing, addRecentlyViewed } = useStoreStore();

  // Track store view
  useEffect(() => {
    addRecentlyViewed({
      id: store.id,
      name: store.name,
      slug: store.slug,
      logo: store.logo
    });
  }, [store.id, store.name, store.slug, store.logo, addRecentlyViewed]);

  const filters = useStoreFilters(store.categories);
  const {
    category,
    sortBy,
    priceRange,
    searchQuery,
    gridCols,
    showOnlyNew,
    showOnlySale,
    minRating,
    isDigital,
    setCategory,
    setSortBy,
    setPriceRange,
    setSearchQuery,
    setGridCols,
    setShowOnlyNew,
    setShowOnlySale,
    setMinRating,
    setIsDigital,
    clearFilters,
    hasActiveFilters,
    activeFilterCount
  } = filters;

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: false,
    more: false
  });

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = [...storeProducts];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Price filter
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter((p) => p.rating >= minRating);
    }

    // New arrivals filter
    if (showOnlyNew) {
      filtered = filtered.filter((p) => p.isNew);
    }

    // Sale filter
    if (showOnlySale) {
      filtered = filtered.filter((p) => p.originalPrice && p.originalPrice > p.price);
    }

    // Digital filter
    if (isDigital) {
      filtered = filtered.filter((p) => p.isDigital);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered = filtered.filter((p) => p.isNew).concat(filtered.filter((p) => !p.isNew));
        break;
      case 'price-asc':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  }, [
    storeProducts,
    searchQuery,
    category,
    priceRange,
    minRating,
    showOnlyNew,
    showOnlySale,
    isDigital,
    sortBy
  ]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const FilterSidebar = () => (
    <div className='space-y-6'>
      {/* Categories */}
      <Collapsible
        open={expandedSections.categories}
        onOpenChange={() => toggleSection('categories')}
      >
        <CollapsibleTrigger className='flex w-full items-center justify-between py-2'>
          <span className='font-medium'>Categories</span>
          <IconChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.categories ? 'rotate-180' : ''}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className='space-y-2 pt-2'>
          <button
            onClick={() => setCategory('')}
            className={`block w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
              category === '' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
            }`}
          >
            All Products ({storeProducts.length})
          </button>
          {store.categories.map((cat) => {
            const count = storeProducts.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`block w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                  category === cat ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </CollapsibleContent>
      </Collapsible>

      {/* Price Range */}
      <Collapsible open={expandedSections.price} onOpenChange={() => toggleSection('price')}>
        <CollapsibleTrigger className='flex w-full items-center justify-between py-2'>
          <span className='font-medium'>Price Range</span>
          <IconChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className='pt-4 pb-2'>
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            min={0}
            max={500}
            step={10}
            className='mb-4'
          />
          <div className='flex items-center justify-between text-sm'>
            <span className='bg-secondary rounded px-2 py-1'>${priceRange[0]}</span>
            <span className='text-muted-foreground'>to</span>
            <span className='bg-secondary rounded px-2 py-1'>${priceRange[1]}</span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Rating */}
      <Collapsible open={expandedSections.rating} onOpenChange={() => toggleSection('rating')}>
        <CollapsibleTrigger className='flex w-full items-center justify-between py-2'>
          <span className='font-medium'>Minimum Rating</span>
          <IconChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.rating ? 'rotate-180' : ''}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className='space-y-2 pt-2'>
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(minRating === rating ? 0 : rating)}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                minRating === rating ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
              }`}
            >
              <div className='flex items-center'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconStar
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < rating
                        ? minRating === rating
                          ? 'fill-primary-foreground text-primary-foreground'
                          : 'fill-accent text-accent'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <span>& up</span>
            </button>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Quick Filters */}
      <Collapsible open={expandedSections.more} onOpenChange={() => toggleSection('more')}>
        <CollapsibleTrigger className='flex w-full items-center justify-between py-2'>
          <span className='font-medium'>Quick Filters</span>
          <IconChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.more ? 'rotate-180' : ''}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className='space-y-3 pt-2'>
          <label className='flex cursor-pointer items-center gap-2'>
            <Checkbox
              checked={showOnlyNew}
              onCheckedChange={(checked) => setShowOnlyNew(checked as boolean)}
            />
            <span className='text-sm'>New Arrivals</span>
          </label>
          <label className='flex cursor-pointer items-center gap-2'>
            <Checkbox
              checked={showOnlySale}
              onCheckedChange={(checked) => setShowOnlySale(checked as boolean)}
            />
            <span className='text-sm'>On Sale</span>
          </label>
          {storeProducts.some((p) => p.isDigital) && (
            <label className='flex cursor-pointer items-center gap-2'>
              <Checkbox
                checked={isDigital}
                onCheckedChange={(checked) => setIsDigital(checked as boolean)}
              />
              <span className='text-sm'>Digital Products Only</span>
            </label>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant='outline' className='w-full' onClick={clearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Store Header */}
      <section className='relative pt-20'>
        {/* Banner */}
        <div className='relative h-48 overflow-hidden md:h-64'>
          <Image src={store.banner} alt={store.name} fill className='object-cover' priority />
          <div className='from-background via-background/50 absolute inset-0 bg-linear-to-t to-transparent' />
        </div>

        {/* Store Info */}
        <div className='relative mx-auto -mt-16 max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col items-start gap-4 md:flex-row md:items-end md:gap-6'>
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className='border-background relative h-24 w-24 overflow-hidden rounded-2xl border-4 shadow-lg md:h-32 md:w-32'
            >
              <Image src={store.logo} alt={store.name} fill className='object-cover' />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='flex-1'
            >
              <div className='mb-1 flex items-center gap-2'>
                <h1 className='text-2xl font-bold md:text-3xl'>{store.name}</h1>
                {store.isVerified && <IconCheckbox className='h-6 w-6 text-blue-500' />}
              </div>
              <p className='text-muted-foreground max-w-2xl'>{store.description}</p>

              {/* Stats */}
              <div className='mt-3 flex flex-wrap items-center gap-4 text-sm'>
                <div className='flex items-center gap-1'>
                  <IconStar className='fill-accent text-accent h-4 w-4' />
                  <span className='font-medium'>{store.rating}</span>
                  <span className='text-muted-foreground'>({store.reviewCount} reviews)</span>
                </div>
                <div className='text-muted-foreground flex items-center gap-1'>
                  <IconPackage className='h-4 w-4' />
                  <span>{store.productCount} products</span>
                </div>
                <div className='text-muted-foreground flex items-center gap-1'>
                  <IconUsers className='h-4 w-4' />
                  <span>{(store.followerCount / 1000).toFixed(1)}k followers</span>
                </div>
                <div className='text-muted-foreground flex items-center gap-1'>
                  <IconMapPin className='h-4 w-4' />
                  <span>{store.location}</span>
                </div>
                <div className='text-muted-foreground flex items-center gap-1'>
                  <IconCalendar className='h-4 w-4' />
                  <span>Since {new Date(store.joinedDate).getFullYear()}</span>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className='mt-4 flex items-center gap-2 md:mt-0'
            >
              <Button
                variant={isFollowing(store.id) ? 'secondary' : 'default'}
                onClick={() =>
                  isFollowing(store.id) ? unfollowStore(store.id) : followStore(store.id)
                }
                className='gap-2'
              >
                {isFollowing(store.id) ? (
                  <>
                    <IconBell className='h-4 w-4' />
                    Following
                  </>
                ) : (
                  <>
                    <IconHeart className='h-4 w-4' />
                    Follow
                  </>
                )}
              </Button>
              <Button variant='outline' size='icon'>
                <IconShare2 className='h-4 w-4' />
              </Button>
            </motion.div>
          </div>

          {/* Store Policies */}
          <div className='border-border mt-6 flex flex-wrap gap-4 border-b pb-6'>
            <div className='text-muted-foreground flex items-center gap-2 text-sm'>
              <IconTruck className='h-4 w-4' />
              <span>{store.shippingInfo}</span>
            </div>
            <div className='text-muted-foreground flex items-center gap-2 text-sm'>
              <IconRotateClockwise className='h-4 w-4' />
              <span>{store.returnPolicy}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className='py-8'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          {/* Toolbar */}
          <div className='mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
            {/* Search */}
            <div className='relative w-full sm:w-80'>
              <IconSearch className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
              <Input
                type='text'
                placeholder='Search products...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>

            <div className='flex w-full items-center gap-3 sm:w-auto'>
              {/* Mobile Filter Button */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant='outline' className='gap-2 lg:hidden'>
                    <IconFileHorizontal className='h-4 w-4' />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant='secondary' className='ml-1'>
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side='left' className='w-80'>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className='mt-6'>
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                <SelectTrigger className='w-45'>
                  <IconArrowsUpDown className='mr-2 h-4 w-4' />
                  <SelectValue />
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
              <div className='border-border hidden items-center rounded-lg border p-1 sm:flex'>
                <Button
                  variant={gridCols === 3 ? 'secondary' : 'ghost'}
                  size='sm'
                  onClick={() => setGridCols(3)}
                  className='h-8 w-8 p-0'
                >
                  <IconLayoutGrid className='h-4 w-4' />
                </Button>
                <Button
                  variant={gridCols === 4 ? 'secondary' : 'ghost'}
                  size='sm'
                  onClick={() => setGridCols(4)}
                  className='h-8 w-8 p-0'
                >
                  <IconGrid3x3 className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <AnimatePresence>
            {hasActiveFilters && (
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
                    &quot;{searchQuery}&quot;
                    <button onClick={() => setSearchQuery('')}>
                      <IconX className='h-3 w-3' />
                    </button>
                  </Badge>
                )}
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={clearFilters}
                  className='text-muted-foreground'
                >
                  Clear all
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className='flex gap-8'>
            {/* Desktop Sidebar */}
            <aside className='hidden w-64 shrink-0 lg:block'>
              <div className='sticky top-24'>
                <h2 className='mb-4 flex items-center gap-2 font-semibold'>
                  <IconFilter className='h-4 w-4' />
                  Filters
                </h2>
                <FilterSidebar />
              </div>
            </aside>

            {/* Products Grid */}
            <div className='flex-1'>
              <div className='mb-4 flex items-center justify-between'>
                <p className='text-muted-foreground text-sm'>
                  Showing {filteredProducts.length} of {storeProducts.length} products
                </p>
              </div>

              {filteredProducts.length > 0 ? (
                <motion.div
                  layout
                  className={`grid gap-4 ${
                    gridCols === 3
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                  }`}
                >
                  <AnimatePresence mode='popLayout'>
                    {filteredProducts.map((product, index) => (
                      // @ts-ignore
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='py-16 text-center'
                >
                  <div className='bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
                    <IconPackage className='text-muted-foreground h-8 w-8' />
                  </div>
                  <h3 className='text-lg font-medium'>No products found</h3>
                  <p className='text-muted-foreground mt-1'>
                    Try adjusting your filters to find what you&apos;re looking for.
                  </p>
                  <Button variant='outline' className='mt-4' onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
