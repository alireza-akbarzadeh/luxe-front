'use client';

import { IconHeartFilled, IconMinus, IconPlus, IconShoppingCart } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { type CartItemPayload, useCartController } from '@/hooks/useCartController';
import { cn } from '@/lib/utils';
import type { DtoWishlistItemDTO } from '~/src/services/-account-wishlist-get.schemas';

import { formatOrderAmount } from '../lib/order-utils';

interface AccountWishlistItemCardProps {
  item: DtoWishlistItemDTO;
  isRemoving?: boolean;
  onRemove: (productId: number) => void;
}

function toCartPayload(item: DtoWishlistItemDTO): CartItemPayload {
  return {
    product_id: item.product_id,
    product_name: item.product_name,
    price: item.price,
    image_url: item.image_url,
    stock: item.stock ?? item.stock_quantity,
    is_in_stock: item.is_in_stock,
    color: item.color?.[0],
    size: item.size?.[0]
  };
}

export function AccountWishlistItemCard({
  item,
  isRemoving = false,
  onRemove
}: AccountWishlistItemCardProps) {
  const { increment, decrement, getProductQuantity, isAdding } = useCartController();
  const productId = item.product_id;
  const productQuantity = getProductQuantity(productId);
  const stock = item.stock ?? item.stock_quantity ?? 0;
  const cartPayload = toCartPayload(item);
  const hasDiscount =
    typeof item.old_price === 'number' &&
    typeof item.price === 'number' &&
    item.old_price > item.price;

  if (!productId) return null;

  return (
    <article className='bg-card border-border/70 group hover:border-border relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-[border-color,box-shadow] hover:shadow-md'>
      <Link href={`/product/${productId}`} className='relative block aspect-square overflow-hidden'>
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.product_name ?? 'Product'}
            fill
            sizes='(max-width: 768px) 50vw, 33vw'
            className='object-cover transition-transform duration-300 group-hover:scale-105'
          />
        ) : (
          <div className='bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-xs'>
            No image
          </div>
        )}

        {hasDiscount && item.discount_percent ? (
          <Badge className='absolute top-2 left-2 border-none bg-emerald-600 text-white shadow-sm'>
            -{item.discount_percent}%
          </Badge>
        ) : null}

        {!item.is_in_stock ? (
          <div className='absolute inset-0 flex items-center justify-center bg-black/45'>
            <span className='rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white'>
              Out of stock
            </span>
          </div>
        ) : null}
      </Link>

      <button
        type='button'
        onClick={() => onRemove(productId)}
        disabled={isRemoving}
        className={cn(
          'bg-background/90 absolute top-2 right-2 flex size-9 items-center justify-center rounded-full',
          'text-red-500 shadow-sm backdrop-blur-sm transition-colors',
          'hover:bg-red-500 hover:text-white disabled:opacity-60'
        )}
        aria-label='Remove from wishlist'
      >
        {isRemoving ? (
          <Spinner className='size-4' />
        ) : (
          <IconHeartFilled className='size-4 fill-current' />
        )}
      </button>

      <div className='flex flex-1 flex-col p-4'>
        <Link
          href={`/product/${productId}`}
          className='hover:text-accent line-clamp-2 min-h-[2.5rem] text-sm leading-snug font-medium transition-colors'
        >
          {item.product_name}
        </Link>

        <div className='mt-2 flex flex-wrap items-baseline gap-2'>
          <span className='text-base font-semibold tabular-nums'>
            {formatOrderAmount(item.price)}
          </span>
          {hasDiscount ? (
            <span className='text-muted-foreground text-sm tabular-nums line-through'>
              {formatOrderAmount(item.old_price)}
            </span>
          ) : null}
        </div>

        <div className='mt-auto pt-4'>
          {productQuantity > 0 ? (
            <div className='bg-muted flex items-center justify-between rounded-full border p-1'>
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                className='rounded-full'
                onClick={() => decrement(cartPayload)}
              >
                <IconMinus className='size-4' />
              </Button>
              <span className='text-sm font-semibold tabular-nums'>{productQuantity}</span>
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                className='rounded-full'
                disabled={productQuantity >= stock || !item.is_in_stock}
                onClick={() => increment(cartPayload)}
              >
                <IconPlus className='size-4' />
              </Button>
            </div>
          ) : (
            <Button
              type='button'
              size='sm'
              className='w-full'
              disabled={!item.is_in_stock || isAdding}
              onClick={() => increment(cartPayload)}
            >
              <IconShoppingCart className='size-4' />
              {item.is_in_stock ? 'Add to cart' : 'Unavailable'}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
