// components/products-grid.tsx
import { IconPackage } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import type { DtoProductResponse } from '@/services/-stores-{slug}-products-get.schemas';

import { ProductCard } from '../../shop/components/product-card';
import { useStoreFilters } from '../hooks/useStoreFilter';

interface ProductsGridProps {
  apiProducts: DtoProductResponse[];
  totalProducts: number;
}

export function StoreProductsGrid({ apiProducts, totalProducts }: ProductsGridProps) {
  const { showOnlySale, gridCols, clearFilters } = useStoreFilters([]);

  const filteredProducts = showOnlySale
    ? apiProducts.filter((p) => p.compare_at_price && p.compare_at_price > (p.price ?? 0))
    : apiProducts;

  const adaptedProducts = filteredProducts.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    compare_at_price: product.compare_at_price,
    rating: product.rating ?? 0,
    reviews_count: product.reviews_count ?? 0,
    is_new: product.is_new ?? false,
    images: product.images ?? [],
    category: product.category
      ? {
          name: product.category.name ?? '',
          slug: product.category.slug ?? '',
          id: product.category.id ?? 0
        }
      : undefined,
    colors: product.colors ?? [],
    sizes: product.sizes ?? [],
    sku: product.sku ?? '',
    slug: product.slug ?? '',
    stock: product.stock ?? 0,
    status: product.status ?? 'active',
    description: product.description ?? '',
    // FIXME: apis should handle like
    isLike: false
  }));

  if (adaptedProducts.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='py-16 text-center'>
        <div className='bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
          <IconPackage className='text-muted-foreground h-8 w-8' />
        </div>
        <h3 className='text-lg font-medium'>No products found</h3>
        <p className='text-muted-foreground mt-1'>
          Try adjusting your filters to find what you're looking for.
        </p>
        <Button variant='outline' className='mt-4' onClick={clearFilters}>
          Clear All Filters
        </Button>
      </motion.div>
    );
  }

  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <p className='text-muted-foreground text-sm'>
          Showing {adaptedProducts.length} of {totalProducts} products
        </p>
      </div>
      <motion.div
        layout
        className={`grid gap-4 ${
          gridCols === 3
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
        }`}
      >
        <AnimatePresence mode='popLayout'>
          {adaptedProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} priority={index === 0} />
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
