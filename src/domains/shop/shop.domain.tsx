'use client';
import { motion } from 'framer-motion';
import { ActiveFilter } from './components/active-filter';
import { FilterContent } from './components/filter-contemt';
import { ProductGrid } from './components/product-grid';
import { ShopToolbar } from './components/shop-toolbar';
import { useGetProducts } from '~/src/services/-products-get';
import { useProductFilters } from './useProductFilters';

export function ShopDomain() {
  const { apiParams } = useProductFilters();

  const { data } = useGetProducts(apiParams);
  const total = data?.data?.total ?? 0;
  return (
    <div className='bg-background min-h-screen'>
      <main className='pt-24 pb-24 lg:pt-32'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='mb-12'
          >
            <h1 className='text-4xl font-bold tracking-tight lg:text-5xl'>Shop All</h1>
            <p className='text-muted-foreground mt-4 max-w-2xl'>
              Explore our complete collection of premium products, curated for those who appreciate
              quality and timeless design.
            </p>
          </motion.div>

          {/* Toolbar */}
          <ShopToolbar total={total} />
          <ActiveFilter />

          {/* Main Content */}
          <div className='flex gap-12'>
            {/* Desktop Sidebar Filters */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='hidden w-64 shrink-0 lg:block'
            >
              <div className='sticky top-32'>
                <FilterContent />
              </div>
            </motion.aside>

            {/* Product Grid */}
            <ProductGrid products={data?.data?.products || []} />
          </div>
        </div>
      </main>
    </div>
  );
}
