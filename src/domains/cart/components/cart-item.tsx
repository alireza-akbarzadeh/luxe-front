import { IconMinus, IconPlus, IconX } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/domains/home/lib/home-utils';
import { cn } from '@/lib/utils';
import { useCartController } from '~/src/hooks/useCartController';
import type { DtoCartItemDetail } from '~/src/services/-cart-get.schemas';

import {
  getCartItemImage,
  getCartItemName,
  getStockStatus,
  itemNeedsVariantSelection
} from '../lib/cart-utils';

interface CartItemProps {
  cart: DtoCartItemDetail;
  index: number;
  isUpdating?: boolean;
  isRemoving?: boolean;
  cartItemId: number;
}

export function CartItem({ cart, index, cartItemId, isUpdating, isRemoving }: CartItemProps) {
  const { updateCartItemQuantity, removeCartItem, updateCartItemVariant } = useCartController();

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    const maxStock = cart.stock ?? 99;
    if (newQuantity > maxStock) return;
    updateCartItemQuantity(cartItemId, newQuantity);
  };

  const handleRemove = () => removeCartItem(cartItemId);

  const handleSelectColor = (color: string) => {
    updateCartItemVariant(cartItemId, color, cart.selected_size || '');
  };

  const handleSelectSize = (size: string) => {
    updateCartItemVariant(cartItemId, cart.selected_color || '', size);
  };

  const hasColorOptions = (cart.color?.length ?? 0) > 0;
  const hasSizeOptions = (cart.size?.length ?? 0) > 0;
  const needsAttention = itemNeedsVariantSelection(cart);
  const stockStatus = getStockStatus(cart.stock);
  const lineTotal = (cart.price ?? 0) * (cart.quantity ?? 0);
  const lineOriginal = cart.original_price ? cart.original_price * (cart.quantity ?? 0) : null;
  const name = getCartItemName(cart);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.04 }}
      className={cn(
        'bg-card group relative flex gap-4 rounded-2xl border p-4 transition-shadow sm:p-5',
        needsAttention
          ? 'border-warning/40 ring-warning/10 ring-1'
          : 'border-border/50 hover:shadow-sm'
      )}
    >
      <Link href={`/product/${cart.product_id}`} className='shrink-0'>
        <div className='bg-muted relative h-24 w-24 overflow-hidden rounded-xl sm:h-32 sm:w-32'>
          <Image
            src={getCartItemImage(cart)}
            alt={name}
            fill
            sizes='128px'
            className='object-cover transition-transform duration-300 group-hover:scale-105'
          />
        </div>
      </Link>

      <div className='flex min-w-0 flex-1 flex-col'>
        <div className='flex items-start justify-between gap-2'>
          <div className='min-w-0 space-y-1'>
            <Link
              href={`/product/${cart.product_id}`}
              className='hover:text-accent line-clamp-2 leading-snug font-medium transition-colors sm:text-base'
            >
              {name}
            </Link>

            <div className='flex flex-wrap items-center gap-1.5'>
              {cart.selected_color && (
                <Badge variant='muted' size='sm'>
                  {cart.selected_color}
                </Badge>
              )}
              {cart.selected_size && (
                <Badge variant='muted' size='sm'>
                  {cart.selected_size}
                </Badge>
              )}
              {stockStatus === 'low' && (
                <Badge variant='outline' size='sm' className='border-warning/40 text-warning'>
                  Only {cart.stock} left
                </Badge>
              )}
              {stockStatus === 'out' && (
                <Badge variant='destructive' size='sm'>
                  Out of stock
                </Badge>
              )}
              {needsAttention && (
                <Badge variant='outline' size='sm' className='border-warning/40 text-warning'>
                  Select options
                </Badge>
              )}
            </div>
          </div>

          <Button
            variant='ghost'
            size='icon'
            className='text-muted-foreground hover:text-destructive h-8 w-8 shrink-0 rounded-full'
            onClick={handleRemove}
            disabled={isRemoving}
            aria-label={`Remove ${name}`}
          >
            {isRemoving ? (
              <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
            ) : (
              <IconX className='h-4 w-4' />
            )}
          </Button>
        </div>

        {hasColorOptions && (
          <div className='mt-3'>
            <p className='text-muted-foreground mb-1.5 text-xs font-medium tracking-wide uppercase'>
              Color
            </p>
            <div className='flex flex-wrap gap-1.5'>
              {cart.color?.map((color) => (
                <Button
                  key={color}
                  type='button'
                  variant={cart.selected_color === color ? 'default' : 'outline'}
                  size='sm'
                  className='h-7 rounded-full px-3 text-xs'
                  onClick={() => handleSelectColor(String(color))}
                  disabled={isUpdating}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>
        )}

        {hasSizeOptions && (
          <div className='mt-3'>
            <p className='text-muted-foreground mb-1.5 text-xs font-medium tracking-wide uppercase'>
              Size
            </p>
            <div className='flex flex-wrap gap-1.5'>
              {cart.size?.map((size) => (
                <Button
                  key={size}
                  type='button'
                  variant={cart.selected_size === size ? 'default' : 'outline'}
                  size='sm'
                  className='h-7 min-w-9 rounded-full px-3 text-xs'
                  onClick={() => handleSelectSize(String(size))}
                  disabled={isUpdating}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className='mt-auto flex items-end justify-between pt-4'>
          <div className='border-border bg-background flex items-center rounded-full border'>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='h-8 w-8 rounded-full'
              onClick={() => handleUpdateQuantity((cart.quantity ?? 0) - 1)}
              disabled={isUpdating || (cart.quantity ?? 0) <= 1}
              aria-label='Decrease quantity'
            >
              <IconMinus className='h-3.5 w-3.5' />
            </Button>
            <span className='w-8 text-center text-sm font-medium tabular-nums'>
              {cart.quantity}
            </span>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='h-8 w-8 rounded-full'
              onClick={() => handleUpdateQuantity((cart.quantity ?? 0) + 1)}
              disabled={isUpdating || (cart.quantity ?? 0) >= (cart.stock ?? 99)}
              aria-label='Increase quantity'
            >
              <IconPlus className='h-3.5 w-3.5' />
            </Button>
          </div>

          <div className='text-right'>
            <p className='text-base font-semibold tabular-nums sm:text-lg'>
              {formatPrice(lineTotal)}
            </p>
            {lineOriginal !== null && lineOriginal > lineTotal && (
              <p className='text-muted-foreground text-xs tabular-nums line-through'>
                {formatPrice(lineOriginal)}
              </p>
            )}
            {(cart.quantity ?? 0) > 1 && (
              <p className='text-muted-foreground text-[11px] tabular-nums'>
                {formatPrice(cart.price ?? 0)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
