'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/domains/shop/components/product-card';
import { motion } from 'framer-motion';

import { IconHeart, IconSearch, IconShoppingCart, IconStar } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from '../hooks/useSearchParams';

interface ProductGridListProps {
  //   filteredProducts: ProductCardProps['product'][];
  filteredProducts: {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    rating: number;
    reviews: number;
    image: string;
    category: string;
    isNew: boolean;
    isDigital: boolean;
    storeId: string;
    description: string;
  }[];
}

export function ProductGridList(props: ProductGridListProps) {
  const { filteredProducts } = props;
  const searchParams = useSearchParams();
  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / searchParams.perPage);
  const paginatedProducts = filteredProducts.slice(
    (searchParams.page - 1) * searchParams.perPage,
    searchParams.page * searchParams.perPage
  );

  return (
    <>
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
    </>
  );
}
