'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCartController } from '@/hooks/useCartController';
import { useCompareStore } from '../compare/compare.store';
import { products, stores } from '../store/data';
import { useWishlistStore } from './wishlist.store';
import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { WishlistHeader } from './components/wishlist-header';
import { Empty } from '@/components/empty';
import {
  IconArrowRight,
  IconBell,
  IconBellOff,
  IconChevronRight,
  IconGift,
  IconGrid3x3,
  IconHeart,
  IconList,
  IconPackage,
  IconShoppingCart,
  IconSparkles,
  IconStar,
  IconTrash,
  IconTrendingDown,
  IconX
} from '@tabler/icons-react';

type SortOption = 'date-desc' | 'date-asc' | 'price-asc' | 'price-desc' | 'name';
type ViewMode = 'grid' | 'list';

export function WishlistDomain() {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const { removeItem, toggleNotifyOnSale, getItems, getPriceDrops, getTotalSavings } =
    useWishlistStore();
  const { addItem: addToCart } = useCartController();
  const { addItem: addToCompare, isInCompare, canAddMore } = useCompareStore();

  const allItems = getItems().filter((item) => item.product);
  const priceDrops = getPriceDrops();
  const totalSavings = getTotalSavings();

  // Sort items
  const sortedItems = [...allItems].sort((a, b) => {
    if (!a.product || !b.product) return 0;
    switch (sortBy) {
      case 'date-desc':
        return b.addedAt - a.addedAt;
      case 'date-asc':
        return a.addedAt - b.addedAt;
      case 'price-asc':
        return a.product.price - b.product.price;
      case 'price-desc':
        return b.product.price - a.product.price;
      case 'name':
        return a.product.name.localeCompare(b.product.name);
      default:
        return 0;
    }
  });

  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const selectAll = () => {
    if (selectedItems.length === sortedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedItems.map((item) => item.id));
    }
  };

  const addSelectedToCart = () => {
    selectedItems.forEach((id) => {
      const product = products?.find((p) => p.id === id);
      if (product) {
        addToCart({
          productId: product.id,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image
        });
      }
    });
    setSelectedItems([]);
  };
  const handleAddToCart = (product: (typeof products)[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image
    });
  };
  const removeSelected = () => {
    selectedItems.forEach((id) => removeItem(id));
    setSelectedItems([]);
  };

  return (
    <div className='app-container py-8 pt-24'>
      {/* Breadcrumb */}
      <DynamicBreadcrumb segments={['Wishlist']} />
      {/* Header */}
      <WishlistHeader itemLength={allItems.length || 0} />
      {allItems.length === 0 ? (
        <Empty
          content={
            <Link href='/shop'>
              <Button size='lg' className='gap-2 rounded-full'>
                Explore Products
                <IconArrowRight className='h-4 w-4' />
              </Button>
            </Link>
          }
          description="Start adding items you love by clicking the heart icon on any product. We'll save them here for you."
          title='your wishlist os Empty'
          icon={IconHeart}
        />
      ) : (
        <>
          {/* Price Drops Alert */}
          {priceDrops.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='mb-8'
            >
              <Card className='border-green-500/30 bg-green-500/5 p-4'>
                <div className='flex items-center gap-3'>
                  <div className='rounded-full bg-green-500/10 p-2'>
                    <IconTrendingDown className='h-5 w-5 text-green-500' />
                  </div>
                  <div className='flex-1'>
                    <p className='font-medium text-green-700 dark:text-green-400'>
                      Price Drop Alert!
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      {priceDrops.length} {priceDrops.length === 1 ? 'item has' : 'items have'}{' '}
                      dropped in price since you added {priceDrops.length === 1 ? 'it' : 'them'}
                    </p>
                  </div>
                  <Link href='#price-drops'>
                    <Button variant='ghost' size='sm' className='gap-1'>
                      View
                      <IconChevronRight className='h-4 w-4' />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Stats Cards */}
          <div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3'>
            <Card className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='bg-primary/10 rounded-lg p-2'>
                  <IconHeart className='text-primary h-5 w-5' />
                </div>
                <div>
                  <p className='text-2xl font-bold'>{allItems.length}</p>
                  <p className='text-muted-foreground text-sm'>Saved Items</p>
                </div>
              </div>
            </Card>
            <Card className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-green-500/10 p-2'>
                  <IconSparkles className='h-5 w-5 text-green-500' />
                </div>
                <div>
                  <p className='text-2xl font-bold'>${totalSavings}</p>
                  <p className='text-muted-foreground text-sm'>Potential Savings</p>
                </div>
              </div>
            </Card>
            <Card className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='bg-accent/50 rounded-lg p-2'>
                  <IconGift className='text-accent-foreground h-5 w-5' />
                </div>
                <div>
                  <p className='text-2xl font-bold'>{priceDrops.length}</p>
                  <p className='text-muted-foreground text-sm'>Price Drops</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Toolbar */}
          <div className='mb-6 flex flex-col items-start justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <Checkbox
                  checked={selectedItems.length === sortedItems.length}
                  onCheckedChange={selectAll}
                  id='select-all'
                />
                <label htmlFor='select-all' className='cursor-pointer text-sm'>
                  Select All
                </label>
              </div>

              <AnimatePresence>
                {selectedItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className='flex items-center gap-2'
                  >
                    <span className='text-muted-foreground text-sm'>
                      {selectedItems.length} selected
                    </span>
                    <Button
                      size='sm'
                      variant='secondary'
                      className='gap-1'
                      onClick={addSelectedToCart}
                    >
                      <IconShoppingCart className='h-3 w-3' />
                      Add to Cart
                    </Button>
                    <Button
                      size='sm'
                      variant='ghost'
                      className='text-destructive hover:text-destructive gap-1'
                      onClick={removeSelected}
                    >
                      <IconTrash className='h-3 w-3' />
                      Remove
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className='flex items-center gap-3'>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className='w-45'>
                  <SelectValue placeholder='Sort by' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='date-desc'>Newest First</SelectItem>
                  <SelectItem value='date-asc'>Oldest First</SelectItem>
                  <SelectItem value='price-asc'>Price: Low to High</SelectItem>
                  <SelectItem value='price-desc'>Price: High to Low</SelectItem>
                  <SelectItem value='name'>Name: A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className='flex items-center rounded-lg border p-1'>
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => setViewMode('grid')}
                >
                  <IconGrid3x3 className='h-4 w-4' />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => setViewMode('list')}
                >
                  <IconList className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>

          {/* Items */}
          <AnimatePresence mode='popLayout'>
            {viewMode === 'grid' ? (
              <motion.div
                layout
                className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              >
                {sortedItems.map((item, index) => {
                  if (!item.product) return null;
                  const product = item.product;
                  const store = stores.find((s) => s.id === product.storeId);
                  const priceDrop = priceDrops.find((pd) => pd.id === item.id);

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className='group relative'
                    >
                      <Card className='overflow-hidden'>
                        {/* Checkbox */}
                        <div className='absolute top-3 left-3 z-10'>
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => toggleSelectItem(item.id)}
                            className='bg-background/80 backdrop-blur-sm'
                          />
                        </div>

                        {/* Image */}
                        <Link href={`/product/${product.id}`}>
                          <div className='bg-secondary relative aspect-square overflow-hidden'>
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className='object-cover transition-transform duration-500 group-hover:scale-110'
                            />

                            {/* Badges */}
                            <div className='absolute top-3 right-3 flex flex-col gap-2'>
                              {product.isNew && (
                                <Badge className='bg-accent text-accent-foreground'>New</Badge>
                              )}
                              {priceDrop && (
                                <Badge variant='secondary' className='bg-green-500 text-white'>
                                  -${priceDrop.priceDrop}
                                </Badge>
                              )}
                            </div>

                            {/* Actions Overlay */}
                            <div className='from-background/90 absolute inset-0 flex items-end justify-center bg-linear-to-t via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                              <div className='flex w-full gap-2'>
                                <Button
                                  size='sm'
                                  className='flex-1 gap-1 rounded-full'
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleAddToCart(product);
                                  }}
                                >
                                  <IconShoppingCart className='h-3 w-3' />
                                  Add to Cart
                                </Button>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size='sm'
                                        variant='secondary'
                                        className='rounded-full'
                                        onClick={(e) => {
                                          e.preventDefault();
                                          addToCompare(product.id);
                                        }}
                                        disabled={!canAddMore() && !isInCompare(product.id)}
                                      >
                                        {isInCompare(product.id) ? (
                                          <IconX className='h-3 w-3' />
                                        ) : (
                                          <IconPackage className='h-3 w-3' />
                                        )}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {isInCompare(product.id)
                                        ? 'Remove from Compare'
                                        : 'Add to Compare'}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>
                        </Link>

                        {/* Info */}
                        <div className='p-4'>
                          {store && (
                            <Link
                              href={`/store/${store.slug}`}
                              className='text-muted-foreground hover:text-primary text-xs transition-colors'
                            >
                              {store.name}
                            </Link>
                          )}
                          <h3 className='mt-1 line-clamp-1 font-medium'>{product.name}</h3>

                          <div className='mt-1 flex items-center gap-1'>
                            <IconStar className='fill-accent text-accent h-3 w-3' />
                            <span className='text-muted-foreground text-xs'>{product.rating}</span>
                          </div>

                          <div className='mt-3 flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              <span className='font-semibold'>${product.price}</span>
                              {product.originalPrice && (
                                <span className='text-muted-foreground text-sm line-through'>
                                  ${product.originalPrice}
                                </span>
                              )}
                            </div>

                            <div className='flex items-center gap-1'>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant='ghost'
                                      size='icon'
                                      className='h-8 w-8'
                                      onClick={() => toggleNotifyOnSale(item.id)}
                                    >
                                      {item.notifyOnSale ? (
                                        <IconBell className='text-primary h-4 w-4' />
                                      ) : (
                                        <IconBellOff className='h-4 w-4' />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {item.notifyOnSale ? 'Sale notifications on' : 'Notify on sale'}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <Button
                                variant='ghost'
                                size='icon'
                                className='text-destructive hover:text-destructive h-8 w-8'
                                onClick={() => removeItem(item.id)}
                              >
                                <IconTrash className='h-4 w-4' />
                              </Button>
                            </div>
                          </div>

                          <p className='text-muted-foreground mt-2 text-xs'>
                            Added {format(new Date(item.addedAt), '')}
                          </p>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div layout className='space-y-4'>
                {sortedItems.map((item, index) => {
                  if (!item.product) return null;
                  const product = item.product;
                  const store = stores.find((s) => s.id === product.storeId);
                  const priceDrop = priceDrops.find((pd) => pd.id === item.id);

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className='p-4'>
                        <div className='flex gap-4'>
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => toggleSelectItem(item.id)}
                            className='mt-1'
                          />

                          <Link
                            href={`/product/${product.id}`}
                            className='bg-secondary relative h-24 w-24 shrink-0 overflow-hidden rounded-lg'
                          >
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className='object-cover'
                            />
                            {priceDrop && (
                              <Badge className='absolute top-1 right-1 bg-green-500 px-1 text-[10px] text-white'>
                                -${priceDrop.priceDrop}
                              </Badge>
                            )}
                          </Link>

                          <div className='min-w-0 flex-1'>
                            <div className='flex items-start justify-between gap-4'>
                              <div>
                                {store && (
                                  <Link
                                    href={`/store/${store.slug}`}
                                    className='text-muted-foreground hover:text-primary text-xs transition-colors'
                                  >
                                    {store.name}
                                  </Link>
                                )}
                                <h3 className='font-medium'>{product.name}</h3>
                                <p className='text-muted-foreground line-clamp-1 text-sm'>
                                  {product.description}
                                </p>
                              </div>

                              <div className='text-right'>
                                <span className='text-lg font-semibold'>${product.price}</span>
                                {product.originalPrice && (
                                  <p className='text-muted-foreground text-sm line-through'>
                                    ${product.originalPrice}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className='mt-3 flex items-center justify-between'>
                              <div className='text-muted-foreground flex items-center gap-4 text-sm'>
                                <div className='flex items-center gap-1'>
                                  <IconStar className='fill-accent text-accent h-3 w-3' />
                                  {product.rating}
                                </div>
                                <span>Added {format(new Date(item.addedAt), '')}</span>
                              </div>

                              <div className='flex items-center gap-2'>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => toggleNotifyOnSale(item.id)}
                                  className='gap-1'
                                >
                                  {item.notifyOnSale ? (
                                    <IconBell className='text-primary h-4 w-4' />
                                  ) : (
                                    <IconBellOff className='h-4 w-4' />
                                  )}
                                  {item.notifyOnSale ? 'Notifying' : 'Notify'}
                                </Button>
                                <Button
                                  variant='secondary'
                                  size='sm'
                                  className='gap-1'
                                  onClick={() => handleAddToCart(product)}
                                >
                                  <IconShoppingCart className='h-4 w-4' />
                                  Add to Cart
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='text-destructive hover:text-destructive h-8 w-8'
                                  onClick={() => removeItem(item.id)}
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

          {/* Continue Shopping */}
          <div className='mt-12 text-center'>
            <p className='text-muted-foreground mb-4'>
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
