'use client';

import { IconBasketCheck, IconEye, IconShoppingBag, IconStarFilled } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { MouseEvent } from 'react';
import { useEffect, useState } from 'react';

import { AppImage } from '@/components/ui/app-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lens } from '@/components/ui/lens';
import { getProductPath } from '@/domains/product/lib/product-routes';
import {
  ProductCardColorSwatches,
  ProductCardStarRating
} from '@/domains/shop/components/product-card-meta';
import { ProductCardToolbar } from '@/domains/shop/components/product-card-toolbar';
import {
  PRODUCT_CARD_HEIGHT_COMPACT,
  PRODUCT_CARD_HEIGHT_DEFAULT,
  PRODUCT_CARD_HEIGHT_DENSE,
  PRODUCT_CARD_INFO_MIN_HEIGHT_COMPACT,
  PRODUCT_CARD_INFO_MIN_HEIGHT_DEFAULT,
  PRODUCT_CARD_INFO_MIN_HEIGHT_DENSE,
  PRODUCT_CARD_INFO_TOP_RADIUS_COMPACT,
  PRODUCT_CARD_INFO_TOP_RADIUS_DEFAULT
} from '@/domains/shop/lib/product-card-layout';
import { type CartItemPayload, useCartController } from '@/hooks/useCartController';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

export interface ProductCardProps {
  product: DtoProductWithLike;
  index?: number;
  /** `dense` is for homepage rails; shop/collection stay on `default` / `compact`. */
  size?: 'default' | 'compact' | 'dense';
  /** Preload above-the-fold images for LCP (maps to Next.js `priority`). */
  priority?: boolean;
}

const LOW_STOCK_THRESHOLD = 5;

function getStockStatus(stock?: number) {
  const quantity = stock ?? 0;
  if (quantity <= 0) return 'out' as const;
  if (quantity <= LOW_STOCK_THRESHOLD) return 'low' as const;
  return 'in' as const;
}

export function ProductCard({
  product,
  index: _index = 0,
  size = 'default',
  priority = false
}: ProductCardProps) {
  const t = useTranslations('shop.productCard');
  const { formatPrice, formatDecimal, formatInteger, moneyClassName } = useLocaleFormatters();
  const isCompact = size === 'compact' || size === 'dense';
  const isDense = size === 'dense';
  const { increment, isLoading, items: cartItems } = useCartController();
  const [canHoverLens, setCanHoverLens] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setCanHoverLens(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const productHref = getProductPath(product);
  const primaryImage = product.images?.[0] || IMAGE_FALLBACK;
  const secondaryImage = product.images?.[1];
  const categoryName = product.category?.name;
  const stockStatus = getStockStatus(product.stock);
  const isOutOfStock = stockStatus === 'out';
  const isLowStock = stockStatus === 'low';

  const discountPercent = product.compare_at_price
    ? Math.round(
        ((product.compare_at_price - (product.price as number)) / product.compare_at_price) * 100
      )
    : 0;

  const cartItem = cartItems?.find((item) => item.product_id === product.id);
  const cartQuantity = cartItem?.quantity ?? 0;

  const mapToBasket = (values: DtoProductWithLike): CartItemPayload => ({
    color: values.colors?.[0]?.toString(),
    size: values.sizes?.[0]?.toString(),
    image_url: values.images?.[0],
    is_in_stock: Number(values.stock) > 0,
    price: values.price,
    product_id: values.id,
    product_name: values.name,
    stock: values.stock
  });

  const handleAddToCart = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (isOutOfStock) return;
    increment(mapToBasket(product));
  };

  const getButtonText = () => {
    if (isLoading) return isCompact ? '...' : t('adding');
    if (isOutOfStock) return isCompact ? t('soldOut') : t('outOfStock');
    if (cartQuantity > 0) {
      return isCompact ? formatInteger(cartQuantity) : t('inCart', { count: cartQuantity });
    }
    return isCompact ? t('add') : t('addToCart');
  };

  const showLens = canHoverLens && !isCompact;
  const showSecondaryImage = Boolean(secondaryImage) && !showLens;
  const cardHeight = isDense
    ? PRODUCT_CARD_HEIGHT_DENSE
    : isCompact
      ? PRODUCT_CARD_HEIGHT_COMPACT
      : PRODUCT_CARD_HEIGHT_DEFAULT;
  const infoTopRadius = isCompact
    ? PRODUCT_CARD_INFO_TOP_RADIUS_COMPACT
    : PRODUCT_CARD_INFO_TOP_RADIUS_DEFAULT;
  const infoMinHeight = isDense
    ? PRODUCT_CARD_INFO_MIN_HEIGHT_DENSE
    : isCompact
      ? PRODUCT_CARD_INFO_MIN_HEIGHT_COMPACT
      : PRODUCT_CARD_INFO_MIN_HEIGHT_DEFAULT;

  const productImage = (
    <div
      className={cn(
        'bg-muted relative h-full w-full overflow-hidden rounded-b-none',
        showLens && 'cursor-crosshair'
      )}
    >
      <AppImage
        src={primaryImage}
        alt={product.name ?? 'Product'}
        fill
        priority={priority}
        sizes={isCompact ? '(max-width: 640px) 50vw, 20vw' : '(max-width: 640px) 100vw, 25vw'}
        className={cn(
          'object-cover transition-all duration-700 ease-out',
          showSecondaryImage
            ? 'group-hover:scale-[1.03] group-hover:opacity-0'
            : 'group-hover:scale-[1.04]'
        )}
      />

      {showSecondaryImage && secondaryImage ? (
        <AppImage
          src={secondaryImage}
          alt=''
          aria-hidden
          fill
          loading='lazy'
          sizes={isCompact ? '(max-width: 640px) 50vw, 20vw' : '(max-width: 640px) 100vw, 25vw'}
          className='object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100'
        />
      ) : null}

      {isOutOfStock ? (
        <div className='bg-background/55 absolute inset-0 flex items-center justify-center backdrop-blur-[2px]'>
          <Badge variant='inverse' size={isCompact ? 'sm' : 'default'}>
            {t('soldOut')}
          </Badge>
        </div>
      ) : null}
    </div>
  );

  return (
    <div className='h-full'>
      <article
        className={cn(
          'group bg-card relative w-full overflow-hidden rounded-2xl border shadow-sm transition-all duration-300',
          'border-border/50 hover:border-accent/35 hover:shadow-accent/8 hover:-translate-y-1 hover:shadow-xl',
          cardHeight,
          isCompact && 'rounded-xl'
        )}
      >
        {/* Full-bleed image behind info sheet */}
        <div className='absolute inset-0 z-0 overflow-hidden'>
          <Link
            href={productHref}
            className='block h-full'
            aria-label={t('viewProduct', { name: product.name ?? '' })}
          >
            {showLens ? (
              <Lens zoomFactor={1.6} lensSize={140} className='h-full rounded-none'>
                {productImage}
              </Lens>
            ) : (
              productImage
            )}
          </Link>

          <div
            className={cn(
              'pointer-events-none absolute start-2.5 top-2.5 z-10 flex flex-col gap-1.5',
              isCompact && 'start-2 top-2 gap-1'
            )}
          >
            {product.is_new ? (
              <Badge variant='inverse' size={isCompact ? 'sm' : 'default'}>
                {t('new')}
              </Badge>
            ) : null}
            {discountPercent > 0 ? (
              <Badge variant='accent' size={isCompact ? 'sm' : 'default'} className='tabular-nums'>
                {t('discountBadge', { percent: discountPercent / 100 })}
              </Badge>
            ) : null}
            {product.is_digital ? (
              <Badge variant='accentOutline' size={isCompact ? 'sm' : 'default'}>
                {t('digital')}
              </Badge>
            ) : null}
            {isLowStock && !isOutOfStock && product.stock != null ? (
              <Badge
                variant='outline'
                size={isCompact ? 'sm' : 'default'}
                className='bg-background/90 tabular-nums'
              >
                {t('onlyLeft', { count: product.stock })}
              </Badge>
            ) : null}
          </div>

          <ProductCardToolbar
            productId={product.id as number}
            productName={product.name || ''}
            productHref={productHref}
            isLiked={product.is_liked ?? false}
            compact={isCompact}
          />
        </div>

        {/* Info sheet — docked to bottom, rounded top overlaps image */}
        <div
          className={cn(
            'bg-card absolute inset-x-0 bottom-0 z-10 flex flex-col shadow-[0_-10px_28px_-6px_rgba(0,0,0,0.45)]',
            infoTopRadius,
            infoMinHeight,
            isCompact ? 'gap-1.5 p-2.5 pt-3 sm:p-3 sm:pt-3.5' : 'gap-1.5 p-4 pt-4'
          )}
        >
          <div className='space-y-1'>
            {categoryName ? (
              <p className='text-muted-foreground text-[10px] tracking-[0.18em] uppercase sm:text-xs'>
                {categoryName}
              </p>
            ) : null}

            <Link href={productHref} className='block'>
              <h3
                className={cn(
                  'font-display group-hover:text-accent line-clamp-2 leading-snug transition-colors',
                  isCompact ? 'text-sm font-medium' : 'text-base font-medium sm:text-lg'
                )}
              >
                {product.name}
              </h3>
            </Link>
          </div>

          {!isCompact && (product.rating || product.reviews_count) ? (
            <div className='text-muted-foreground flex items-center gap-2 text-xs'>
              <ProductCardStarRating rating={product.rating} />
              <span className='text-foreground/80 font-medium tabular-nums'>
                {formatDecimal(product.rating ?? 0, 1)}
              </span>
              {product.reviews_count ? (
                <span className='tabular-nums'>({formatInteger(product.reviews_count)})</span>
              ) : null}
            </div>
          ) : null}

          {isCompact && product.rating ? (
            <div className='text-muted-foreground flex items-center gap-1 text-[11px]'>
              <IconStarFilled className='fill-accent text-accent h-3 w-3' />
              <span className='tabular-nums'>{formatDecimal(product.rating, 1)}</span>
            </div>
          ) : null}

          <ProductCardColorSwatches
            colors={product.colors}
            compact={isCompact}
            moreColorsLabel={(count) => t('moreColors', { count })}
          />

          <div
            className={cn(
              'flex flex-wrap items-baseline gap-x-2 gap-y-1',
              isCompact ? 'pt-0.5' : 'pt-1'
            )}
          >
            <span
              className={cn(
                'text-foreground font-semibold tabular-nums',
                moneyClassName,
                isCompact ? 'text-sm' : 'text-base'
              )}
            >
              {formatPrice(product.price)}
            </span>
            {product.compare_at_price && product.compare_at_price > (product.price ?? 0) ? (
              <>
                <span
                  className={cn(
                    'text-muted-foreground text-xs tabular-nums line-through sm:text-sm',
                    moneyClassName
                  )}
                >
                  {formatPrice(product.compare_at_price)}
                </span>
                {!isCompact && discountPercent > 0 ? (
                  <span className='text-accent text-xs font-medium tabular-nums'>
                    {t('savePercent', { percent: discountPercent / 100 })}
                  </span>
                ) : null}
              </>
            ) : null}
          </div>

          <div className='mt-auto flex gap-2 pt-2'>
            {!isCompact ? (
              <Button asChild size='sm' variant='secondary' className='h-9 flex-1 gap-1.5'>
                <Link href={productHref}>
                  <IconEye className='h-4 w-4' />
                  {t('view')}
                </Link>
              </Button>
            ) : null}

            <Button
              onClick={handleAddToCart}
              disabled={isLoading || isOutOfStock}
              className={cn(
                isCompact ? 'h-8 flex-1 gap-1 text-xs' : 'h-9 flex-1 gap-1.5',
                !isCompact && 'sm:flex-[1.2]'
              )}
              size='sm'
              variant={cartQuantity > 0 ? 'secondary' : 'default'}
            >
              {cartQuantity > 0 ? (
                <IconBasketCheck className={isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
              ) : (
                <IconShoppingBag className={isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
              )}
              {getButtonText()}
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
