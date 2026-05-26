import { IconShoppingCart, IconTrash, IconMinus, IconPlus } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useCartController } from '@/hooks/useCartController';
import { useWishlistStore } from '~/src/domains/wishlist/wishlist.store';
import type { DtoWishlistItemDTO } from '~/src/services/-account-wishlist-get.schemas';

interface WishlistItemProps {
  item: DtoWishlistItemDTO;
  index: number;
  isChecked: boolean;
}

export function StackWishlistItem({ item, index, isChecked }: WishlistItemProps) {
  const removeItem = useWishlistStore((state) => state.removeItem);
  const toggleSelectItem = useWishlistStore((state) => state.toggleSelectItem);

  const { increment, decrement, getProductQuantity } = useCartController();

  const productQuantity = getProductQuantity(item.product_id);
  const stock = item.stock ?? 10;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ delay: index * 0.03 }}
    >
      <Card className='group relative p-4 transition-all duration-200 hover:shadow-md'>
        <div className='flex items-center gap-4'>
          <Checkbox
            checked={isChecked}
            onCheckedChange={() => {
              toggleSelectItem(item.product_id as number);
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
                className='object-cover transition-transform duration-300 group-hover:scale-105'
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
                  <Badge className='border-none bg-green-500 px-1.5 text-[10px] text-white'>
                    -{item.discount_percent}%
                  </Badge>
                )}
              </div>
            </div>

            <div className='flex shrink-0 items-center justify-between gap-6 sm:justify-end'>
              <div className='sm:text-right'>
                <span className='block text-base font-bold'>${item.price?.toFixed(2)}</span>
                {item.old_price && item.old_price > (item.price ?? 0) && (
                  <p className='text-muted-foreground text-xs line-through'>
                    ${item.old_price.toFixed(2)}
                  </p>
                )}
              </div>

              <div className='flex items-center gap-2'>
                {/* Advanced Mode: Inline Counter appears when item already lives inside the cart */}
                {productQuantity > 0 ? (
                  <div className='bg-muted flex items-center rounded-lg border p-0.5'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 rounded-md'
                      onClick={() => increment(item)}
                    >
                      <IconMinus className='h-3.5 w-3.5' />
                    </Button>
                    <span className='w-8 text-center text-xs font-semibold select-none'>
                      {productQuantity}
                    </span>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 rounded-md'
                      disabled={productQuantity >= stock || !item.is_in_stock}
                      onClick={() => decrement(item)}
                    >
                      <IconPlus className='h-3.5 w-3.5' />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant='secondary'
                    size='sm'
                    className='h-9 gap-1'
                    disabled={!item.is_in_stock}
                    onClick={() => increment(item)}
                  >
                    <IconShoppingCart className='h-3.5 w-3.5' />
                    <span className='hidden md:inline'>Add to Cart</span>
                  </Button>
                )}

                <Button
                  variant='ghost'
                  size='icon'
                  className='text-destructive hover:bg-destructive/10 h-9 w-9'
                  onClick={() => {
                    removeItem(item.product_id as number);
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
}
