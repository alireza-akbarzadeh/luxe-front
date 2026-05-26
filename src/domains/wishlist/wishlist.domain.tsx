import {
  IconArrowRight,
  IconHeart,
  IconPackage,
  IconShoppingCart,
  IconTrash,
  IconX
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { Empty } from '@/components/empty';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCartController } from '@/hooks/useCartController';
import { AnalyticalStats } from '~/src/domains/wishlist/components/analytical-stats';
import useWishlistStore from '~/src/domains/wishlist/wishlist.store';
import { useGetAccountWishlist } from '~/src/services/-account-wishlist-get';

import { useCompareStore } from '../compare/compare.store';
import { WishlistHeader } from './components/wishlist-header';

export function WishlistDomain() {
  const { selectedItems, setSelectedItems, sortBy, viewMode, removeItem, toggleSelectItem } =
    useWishlistStore();

  const { addItem: addToCart } = useCartController();
  const { addItem: addToCompare, isInCompare, canAddMore } = useCompareStore();

  // Fetching live data via API Hook
  const {
    data: response,
    isLoading,
    isError,
    error
  } = useGetAccountWishlist({
    limit: 50,
    offset: 0,
    sort: sortBy
  });

  // Extract relevant arrays safely matching DtoWishlistResponseData schema
  const items = response?.data?.items ?? [];
  const totalItems = response?.data?.total ?? 0;

  // Handle derived metadata calculations safely on every render using reduce
  const { totalSavings, priceDropsCount } = items.reduce(
    (accumulator, item) => {
      if (item.old_price && item.price && item.old_price > item.price) {
        accumulator.totalSavings += item.old_price - item.price;
        accumulator.priceDropsCount += 1;
      }
      return accumulator;
    },
    { totalSavings: 0, priceDropsCount: 0 }
  );

  if (isLoading) {
    return (
      <div className='app-container flex min-h-[400px] items-center justify-center py-8 pt-24'>
        <div className='text-muted-foreground animate-pulse text-sm'>Loading wishlist...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='app-container flex min-h-[400px] flex-col items-center justify-center gap-4 py-8 pt-24'>
        <p className='text-destructive font-medium'>Failed to load your wishlist</p>
        <p className='text-muted-foreground text-xs'>
          {error instanceof Error ? error.message : 'An unexpected error occurred.'}
        </p>
      </div>
    );
  }

  const isEmpty = items.length === 0;

  return (
    <div className='app-container space-y-4 py-8 pt-24'>
      <WishlistHeader itemLength={totalItems} />

      {isEmpty ? (
        <Empty
          title='Your wishlist is empty'
          description='Start saving items you love'
          icon={IconHeart}
          content={
            <Link href='/shop'>
              <Button size='lg' className='gap-2 rounded-full'>
                Explore Products
                <IconArrowRight className='h-4 w-4' />
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          {/* Analytical Stats */}
          <AnalyticalStats
            priceDropsCount={priceDropsCount}
            totalItems={totalItems}
            totalSavings={totalSavings}
          />

          {/* Interactive Action Toolbar Component can go here */}

          {/* Core Content Layout View Switcher */}
          <AnimatePresence mode='popLayout'>
            {viewMode === 'grid' ? (
              <motion.div
                layout
                className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              >
                {items.map((item, index) => {
                  if (!item.product_id) {
                    return null;
                  }
                  const isChecked = selectedItems.includes(item.product_id);

                  return (
                    <motion.div
                      key={item.product_id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.03 }}
                      className='group relative'
                    >
                      <Card className='relative flex h-full flex-col justify-between overflow-hidden'>
                        <div>
                          <div className='absolute top-3 left-3 z-10'>
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => {
                                toggleSelectItem(item.product_id!);
                              }}
                              className='bg-background/90 shadow-xs backdrop-blur-xs'
                            />
                          </div>

                          <Link href={`/product/${item.product_id}`}>
                            <div className='bg-secondary relative aspect-square overflow-hidden'>
                              {item.image_url == null ? (
                                <div className='bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-xs'>
                                  No Image available
                                </div>
                              ) : (
                                <Image
                                  src={item.image_url}
                                  alt={item.product_name ?? 'Product Image'}
                                  fill
                                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                                />
                              )}

                              <div className='absolute top-3 right-3 flex flex-col gap-2'>
                                {!!item.discount_percent && item.discount_percent > 0 && (
                                  <Badge className='border-none bg-green-500 text-white shadow-xs'>
                                    -{item.discount_percent}%
                                  </Badge>
                                )}
                                {!item.is_in_stock && (
                                  <Badge variant='destructive'>Out of Stock</Badge>
                                )}
                              </div>
                            </div>
                          </Link>

                          <div className='p-4 pb-0'>
                            <h3 className='hover:text-primary line-clamp-2 text-sm font-medium transition-colors'>
                              <Link href={`/product/${item.product_id}`}>{item.product_name}</Link>
                            </h3>
                          </div>
                        </div>

                        <div className='p-4 pt-2'>
                          <div className='flex items-baseline gap-2'>
                            <span className='text-base font-bold'>${item.price?.toFixed(2)}</span>
                            {item.old_price && item.old_price > (item.price ?? 0) && (
                              <span className='text-muted-foreground text-xs line-through'>
                                ${item.old_price.toFixed(2)}
                              </span>
                            )}
                          </div>

                          <div className='mt-4 flex gap-2'>
                            <Button
                              size='sm'
                              className='flex-1 gap-1.5'
                              disabled={!item.is_in_stock}
                              onClick={() => {
                                addToCart({
                                  productId: item.product_id!,
                                  quantity: 1,
                                  image: item.image_url
                                });
                              }}
                            >
                              <IconShoppingCart className='h-3.5 w-3.5' />
                              Add to Cart
                            </Button>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size='sm'
                                    variant='secondary'
                                    className='px-2.5'
                                    onClick={() => addToCompare(item.product_id!)}
                                    disabled={!canAddMore() && !isInCompare(item.product_id)}
                                  >
                                    {isInCompare(item.product_id) ? (
                                      <IconX className='h-4 w-4' />
                                    ) : (
                                      <IconPackage className='h-4 w-4' />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {isInCompare(item.product_id)
                                    ? 'Remove from Compare'
                                    : 'Add to Compare'}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <Button
                              variant='ghost'
                              size='icon'
                              className='text-destructive hover:bg-destructive/10 h-9 w-9 shrink-0'
                              onClick={() => {
                                removeItem(item.product_id!);
                              }}
                            >
                              <IconTrash className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div layout className='space-y-4'>
                {items.map((item, index) => {
                  if (!item.product_id) {
                    return null;
                  }
                  const isChecked = selectedItems.includes(item.product_id);

                  return (
                    <motion.div
                      key={item.product_id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Card className='group relative p-4'>
                        <div className='flex items-center gap-4'>
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => {
                              toggleSelectItem(item.product_id!);
                            }}
                          />

                          <Link
                            href={`/product/${item.product_id}`}
                            className='bg-secondary relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border'
                          >
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.product_name ?? 'Product Image'}
                                fill
                                className='object-cover'
                              />
                            ) : (
                              <div className='bg-muted flex h-full w-full items-center justify-center text-[10px]' />
                            )}
                          </Link>

                          <div className='flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                            <div>
                              <h3 className='max-w-[280px] truncate text-sm font-medium md:max-w-md'>
                                <Link
                                  href={`/product/${item.product_id}`}
                                  className='hover:text-primary transition-colors'
                                >
                                  {item.product_name}
                                </Link>
                              </h3>
                              <div className='mt-1 flex items-center gap-2'>
                                {!item.is_in_stock && (
                                  <Badge variant='destructive' className='px-1.5 py-0 text-[10px]'>
                                    Out of Stock
                                  </Badge>
                                )}
                                {!!item.discount_percent && item.discount_percent > 0 && (
                                  <Badge className='border-none bg-green-500 px-1.5 py-0 text-[10px] text-white'>
                                    -{item.discount_percent}%
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className='flex shrink-0 items-center justify-between gap-6 sm:justify-end'>
                              <div className='sm:text-right'>
                                <span className='block text-base font-bold'>
                                  ${item.price?.toFixed(2)}
                                </span>
                                {item.old_price && item.old_price > (item.price ?? 0) && (
                                  <p className='text-muted-foreground text-xs line-through'>
                                    ${item.old_price.toFixed(2)}
                                  </p>
                                )}
                              </div>

                              <div className='flex items-center gap-1.5'>
                                <Button
                                  variant='secondary'
                                  size='sm'
                                  className='h-9 gap-1'
                                  disabled={!item.is_in_stock}
                                  onClick={() => {
                                    addToCart({
                                      productId: item.product_id!,
                                      quantity: 1,
                                      image: item.image_url
                                    });
                                  }}
                                >
                                  <IconShoppingCart className='h-3.5 w-3.5' />
                                  <span className='hidden md:inline'>Add to Cart</span>
                                </Button>

                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='text-destructive hover:bg-destructive/10 h-9 w-9'
                                  onClick={() => {
                                    removeItem(item.product_id!);
                                  }}
                                >
                                  <IconTrash className='h-4 w-4' />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Browse Recommendations/Continue Shopping */}
          <div className='mt-12 border-t pt-8 text-center'>
            <p className='text-muted-foreground mb-4 text-sm'>
              Looking for more? Discover new arrivals and bestsellers.
            </p>
            <Link href='/shop'>
              <Button variant='outline' size='lg' className='gap-2 rounded-full'>
                Continue Shopping
                <IconArrowRight className='h-4 w-4' />
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
