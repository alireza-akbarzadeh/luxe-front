'use client';

import { IconHeartFilled, IconMinus, IconPlus, IconShoppingBag } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { AppImage } from '@/components/ui/app-image';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Spinner } from '@/components/ui/spinner';
import { Typography } from '@/components/ui/typography';
import { formatOrderAmount } from '@/domains/account/lib/order-utils';
import { type CartItemPayload, useCartController } from '@/hooks/useCartController';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { DtoWishlistItemDTO } from '@/services/-account-wishlist-get.schemas';

interface WishlistItemRowProps {
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

/** Native-style list row for mobile wishlist — full-width tap targets, no cramped grid. */
export function WishlistItemRow({ item, isRemoving = false, onRemove }: WishlistItemRowProps) {
  const t = useTranslations('account.wishlist');
  const tCommon = useTranslations('account.common');
  const { increment, decrement, getProductQuantity, isAdding } = useCartController();

  const productId = item.product_id;
  if (!productId) return null;

  const productQuantity = getProductQuantity(productId);
  const stock = item.stock ?? item.stock_quantity ?? 0;
  const cartPayload = toCartPayload(item);
  const hasDiscount =
    typeof item.old_price === 'number' &&
    typeof item.price === 'number' &&
    item.old_price > item.price;
  const productHref = `/product/${productId}`;

  return (
    <li className='bg-card border-border/60 flex gap-3 rounded-2xl border p-3 shadow-sm'>
      <Link
        href={productHref}
        className='bg-muted relative size-[4.75rem] shrink-0 overflow-hidden rounded-xl sm:size-20'
        aria-label={item.product_name ?? tCommon('product')}
      >
        <AppImage
          src={item.image_url ?? IMAGE_FALLBACK}
          alt=''
          aria-hidden
          fill
          sizes='80px'
          className='object-cover'
        />
        {!item.is_in_stock ? (
          <span className='absolute inset-0 flex items-center justify-center bg-black/45 text-[10px] font-semibold text-white'>
            {t('outOfStock')}
          </span>
        ) : null}
      </Link>

      <Flex direction='column' gap={2} className='min-w-0 flex-1'>
        <Link href={productHref} className='min-w-0'>
          <Typography.Small weight='medium' className='line-clamp-2 leading-snug'>
            {item.product_name}
          </Typography.Small>
        </Link>

        <button
          type='button'
          onClick={() => onRemove(productId)}
          disabled={isRemoving}
          className={cn(
            'text-destructive flex size-7 items-center justify-start rounded-full',
            'hover:bg-destructive/10 transition-colors disabled:opacity-50'
          )}
          aria-label={t('removeAria')}
        >
          {isRemoving ? (
            <Spinner className='size-4' />
          ) : (
            <IconHeartFilled className='size-4 fill-current' />
          )}
        </button>

        <Flex
          direction='row'
          align='center'
          gap={2}
          wrap='wrap'
          className='justify-center sm:justify-start'
        >
          <Typography.Text weight='semibold' className='text-base tabular-nums'>
            {formatOrderAmount(item.price)}
          </Typography.Text>
          {hasDiscount ? (
            <Typography.Muted className='text-sm tabular-nums line-through'>
              {formatOrderAmount(item.old_price)}
            </Typography.Muted>
          ) : null}
          {hasDiscount && item.discount_percent ? (
            <span className='rounded-full bg-emerald-600/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400'>
              -{item.discount_percent}%
            </span>
          ) : null}
        </Flex>

        {productQuantity > 0 ? (
          <Flex
            direction='row'
            align='center'
            justify='between'
            className='bg-background h-10 w-full rounded-full border px-2'
          >
            <Button
              type='button'
              variant='ghost'
              size='icon-sm'
              className='size-8 shrink-0 rounded-full'
              onClick={() => decrement(cartPayload)}
              aria-label='Decrease quantity'
            >
              <IconMinus className='size-4' />
            </Button>
            <Typography.Small weight='semibold' className='min-w-6 text-center tabular-nums'>
              {productQuantity}
            </Typography.Small>
            <Button
              type='button'
              variant='ghost'
              size='icon-sm'
              className='size-8 shrink-0 rounded-full'
              disabled={productQuantity >= stock || !item.is_in_stock}
              onClick={() => increment(cartPayload)}
              aria-label='Increase quantity'
            >
              <IconPlus className='size-4' />
            </Button>
          </Flex>
        ) : (
          <Button
            type='button'
            size='sm'
            className='h-10 w-full rounded-full'
            disabled={!item.is_in_stock || isAdding}
            onClick={() => increment(cartPayload)}
          >
            <IconShoppingBag className='size-4' />
            {item.is_in_stock ? t('addToCart') : t('unavailable')}
          </Button>
        )}
      </Flex>
    </li>
  );
}
