'use client';

import { IconMinus, IconPlus, IconX } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  cartMoneyClassName,
  formatCartMoney,
  getCartItemImage,
  getCartItemName,
  getStockStatus,
  itemNeedsVariantSelection
} from '@/domains/cart/lib/cart-utils';
import { useCartController } from '@/hooks/useCartController';
import { cn } from '@/lib/utils';
import type { DtoCartItemDetail } from '~/src/services/-cart-get.schemas';

interface CartSheetItemProps {
  item: DtoCartItemDetail;
  index: number;
  cartItemId: number;
  isUpdating?: boolean;
  isRemoving?: boolean;
  onNavigate?: () => void;
}

export function CartSheetItem({
  item,
  index,
  cartItemId,
  isUpdating,
  isRemoving,
  onNavigate
}: CartSheetItemProps) {
  const { updateCartItemQuantity, removeCartItem } = useCartController();

  const name = getCartItemName(item);
  const lineTotal = (item.price ?? 0) * (item.quantity ?? 0);
  const stockStatus = getStockStatus(item.stock);
  const needsAttention = itemNeedsVariantSelection(item);
  const maxStock = item.stock ?? 99;

  const handleDecrease = () => {
    const currentQty = item.quantity ?? 0;
    if (currentQty <= 1) {
      removeCartItem(cartItemId);
      return;
    }
    updateCartItemQuantity(cartItemId, currentQty - 1);
  };

  const handleIncrease = () => {
    const currentQty = item.quantity ?? 0;
    if (currentQty >= maxStock) return;
    updateCartItemQuantity(cartItemId, currentQty + 1);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ delay: index * 0.03 }}
      className={cn('flex gap-4 py-4', needsAttention && 'bg-warning/5 -mx-2 rounded-xl px-2')}
    >
      <Link href={`/product/${item.product_id}`} onClick={onNavigate} className='shrink-0'>
        <div className='bg-muted relative h-24 w-20 overflow-hidden rounded-xl'>
          <Image
            src={getCartItemImage(item)}
            alt={name}
            fill
            sizes='80px'
            className='object-cover transition-transform duration-300 hover:scale-105'
          />
        </div>
      </Link>

      <div className='flex min-w-0 flex-1 flex-col'>
        <div className='flex items-start justify-between gap-2'>
          <div className='min-w-0 space-y-1'>
            <Link
              href={`/product/${item.product_id}`}
              onClick={onNavigate}
              className='hover:text-accent line-clamp-2 leading-tight font-medium transition-colors'
            >
              {name}
            </Link>

            <div className='flex flex-wrap items-center gap-1'>
              {item.selected_color ? (
                <Badge variant='muted' size='sm'>
                  {item.selected_color}
                </Badge>
              ) : null}
              {item.selected_size ? (
                <Badge variant='muted' size='sm'>
                  {item.selected_size}
                </Badge>
              ) : null}
              {stockStatus === 'low' ? (
                <Badge variant='outline' size='sm' className='border-warning/40 text-warning'>
                  Only {item.stock} left
                </Badge>
              ) : null}
              {stockStatus === 'out' ? (
                <Badge variant='destructive' size='sm'>
                  Out of stock
                </Badge>
              ) : null}
              {needsAttention ? (
                <Badge variant='outline' size='sm' className='border-warning/40 text-warning'>
                  Select options
                </Badge>
              ) : null}
            </div>
          </div>

          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            className='text-muted-foreground hover:text-destructive shrink-0 rounded-full'
            onClick={() => removeCartItem(cartItemId)}
            disabled={isRemoving || isUpdating}
            loading={isRemoving}
            aria-label={`Remove ${name}`}
          >
            {!isRemoving ? <IconX className='size-4' /> : null}
          </Button>
        </div>

        <div className='mt-auto flex items-center justify-between pt-3'>
          <div className='border-border bg-background flex items-center rounded-full border'>
            <Button
              type='button'
              variant='ghost'
              size='icon-sm'
              className='rounded-l-full'
              onClick={handleDecrease}
              disabled={isUpdating || isRemoving}
              aria-label='Decrease quantity'
            >
              <IconMinus className='size-3.5' />
            </Button>
            <span className='w-8 text-center text-sm font-medium tabular-nums'>
              {item.quantity ?? 0}
            </span>
            <Button
              type='button'
              variant='ghost'
              size='icon-sm'
              className='rounded-r-full'
              onClick={handleIncrease}
              disabled={isUpdating || isRemoving || (item.quantity ?? 0) >= maxStock}
              aria-label='Increase quantity'
            >
              <IconPlus className='size-3.5' />
            </Button>
          </div>

          <div className='text-right'>
            <p className={cn('text-sm font-semibold', cartMoneyClassName)}>
              {formatCartMoney(lineTotal)}
            </p>
            {(item.quantity ?? 0) > 1 ? (
              <p className={cn('text-muted-foreground text-[11px]', cartMoneyClassName)}>
                {formatCartMoney(item.price ?? 0)} each
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
