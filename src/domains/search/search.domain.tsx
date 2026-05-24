'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ProductCard } from '@/domains/shop/components/product-card';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

import {
    IconClock,
    IconFilter2,
    IconGrid3x3,
    IconHeart,
    IconList,
    IconSearch,
    IconShoppingCart,
    IconStar,
    IconX
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { products, stores } from '../store/data';
import { SearchFilterContent } from './components/search-filter-content';
import { SearchHero } from './containers/search-hero';
import { useSearchParams } from './hooks/useSearchParams';
import { useSearchStore } from './search.store';

const sortOptions = [
    { label: 'Most Relevant', value: 'relevance' },
    { label: 'Newest First', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Highest Rated', value: 'rating' },
    { label: 'Most Popular', value: 'popular' }
];

export default function SearchDomain() {
    const searchParams = useSearchParams();
    const searchStore = useSearchStore();

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search query
        if (searchParams.query) {
            const q = searchParams.query.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q) ||
                    p.description?.toLowerCase().includes(q)
            );
        }

        // Category filter
        if (searchParams.categories.length > 0) {
            result = result.filter((p) =>
                searchParams.categories.some((c) => p.category.toLowerCase() === c.toLowerCase())
            );
        }

        // Store filter
        if (searchParams.stores.length > 0) {
            result = result.filter((p) => searchParams.stores.includes(p.storeId));
        }

        // Price range
        result = result.filter(
            (p) => p.price >= searchParams.priceRange[0] && p.price <= searchParams.priceRange[1]
        );

        // Rating filter
        if (searchParams.minRating > 0) {
            result = result.filter((p) => p.rating >= searchParams.minRating);
        }

        // On sale
        if (searchParams.onSale) {
            result = result.filter((p) => p.originalPrice && p.originalPrice > p.price);
        }

        // New arrivals
        if (searchParams.isNew) {
            result = result.filter((p) => p.isNew);
        }

        // Digital products
        if (searchParams.isDigital) {
            result = result.filter((p) => p.isDigital);
        }

        // Sort
        switch (searchParams.sortBy) {
            case 'newest':
                result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'popular':
                result.sort((a, b) => b.reviews - a.reviews);
                break;
            default:
                // relevance - keep original order or sort by match quality
                if (searchParams.query) {
                    const q = searchParams.query.toLowerCase();
                    result.sort((a, b) => {
                        const aNameMatch = a.name.toLowerCase().startsWith(q)
                            ? 2
                            : a.name.toLowerCase().includes(q)
                                ? 1
                                : 0;
                        const bNameMatch = b.name.toLowerCase().startsWith(q)
                            ? 2
                            : b.name.toLowerCase().includes(q)
                                ? 1
                                : 0;
                        return bNameMatch - aNameMatch;
                    });
                }
        }

        return result;
    }, [searchParams]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / searchParams.perPage);
    const paginatedProducts = filteredProducts.slice(
        (searchParams.page - 1) * searchParams.perPage,
        searchParams.page * searchParams.perPage
    );

    // Recently viewed products
    const recentlyViewedProducts = products.filter((p) =>
        searchStore.recentlyViewedProducts.includes(p.id)
    );

    return (
        <>
            {/* Search Hero */}
            <SearchHero filteredProducts={filteredProducts} />
            {/* Results Section */}
            <section className='mx-auto max-w-7xl px-4 py-8'>
                <div className='flex flex-col gap-8 lg:flex-row'>
                    {/* Desktop Filters Sidebar */}
                    <aside className='hidden w-64 shrink-0 lg:block'>
                        <div className='bg-card sticky top-24 rounded-2xl border p-6'>
                            <h2 className='mb-4 flex items-center gap-2 font-semibold'>
                                <IconFilter2 className='h-4 w-4' />
                                Filters
                                {searchParams.activeFilterCount > 0 && (
                                    <Badge variant='secondary' className='ml-auto'>
                                        {searchParams.activeFilterCount}
                                    </Badge>
                                )}
                            </h2>
                            <SearchFilterContent />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className='flex-1'>
                        {/* Results Header */}
                        <div className='mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
                            <div>
                                <h2 className='text-lg font-semibold'>
                                    {searchParams.query ? (
                                        <>Results for &quot;{searchParams.query}&quot;</>
                                    ) : (
                                        'All Products'
                                    )}
                                </h2>
                                <p className='text-muted-foreground text-sm'>
                                    {filteredProducts.length} products found
                                </p>
                            </div>

                            <div className='flex items-center gap-2'>
                                {/* Mobile Filter Button */}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant='outline' size='sm' className='lg:hidden'>
                                            <IconFilter2 className='mr-2 h-4 w-4' />
                                            Filters
                                            {searchParams.activeFilterCount > 0 && (
                                                <Badge variant='secondary' className='ml-2'>
                                                    {searchParams.activeFilterCount}
                                                </Badge>
                                            )}
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side='left' className='w-80'>
                                        <SheetHeader>
                                            <SheetTitle>Filters</SheetTitle>
                                        </SheetHeader>
                                        <div className='mt-6'>
                                            <SearchFilterContent />
                                        </div>
                                    </SheetContent>
                                </Sheet>

                                {/* Sort */}
                                <Select
                                    value={searchParams.sortBy}
                                    onValueChange={(v) => searchParams.setSortBy(v as any)}
                                >
                                    <SelectTrigger className='w-44'>
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

                                {/* View Mode */}
                                <div className='hidden items-center rounded-lg border p-1 sm:flex'>
                                    <Button
                                        variant={searchParams.view === 'grid' ? 'secondary' : 'ghost'}
                                        size='icon'
                                        className='h-8 w-8'
                                        onClick={() => searchParams.setView('grid')}
                                    >
                                        <IconGrid3x3 className='h-4 w-4' />
                                    </Button>
                                    <Button
                                        variant={searchParams.view === 'list' ? 'secondary' : 'ghost'}
                                        size='icon'
                                        className='h-8 w-8'
                                        onClick={() => searchParams.setView('list')}
                                    >
                                        <IconList className='h-4 w-4' />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {searchParams.hasActiveFilters && (
                            <div className='mb-6 flex flex-wrap items-center gap-2'>
                                <span className='text-muted-foreground text-sm'>Active filters:</span>
                                {searchParams.categories.map((cat) => (
                                    <Badge
                                        key={cat}
                                        variant='secondary'
                                        className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
                                        onClick={() => searchParams.toggleCategory(cat)}
                                    >
                                        {cat}
                                        <IconX className='ml-1 h-3 w-3' />
                                    </Badge>
                                ))}
                                {searchParams.stores.map((storeId) => {
                                    const store = stores.find((s) => s.id === storeId);
                                    return (
                                        <Badge
                                            key={storeId}
                                            variant='secondary'
                                            className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
                                            onClick={() => searchParams.toggleStore(storeId)}
                                        >
                                            {store?.name || storeId}
                                            <IconX className='ml-1 h-3 w-3' />
                                        </Badge>
                                    );
                                })}
                                {(searchParams.priceRange[0] > 0 || searchParams.priceRange[1] < 1000) && (
                                    <Badge
                                        variant='secondary'
                                        className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
                                        onClick={() => searchParams.setPriceRange([0, 1000])}
                                    >
                                        ${searchParams.priceRange[0]} - ${searchParams.priceRange[1]}
                                        <IconX className='ml-1 h-3 w-3' />
                                    </Badge>
                                )}
                                {searchParams.minRating > 0 && (
                                    <Badge
                                        variant='secondary'
                                        className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
                                        onClick={() => searchParams.setMinRating(0)}
                                    >
                                        {searchParams.minRating}+ stars
                                        <IconX className='ml-1 h-3 w-3' />
                                    </Badge>
                                )}
                                {searchParams.onSale && (
                                    <Badge
                                        variant='secondary'
                                        className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
                                        onClick={() => searchParams.setOnSale(false)}
                                    >
                                        On Sale
                                        <IconX className='ml-1 h-3 w-3' />
                                    </Badge>
                                )}
                                {searchParams.isNew && (
                                    <Badge
                                        variant='secondary'
                                        className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
                                        onClick={() => searchParams.setIsNew(false)}
                                    >
                                        New Arrivals
                                        <IconX className='ml-1 h-3 w-3' />
                                    </Badge>
                                )}
                                {searchParams.isDigital && (
                                    <Badge
                                        variant='secondary'
                                        className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
                                        onClick={() => searchParams.setIsDigital(false)}
                                    >
                                        Digital
                                        <IconX className='ml-1 h-3 w-3' />
                                    </Badge>
                                )}
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    className='text-primary'
                                    onClick={searchParams.clearFilters}
                                >
                                    Clear all
                                </Button>
                            </div>
                        )}

                        {/* Products Grid/List */}
                        {paginatedProducts.length > 0 ? (
                            <>
                                <div
                                    className={
                                        searchParams.view === 'grid'
                                            ? 'grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-3 xl:grid-cols-4'
                                            : 'flex flex-col gap-4'
                                    }
                                >
                                    {paginatedProducts.map((product, index) =>
                                        searchParams.view === 'grid' ? (
                                            <ProductCard key={product.id} product={product} index={index} />
                                        ) : (
                                            <motion.div
                                                key={product.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <Link
                                                    href={`/product/${product.id}`}
                                                    className='bg-card group flex gap-4 rounded-xl border p-4 transition-shadow hover:shadow-lg'
                                                >
                                                    <div className='bg-secondary relative h-32 w-32 shrink-0 overflow-hidden rounded-lg'>
                                                        <Image
                                                            src={product.image}
                                                            alt={product.name}
                                                            fill
                                                            className='object-cover transition-transform duration-500 group-hover:scale-105'
                                                        />
                                                        {product.isNew && (
                                                            <Badge className='absolute top-2 left-2' variant='secondary'>
                                                                New
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className='min-w-0 flex-1'>
                                                        <span className='text-muted-foreground text-xs tracking-wider uppercase'>
                                                            {product.category}
                                                        </span>
                                                        <h3 className='group-hover:text-primary mt-1 font-semibold transition-colors'>
                                                            {product.name}
                                                        </h3>
                                                        <p className='text-muted-foreground mt-1 line-clamp-2 text-sm'>
                                                            {product.description}
                                                        </p>
                                                        <div className='mt-2 flex items-center gap-4'>
                                                            <div className='flex items-center gap-1'>
                                                                <IconStar className='fill-accent text-accent h-4 w-4' />
                                                                <span className='text-sm'>
                                                                    {product.rating} ({product.reviews})
                                                                </span>
                                                            </div>
                                                            <div className='flex items-center gap-2'>
                                                                <span className='font-semibold'>${product.price}</span>
                                                                {product.originalPrice && (
                                                                    <span className='text-muted-foreground text-sm line-through'>
                                                                        ${product.originalPrice}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-col justify-center gap-2'>
                                                        <Button size='icon' variant='outline'>
                                                            <IconHeart className='h-4 w-4' />
                                                        </Button>
                                                        <Button size='icon'>
                                                            <IconShoppingCart className='h-4 w-4' />
                                                        </Button>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        )
                                    )}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className='mt-8 flex items-center justify-center gap-2'>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            disabled={searchParams.page === 1}
                                            onClick={() => searchParams.setPage(searchParams.page - 1)}
                                        >
                                            Previous
                                        </Button>
                                        <div className='flex items-center gap-1'>
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum: number;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (searchParams.page <= 3) {
                                                    pageNum = i + 1;
                                                } else if (searchParams.page >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = searchParams.page - 2 + i;
                                                }
                                                return (
                                                    <Button
                                                        key={pageNum}
                                                        variant={searchParams.page === pageNum ? 'default' : 'outline'}
                                                        size='sm'
                                                        className='w-10'
                                                        onClick={() => searchParams.setPage(pageNum)}
                                                    >
                                                        {pageNum}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            disabled={searchParams.page === totalPages}
                                            onClick={() => searchParams.setPage(searchParams.page + 1)}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='py-16 text-center'
                            >
                                <div className='bg-secondary mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full'>
                                    <IconSearch className='text-muted-foreground h-10 w-10' />
                                </div>
                                <h3 className='mb-2 text-xl font-semibold'>No products found</h3>
                                <p className='text-muted-foreground mx-auto mb-6 max-w-md'>
                                    {searchParams.query
                                        ? `We couldn't find any products matching "${searchParams.query}". Try adjusting your search or filters.`
                                        : 'No products match your current filters. Try removing some filters.'}
                                </p>
                                <div className='flex flex-col justify-center gap-2 sm:flex-row'>
                                    <Button onClick={searchParams.clearAll}>Clear All</Button>
                                    <Button variant='outline' asChild>
                                        <Link href='/shop'>Browse All Products</Link>
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Recently Viewed */}
                {recentlyViewedProducts.length > 0 && (
                    <section className='mt-16 border-t pt-8'>
                        <div className='mb-6 flex items-center justify-between'>
                            <h2 className='flex items-center gap-2 text-xl font-semibold'>
                                <IconClock className='h-5 w-5' />
                                Recently Viewed
                            </h2>
                            <Button variant='ghost' size='sm' onClick={searchStore.clearRecentlyViewedProducts}>
                                Clear
                            </Button>
                        </div>
                        <div className='grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6'>
                            {recentlyViewedProducts.slice(0, 6).map((product, index) => (
                                <ProductCard key={product.id} product={product} index={index} />
                            ))}
                        </div>
                    </section>
                )}
            </section>
        </>
    );
}
