'use client';

import { IconHeartFilled, IconMinus, IconPlus, IconShoppingCart } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { AppImage } from '@/components/ui/app-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { formatOrderAmount } from '@/domains/account/lib/order-utils';
import { type CartItemPayload, useCartController } from '@/hooks/useCartController';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { DtoWishlistItemDTO } from '~/src/services/-account-wishlist-get.schemas';

type WishlistSheetItemProps = {
  item: DtoWishlistItemDTO;
  index: number;
  isRemoving?: boolean;
  onRemove: (productId: number) => void;
  onNavigate?: () => void;
};

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

export function WishlistSheetItem({
  item,
  index,
  isRemoving = false,
  onRemove,
  onNavigate
}: WishlistSheetItemProps) {
  const t = useTranslations('account.wishlist');
  const { increment, decrement, getProductQuantity, isAdding } = useCartController();

  const productId = item.product_id;
  if (!productId) return null;

  const productQuantity = getProductQuantity(productId);
  const stock = item.stock ?? item.stock_quantity ?? 0;
  const cartPayload = toCartPayload(item);
  const name = item.product_name ?? t('noImage');
  const hasDiscount =
    typeof item.old_price === 'number' &&
    typeof item.price === 'number' &&
    item.old_price > item.price;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ delay: index * 0.03 }}
      className='flex gap-4 py-4'
    >
      <Link
        href={`/product/${productId}`}
        onClick={onNavigate}
        className='bg-muted relative h-24 w-20 shrink-0 overflow-hidden rounded-xl'
      >
        <AppImage
          src={item.image_url ?? IMAGE_FALLBACK}
          alt={name}
          fill
          sizes='80px'
          className='object-cover transition-transform duration-300 hover:scale-105'
        />
        {!item.is_in_stock ? (
          <Flex align='center' justify='center' className='absolute inset-0 bg-black/45'>
            <Badge variant='destructive' size='sm'>
              {t('outOfStock')}
            </Badge>
          </Flex>
        ) : null}
      </Link>

      <Flex direction='column' className='min-w-0 flex-1'>
        <Flex align='start' justify='between' spacing={2}>
          <Flex direction='column' spacing={1} className='min-w-0'>
            <Link
              href={`/product/${productId}`}
              onClick={onNavigate}
              className='hover:text-accent line-clamp-2 leading-tight font-medium transition-colors'
            >
              {name}
            </Link>
            <Flex align='baseline' spacing={2} className='flex-wrap'>
              <Typography.Text className='text-sm font-semibold tabular-nums'>
                {formatOrderAmount(item.price)}
              </Typography.Text>
              {hasDiscount ? (
                <Typography.Muted className='text-xs tabular-nums line-through'>
                  {formatOrderAmount(item.old_price)}
                </Typography.Muted>
              ) : null}
              {hasDiscount && item.discount_percent ? (
                <Badge size='sm' className='border-none bg-emerald-600 text-white'>
                  -{item.discount_percent}%
                </Badge>
              ) : null}
            </Flex>
          </Flex>

          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            className='text-muted-foreground hover:text-destructive shrink-0 rounded-full'
            onClick={() => onRemove(productId)}
            disabled={isRemoving}
            loading={isRemoving}
            aria-label={t('removeAria')}
          >
            {!isRemoving ? <IconHeartFilled className='size-4 text-red-500' /> : null}
          </Button>
        </Flex>

        <Flex align='center' justify='between' className='mt-auto pt-3'>
          {productQuantity > 0 ? (
            <div className='border-border bg-background flex items-center rounded-full border'>
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                className='rounded-l-full'
                onClick={() => decrement(cartPayload)}
                aria-label='Decrease quantity'
              >
                <IconMinus className='size-3.5' />
              </Button>
              <span className='w-8 text-center text-sm font-medium tabular-nums'>
                {productQuantity}
              </span>
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                className='rounded-r-full'
                disabled={productQuantity >= stock || !item.is_in_stock}
                onClick={() => increment(cartPayload)}
                aria-label='Increase quantity'
              >
                <IconPlus className='size-3.5' />
              </Button>
            </div>
          ) : (
            <Button
              type='button'
              size='sm'
              className={cn('rounded-full', !item.is_in_stock && 'w-full')}
              disabled={!item.is_in_stock || isAdding}
              onClick={() => increment(cartPayload)}
            >
              <IconShoppingCart className='size-4' />
              {item.is_in_stock ? t('addToCart') : t('unavailable')}
            </Button>
          )}
        </Flex>
      </Flex>
    </motion.div>
  );
}
