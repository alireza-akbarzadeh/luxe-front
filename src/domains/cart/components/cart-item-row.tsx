'use client';

import { IconMinus, IconPlus, IconX } from '@tabler/icons-react';
import Link from 'next/link';

import { AppImage } from '@/components/ui/app-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Spinner } from '@/components/ui/spinner';
import { Typography } from '@/components/ui/typography';
import { useCartController } from '@/hooks/useCartController';
import { cn } from '@/lib/utils';
import type { DtoCartItemDetail } from '@/services/-cart-get.schemas';

import {
  cartMoneyClassName,
  formatCartMoney,
  getCartItemElementId,
  getCartItemImage,
  getCartItemName,
  getStockStatus,
  itemNeedsVariantSelection
} from '../lib/cart-utils';

interface CartItemRowProps {
  cart: DtoCartItemDetail;
  cartItemId: number;
  isUpdating?: boolean;
  isRemoving?: boolean;
}

/** Native-style cart row for mobile — compact list layout with clear quantity controls. */
export function CartItemRow({ cart, cartItemId, isUpdating, isRemoving }: CartItemRowProps) {
  const { updateCartItemQuantity, removeCartItem, updateCartItemVariant } = useCartController();

  const hasColorOptions = (cart.color?.length ?? 0) > 0;
  const hasSizeOptions = (cart.size?.length ?? 0) > 0;
  const needsAttention = itemNeedsVariantSelection(cart);
  const stockStatus = getStockStatus(cart.stock);
  const lineTotal = (cart.price ?? 0) * (cart.quantity ?? 0);
  const lineOriginal = cart.original_price ? cart.original_price * (cart.quantity ?? 0) : null;
  const name = getCartItemName(cart);
  const productHref = `/product/${cart.product_id}`;

  return (
    <li
      id={getCartItemElementId(cartItemId)}
      className={cn(
        'bg-card border-border/60 rounded-2xl border p-3 shadow-sm',
        needsAttention && 'border-warning/50 ring-warning/15 ring-1'
      )}
    >
      <Flex gap={3}>
        <Link
          href={productHref}
          className='bg-muted relative size-[4.75rem] shrink-0 overflow-hidden rounded-xl'
          aria-label={name}
        >
          <AppImage
            src={getCartItemImage(cart)}
            alt=''
            aria-hidden
            fill
            sizes='76px'
            className='object-cover'
          />
        </Link>

        <Flex direction='column' gap={2} className='min-w-0 flex-1'>
          <Flex align='start' justify='between' gap={2}>
            <Link href={productHref} className='min-w-0 flex-1'>
              <Typography.Small weight='medium' className='line-clamp-2 leading-snug'>
                {name}
              </Typography.Small>
            </Link>
            <button
              type='button'
              onClick={() => removeCartItem(cartItemId)}
              disabled={isRemoving}
              className={cn(
                'text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-full',
                'hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50'
              )}
              aria-label={`Remove ${name}`}
            >
              {isRemoving ? <Spinner className='size-4' /> : <IconX className='size-4' />}
            </button>
          </Flex>

          <Flex align='center' gap={1.5} wrap='wrap'>
            {cart.selected_color ? (
              <Badge variant='muted' size='sm'>
                {cart.selected_color}
              </Badge>
            ) : null}
            {cart.selected_size ? (
              <Badge variant='muted' size='sm'>
                {cart.selected_size}
              </Badge>
            ) : null}
            {stockStatus === 'low' ? (
              <Badge variant='outline' size='sm' className='border-warning/40 text-warning'>
                Only {cart.stock} left
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
          </Flex>

          {hasColorOptions ? (
            <Flex direction='column' gap={1.5}>
              <Typography.Muted className='text-[10px] font-medium tracking-wide uppercase'>
                Color
              </Typography.Muted>
              <Flex gap={1.5} wrap='wrap'>
                {cart.color?.map((color) => (
                  <Button
                    key={color}
                    type='button'
                    variant={cart.selected_color === color ? 'default' : 'outline'}
                    size='sm'
                    className='h-7 rounded-full px-3 text-xs'
                    onClick={() =>
                      updateCartItemVariant(cartItemId, color, cart.selected_size || '')
                    }
                    disabled={isUpdating}
                  >
                    {color}
                  </Button>
                ))}
              </Flex>
            </Flex>
          ) : null}

          {hasSizeOptions ? (
            <Flex direction='column' gap={1.5}>
              <Typography.Muted className='text-[10px] font-medium tracking-wide uppercase'>
                Size
              </Typography.Muted>
              <Flex gap={1.5} wrap='wrap'>
                {cart.size?.map((size) => (
                  <Button
                    key={size}
                    type='button'
                    variant={cart.selected_size === size ? 'default' : 'outline'}
                    size='sm'
                    className='h-7 min-w-9 rounded-full px-3 text-xs'
                    onClick={() =>
                      updateCartItemVariant(cartItemId, cart.selected_color || '', size)
                    }
                    disabled={isUpdating}
                  >
                    {size}
                  </Button>
                ))}
              </Flex>
            </Flex>
          ) : null}

          <Flex align='center' justify='between' gap={3}>
            <Flex
              align='center'
              justify='between'
              className='bg-muted/80 h-10 min-w-[7.5rem] rounded-full border px-1'
            >
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                className='rounded-full'
                onClick={() => updateCartItemQuantity(cartItemId, (cart.quantity ?? 0) - 1)}
                disabled={isUpdating || (cart.quantity ?? 0) <= 1}
                aria-label='Decrease quantity'
              >
                <IconMinus className='size-4' />
              </Button>
              <Typography.Small weight='semibold' className='tabular-nums'>
                {cart.quantity}
              </Typography.Small>
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                className='rounded-full'
                onClick={() => updateCartItemQuantity(cartItemId, (cart.quantity ?? 0) + 1)}
                disabled={isUpdating || (cart.quantity ?? 0) >= (cart.stock ?? 99)}
                aria-label='Increase quantity'
              >
                <IconPlus className='size-4' />
              </Button>
            </Flex>

            <Flex direction='column' align='end' gap={0.5}>
              <Typography.Text weight='semibold' className={cn('tabular-nums', cartMoneyClassName)}>
                {formatCartMoney(lineTotal)}
              </Typography.Text>
              {lineOriginal !== null && lineOriginal > lineTotal ? (
                <Typography.Muted
                  className={cn('text-xs tabular-nums line-through', cartMoneyClassName)}
                >
                  {formatCartMoney(lineOriginal)}
                </Typography.Muted>
              ) : null}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </li>
  );
}
