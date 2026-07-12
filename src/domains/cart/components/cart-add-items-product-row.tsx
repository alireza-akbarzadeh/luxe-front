'use client';

import { IconMinus, IconPlus, IconShoppingBag } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { AppImage } from '@/components/ui/app-image';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { type CartItemPayload, useCartController } from '@/hooks/useCartController';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { DtoProductResponse } from '@/services/-search-get.schemas';

interface CartAddItemsProductRowProps {
  product: DtoProductResponse;
}

function toCartPayload(product: DtoProductResponse): CartItemPayload {
  const stock = product.stock ?? 0;

  return {
    product_id: product.id,
    product_name: product.name,
    price: product.price,
    stock,
    is_in_stock: stock > 0 || product.allow_backorder === true,
    image_url: product.images?.[0]
  };
}

/** Search result row with inline basket controls — stays on the cart page. */
export function CartAddItemsProductRow({ product }: CartAddItemsProductRowProps) {
  const t = useTranslations('cart.mobileSummary.addItemsDrawer');
  const tCard = useTranslations('shop.productCard');
  const { formatPrice, moneyClassName } = useLocaleFormatters();
  const { getProductQuantity, increment, decrement, isAdding, isUpdating } = useCartController();

  const productId = product.id;
  const quantity = getProductQuantity(productId);
  const inCart = quantity > 0;
  const stock = product.stock ?? 0;
  const isOutOfStock = stock <= 0 && product.allow_backorder !== true;
  const isMaxReached = quantity >= stock && stock > 0;
  const payload = toCartPayload(product);
  const isBusy = isAdding || isUpdating;

  return (
    <Flex
      direction='row'
      align='center'
      gap={3}
      className='border-border/60 bg-card/80 rounded-2xl border p-3'
    >
      <div className='bg-muted relative size-16 shrink-0 overflow-hidden rounded-xl'>
        <AppImage
          src={product.images?.[0] ?? IMAGE_FALLBACK}
          alt={product.name ?? ''}
          fill
          sizes='64px'
          className='object-cover'
        />
      </div>

      <Flex direction='column' align='start' gap={1} className='min-w-0 flex-1'>
        <Typography.Small weight='semibold' className='line-clamp-2 leading-snug'>
          {product.name}
        </Typography.Small>
        <Typography.Text className={cn('text-sm font-bold tabular-nums', moneyClassName)}>
          {formatPrice(product.price ?? 0)}
        </Typography.Text>
      </Flex>

      {inCart ? (
        <Flex
          direction='row'
          align='center'
          className='bg-muted/50 border-border/70 h-11 shrink-0 rounded-xl border px-1'
        >
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='h-9 w-9 shrink-0 rounded-lg'
            onClick={() => decrement(payload)}
            disabled={isBusy}
            aria-label={t('decreaseQuantity')}
          >
            <IconMinus className='h-4 w-4' />
          </Button>
          <Typography.Text className='min-w-8 text-center text-sm font-semibold tabular-nums'>
            {quantity}
          </Typography.Text>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='bg-accent text-accent-foreground hover:bg-accent/90 h-9 w-9 shrink-0 rounded-lg'
            onClick={() => increment(payload, { openSheet: false })}
            disabled={isBusy || isMaxReached || isOutOfStock}
            aria-label={t('increaseQuantity')}
          >
            <IconPlus className='h-4 w-4' />
          </Button>
        </Flex>
      ) : (
        <Button
          type='button'
          size='sm'
          className='bg-accent text-accent-foreground hover:bg-accent/90 h-11 shrink-0 rounded-xl px-3 text-sm font-semibold'
          onClick={() => increment(payload, { openSheet: false })}
          disabled={isBusy || isOutOfStock}
        >
          <IconShoppingBag className='me-1.5 h-4 w-4' aria-hidden />
          {isOutOfStock ? tCard('soldOut') : t('addToCart')}
        </Button>
      )}
    </Flex>
  );
}
