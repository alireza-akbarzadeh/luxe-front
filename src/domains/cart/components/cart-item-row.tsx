'use client';

import { IconChevronDown, IconMinus, IconPlus, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

import { AppImage } from '@/components/ui/app-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
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

/** Native-style cart row for mobile — compact card with collapsible variant options. */
export function CartItemRow({ cart, cartItemId, isUpdating, isRemoving }: CartItemRowProps) {
  const { updateCartItemQuantity, removeCartItem, updateCartItemVariant } = useCartController();
  const [optionsOpen, setOptionsOpen] = useState(false);

  const hasColorOptions = (cart.color?.length ?? 0) > 0;
  const hasSizeOptions = (cart.size?.length ?? 0) > 0;
  const hasOptions = hasColorOptions || hasSizeOptions;
  const needsAttention = itemNeedsVariantSelection(cart);
  const stockStatus = getStockStatus(cart.stock);
  const lineTotal = (cart.price ?? 0) * (cart.quantity ?? 0);
  const lineOriginal = cart.original_price ? cart.original_price * (cart.quantity ?? 0) : null;
  const name = getCartItemName(cart);
  const productHref = `/product/${cart.product_id}`;
  const isBusy = isUpdating || isRemoving;

  return (
    <li
      id={getCartItemElementId(cartItemId)}
      className={cn(
        'bg-card border-border/50 overflow-hidden rounded-2xl border shadow-sm',
        needsAttention && 'border-gold/40 ring-gold/10 ring-1'
      )}
    >
      <Flex direction='row' gap={3} className='p-3'>
        <Link
          href={productHref}
          className='bg-muted relative size-16 shrink-0 overflow-hidden rounded-xl'
          aria-label={name}
        >
          <AppImage
            src={getCartItemImage(cart)}
            alt=''
            aria-hidden
            fill
            sizes='64px'
            className='object-cover'
          />
        </Link>

        <Flex direction='column' gap={2} className='min-w-0 flex-1'>
          <Flex direction='row' align='start' justify='between' gap={2}>
            <Link href={productHref} className='min-w-0 flex-1'>
              <Typography.Small weight='medium' className='line-clamp-2 leading-snug'>
                {name}
              </Typography.Small>
              {cart.selected_color || cart.selected_size ? (
                <Typography.Muted className='mt-0.5 text-xs'>
                  {[cart.selected_color, cart.selected_size].filter(Boolean).join(' · ')}
                </Typography.Muted>
              ) : null}
            </Link>
            <Typography.Text
              weight='semibold'
              className={cn(cartMoneyClassName, 'shrink-0 text-end tabular-nums')}
            >
              {formatCartMoney(lineTotal)}
            </Typography.Text>
          </Flex>

          <Flex direction='row' align='center' gap={1.5} wrap='wrap'>
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
              <Badge variant='outline' size='sm' className='border-gold/50 text-gold'>
                Select options
              </Badge>
            ) : null}
            {lineOriginal !== null && lineOriginal > lineTotal ? (
              <Typography.Muted
                className={cn('text-xs tabular-nums line-through', cartMoneyClassName)}
              >
                {formatCartMoney(lineOriginal)}
              </Typography.Muted>
            ) : null}
          </Flex>

          <Flex direction='row' align='center' gap={2}>
            <div className='border-border bg-background flex h-10 items-center rounded-full border'>
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                className='rounded-l-full'
                onClick={() => updateCartItemQuantity(cartItemId, (cart.quantity ?? 0) - 1)}
                disabled={isBusy || (cart.quantity ?? 0) <= 1}
                aria-label='Decrease quantity'
              >
                <IconMinus className='size-4' />
              </Button>
              <Typography.Small
                weight='semibold'
                className='min-w-8 text-center text-sm tabular-nums'
                aria-live='polite'
              >
                {cart.quantity}
              </Typography.Small>
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                className='rounded-r-full'
                onClick={() => updateCartItemQuantity(cartItemId, (cart.quantity ?? 0) + 1)}
                disabled={isBusy || (cart.quantity ?? 0) >= (cart.stock ?? 99)}
                aria-label='Increase quantity'
              >
                <IconPlus className='size-4' />
              </Button>
            </div>

            {hasOptions ? (
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='h-10 rounded-full px-3 text-xs'
                onClick={() => setOptionsOpen((open) => !open)}
              >
                Options
                <IconChevronDown
                  className={cn('ms-1 size-3.5 transition-transform', optionsOpen && 'rotate-180')}
                />
              </Button>
            ) : null}

            <button
              type='button'
              onClick={() => removeCartItem(cartItemId)}
              disabled={isRemoving}
              className={cn(
                'text-muted-foreground hover:text-destructive ms-auto flex size-9 shrink-0 items-center justify-center rounded-full',
                'hover:bg-destructive/10 transition-colors disabled:opacity-50'
              )}
              aria-label={`Remove ${name}`}
            >
              {isRemoving ? <Spinner className='size-4' /> : <IconX className='size-4' />}
            </button>
          </Flex>
        </Flex>
      </Flex>

      {hasOptions ? (
        <Collapsible open={optionsOpen} onOpenChange={setOptionsOpen}>
          <CollapsibleContent className='border-border/50 bg-muted/30 space-y-3 border-t px-3 py-3'>
            {hasColorOptions ? (
              <Flex direction='column' gap={1.5}>
                <Typography.Muted className='text-[10px] font-medium tracking-wide uppercase'>
                  Color
                </Typography.Muted>
                <Flex direction='row' gap={1.5} wrap='wrap'>
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
                <Flex direction='row' gap={1.5} wrap='wrap'>
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
          </CollapsibleContent>
        </Collapsible>
      ) : null}
    </li>
  );
}
