import {
  IconMinus,
  IconPackage,
  IconPlus,
  IconShoppingCart,
  IconTrash,
  IconX
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCartController } from '@/hooks/useCartController';
import { useWishlistStore } from '~/src/domains/wishlist/wishlist.store';
import type { DtoWishlistItemDTO } from '~/src/services/-account-wishlist-get.schemas';

interface WishlistItemProps {
  item: DtoWishlistItemDTO;
  index: number;
  isChecked: boolean;
}

export function RowWishlistItem({ item, index, isChecked }: WishlistItemProps) {
  const removeItem = useWishlistStore((state) => state.removeItem);
  const toggleSelectItem = useWishlistStore((state) => state.toggleSelectItem);

  const { increment, decrement, getProductQuantity } = useCartController();

  const productQuantity = getProductQuantity(item.product_id);
  const stock = item.stock ?? 10;

  const isInCompare = (_id: number) => false;
  const addToCompare = (_id: number) => {};
  const canAddMore = () => true;

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
      <Card className='relative flex h-full flex-col justify-between overflow-hidden shadow-xs transition-all duration-300 hover:shadow-md'>
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
                  <Badge className='border-none bg-green-500 text-black shadow-xs'>
                    -{item.discount_percent}%
                  </Badge>
                )}
                {!item.is_in_stock && <Badge variant='destructive'>Out of Stock</Badge>}
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

          <div className='mt-4 flex items-center gap-2'>
            {/* Dynamic Button / Quantity Toggle Counter */}
            {productQuantity > 0 ? (
              <div className='bg-muted flex h-9 flex-1 items-center justify-between rounded-lg border p-0.5'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 rounded-md'
                  onClick={() =>
                    decrement({
                      image_url: item.image_url,
                      is_in_stock: item.is_in_stock,
                      price: item.price,
                      product_id: item.product_id,
                      product_name: item.product_name,
                      stock: item.stock,
                      size: item?.size?.[0],
                      color: item?.color?.[0]
                    })
                  }
                >
                  <IconMinus className='h-3.5 w-3.5' />
                </Button>
                <span className='text-xs font-semibold select-none'>{productQuantity}</span>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 rounded-md'
                  disabled={productQuantity >= stock || !item.is_in_stock}
                  onClick={() =>
                    increment({
                      image_url: item.image_url,
                      is_in_stock: item.is_in_stock,
                      price: item.price,
                      product_id: item.product_id,
                      product_name: item.product_name,
                      stock: item.stock,
                      size: item?.size?.[0],
                      color: item?.color?.[0]
                    })
                  }
                >
                  <IconPlus className='h-3.5 w-3.5' />
                </Button>
              </div>
            ) : (
              <Button
                size='sm'
                className='h-9 flex-1 gap-1.5'
                disabled={!item.is_in_stock}
                onClick={() =>
                  decrement({
                    image_url: item.image_url,
                    is_in_stock: item.is_in_stock,
                    price: item.price,
                    product_id: item.product_id,
                    product_name: item.product_name,
                    stock: item.stock,
                    size: item?.size?.[0],
                    color: item?.color?.[0]
                  })
                }
              >
                <IconShoppingCart className='h-3.5 w-3.5' />
                Add to Cart
              </Button>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size='sm'
                    variant='secondary'
                    className='h-9 rounded-full border border-gray-300 px-2.5'
                    onClick={() => addToCompare(item.product_id!)}
                    disabled={!canAddMore() && !isInCompare(item.product_id!)}
                  >
                    {isInCompare(item.product_id!) ? (
                      <IconX className='h-4 w-4' />
                    ) : (
                      <IconPackage className='h-4 w-4' />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isInCompare(item.product_id!) ? 'Remove from Compare' : 'Add to Compare'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    className='text-destructive hover:bg-destructive/10 h-9 w-9 shrink-0'
                    onClick={() => {
                      removeItem(item.product_id!);
                    }}
                  >
                    <IconTrash className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
