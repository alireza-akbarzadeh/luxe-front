'use client';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { useProductFilters } from '../useProductFilters';
import { ProductCard } from './prodcut-card';
import type { GetProducts200DataProductsItem } from '~/src/services/-products-get.schemas';

interface ProductGridDataProps {
  products: GetProducts200DataProductsItem[];
}

export function ProductGrid(props: ProductGridDataProps) {
  const { products } = props;
  const { gridCols, clearFilters } = useProductFilters();
  const mappedProduct = products?.map((p) => ({
    ...p.items,
    isLike: p.is_liked || false
  }));
  return (
    <div className='flex-1'>
      {products?.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='py-20 text-center'>
          <p className='text-muted-foreground mb-4'>No products found matching your criteria.</p>
          <Button variant='outline' onClick={clearFilters}>
            Clear Filters
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`grid gap-6 ${
            gridCols === 3
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}
        >
          <AnimatePresence mode='popLayout'>
            {mappedProduct?.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
