'use client';

import {
  IconBasketCheck,
  IconEye,
  IconShoppingBag,
  IconStar,
  IconStarFilled
} from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import { LikeButton } from '@/components/buttons/like-button';
import { AppImage } from '@/components/ui/app-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lens } from '@/components/ui/lens';
import { getProductPath } from '@/domains/product/lib/product-routes';
import { type CartItemPayload, useCartController } from '@/hooks/useCartController';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

export interface ProductCardProps {
  product: DtoProductWithLike;
  index?: number;
  size?: 'default' | 'compact';
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

function StarRating({ rating = 0, compact = false }: { rating?: number; compact?: boolean }) {
  const rounded = Math.round(rating);

  return (
    <div className='flex items-center gap-0.5'>
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < rounded;
        const Icon = filled ? IconStarFilled : IconStar;

        return (
          <Icon
            key={index}
            className={cn(
              compact ? 'h-3 w-3' : 'h-3.5 w-3.5',
              filled ? 'fill-accent text-accent' : 'text-muted-foreground/35'
            )}
          />
        );
      })}
    </div>
  );
}

function ColorSwatches({
  colors,
  compact = false,
  moreColorsLabel
}: {
  colors?: unknown[];
  compact?: boolean;
  moreColorsLabel?: (count: number) => string;
}) {
  const swatches = (colors ?? [])
    .map((color) => (typeof color === 'string' ? color : null))
    .filter(Boolean)
    .slice(0, compact ? 3 : 4) as string[];

  if (swatches.length === 0) return null;

  const remaining = (colors?.length ?? 0) - swatches.length;

  return (
    <div className='flex items-center gap-1.5'>
      {swatches.map((color) => (
        <span
          key={color}
          title={color}
          className={cn(
            'ring-border/60 rounded-full ring-1 ring-inset',
            compact ? 'h-3 w-3' : 'h-3.5 w-3.5'
          )}
          style={{ backgroundColor: color }}
        />
      ))}
      {remaining > 0 && moreColorsLabel ? (
        <span className='text-muted-foreground text-[10px] font-medium tabular-nums'>
          {moreColorsLabel(remaining)}
        </span>
      ) : null}
    </div>
  );
}

export function ProductCard({
  product,
  index: _index = 0,
  size = 'default',
  priority = false
}: ProductCardProps) {
  const t = useTranslations('shop.productCard');
  const { formatPrice, formatDecimal, formatInteger, moneyClassName } = useLocaleFormatters();
  const isCompact = size === 'compact';
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

  const handleAddToCart = (event: React.MouseEvent) => {
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

  const productImage = (
    <div
      className={cn(
        'bg-muted relative block aspect-4/5 overflow-hidden',
        isCompact ? 'rounded-t-xl' : 'rounded-t-2xl',
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

      <div className='from-foreground/30 pointer-events-none absolute inset-0 bg-linear-to-t via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

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
          'group bg-card flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300',
          'border-border/50 hover:border-accent/35 hover:shadow-accent/8 hover:-translate-y-1 hover:shadow-xl',
          isCompact && 'rounded-xl'
        )}
      >
        <div className='relative'>
          <Link
            href={productHref}
            className='block'
            aria-label={t('viewProduct', { name: product.name ?? '' })}
          >
            {showLens ? (
              <Lens
                zoomFactor={1.6}
                lensSize={140}
                className={isCompact ? 'rounded-t-xl' : 'rounded-t-2xl'}
              >
                {productImage}
              </Lens>
            ) : (
              productImage
            )}
          </Link>

          <div
            className={cn(
              'pointer-events-none absolute start-2.5 top-2.5 flex flex-col gap-1.5',
              isCompact && 'start-2 top-2 gap-1'
            )}
          >
            {product.is_new && (
              <Badge variant='inverse' size={isCompact ? 'sm' : 'default'}>
                {t('new')}
              </Badge>
            )}
            {discountPercent > 0 && (
              <Badge variant='accent' size={isCompact ? 'sm' : 'default'} className='tabular-nums'>
                {t('discountBadge', { percent: discountPercent / 100 })}
              </Badge>
            )}
            {product.is_digital && (
              <Badge variant='accentOutline' size={isCompact ? 'sm' : 'default'}>
                {t('digital')}
              </Badge>
            )}
            {isLowStock && !isOutOfStock && product.stock != null && (
              <Badge
                variant='outline'
                size={isCompact ? 'sm' : 'default'}
                className='bg-background/90 tabular-nums'
              >
                {t('onlyLeft', { count: product.stock })}
              </Badge>
            )}
          </div>

          <LikeButton
            isLiked={product.is_liked ?? false}
            productId={product.id as number}
            productName={product.name || ''}
            className={cn(
              'bg-background/90 hover:bg-background absolute end-2.5 top-2.5 rounded-full shadow-sm backdrop-blur-sm transition-opacity',
              'opacity-100 sm:opacity-0 sm:group-hover:opacity-100'
            )}
          />

          <div
            className={cn(
              'absolute inset-x-2.5 bottom-2.5 flex gap-2 transition-all duration-300 sm:inset-x-3 sm:bottom-3',
              isCompact
                ? 'translate-y-0 opacity-100'
                : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
            )}
          >
            {!isCompact && (
              <Button
                asChild
                size='sm'
                variant='secondary'
                className='bg-background/95 hover:bg-background h-9 flex-1 gap-1.5 shadow-lg backdrop-blur-sm'
              >
                <Link href={productHref}>
                  <IconEye className='h-4 w-4' />
                  {t('view')}
                </Link>
              </Button>
            )}

            <Button
              onClick={handleAddToCart}
              disabled={isLoading || isOutOfStock}
              className={cn(
                'shadow-lg',
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

        <div
          className={cn(
            'flex flex-1 flex-col',
            isCompact ? 'gap-1.5 p-2.5 sm:p-3' : 'gap-2 p-4 pt-3.5'
          )}
        >
          <div className='space-y-1'>
            {product.category?.name && (
              <p className='text-muted-foreground text-[10px] tracking-[0.18em] uppercase sm:text-xs'>
                {product.category.name}
              </p>
            )}

            <Link href={productHref} className='block'>
              <h3
                className={cn(
                  'font-display group-hover:text-accent line-clamp-2 truncate leading-snug transition-colors',
                  isCompact ? 'text-sm font-medium' : 'text-base font-medium sm:text-lg'
                )}
              >
                {product.name}
              </h3>
            </Link>
          </div>

          {!isCompact && (product.rating || product.reviews_count) ? (
            <div className='text-muted-foreground flex items-center gap-2 text-xs'>
              <StarRating rating={product.rating} />
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

          <ColorSwatches
            colors={product.colors}
            compact={isCompact}
            moreColorsLabel={(count) => t('moreColors', { count })}
          />

          <div
            className={cn(
              'mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-1',
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
            {product.compare_at_price && product.compare_at_price > (product.price ?? 0) && (
              <>
                <span
                  className={cn(
                    'text-muted-foreground text-xs tabular-nums line-through sm:text-sm',
                    moneyClassName
                  )}
                >
                  {formatPrice(product.compare_at_price)}
                </span>
                {!isCompact && discountPercent > 0 && (
                  <span className='text-accent text-xs font-medium tabular-nums'>
                    {t('savePercent', { percent: discountPercent / 100 })}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
