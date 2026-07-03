'use client';

import {
  IconArrowsLeftRight,
  IconBasket,
  IconPackage,
  IconRosetteDiscountCheck,
  IconShare2,
  IconShieldCheck,
  IconStar,
  IconStarFilled,
  IconTruck
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { LikeButton } from '@/components/buttons/like-button';
import { useAuth } from '@/components/providers/auth-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useCompareController from '@/domains/compare/hooks/useCompareController';
import { type CartItemPayload, useCartController } from '@/hooks/useCartController';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { cn } from '@/lib/utils';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';
import { useCartStore } from '~/src/store/card.store';

import { ProductAiBriefButton } from './product-ai-brief-sheet';
import { ProductFeatureHighlights } from './product-feature-highlights';
import ProductQuantity from './product-quantity';
import { ProductStockNotify } from './product-stock-notify';
import { ProductVariantAttributes } from './product-variant-attributes';

interface ProductInfoProps {
  product: DtoProductWithLike;
  is_liked: boolean;
}

const iconActionClassName =
  'border-border/80 bg-background hover:bg-muted h-11 w-11 shrink-0 rounded-full border shadow-sm';

export function ProductInfo({ product, is_liked }: ProductInfoProps) {
  const t = useTranslations('pdp.info');
  const tBreadcrumb = useTranslations('pdp.breadcrumb');
  const tCard = useTranslations('shop.productCard');
  const { formatPrice, formatDecimal, formatInteger, moneyClassName } = useLocaleFormatters();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { increment, decrement, itemCount, items, isLoading } = useCartController();
  const openCart = useCartStore((state) => state.openCart);
  const { addItem, isInCompare, canAddMore } = useCompareController();

  const [variantSelections, setVariantSelections] = useState<Record<string, string>>({});

  const cartItem = items.find((item) => item.product_id === product.id);
  const stock = product.stock ?? 0;
  const productQuantity = cartItem?.quantity ?? 0;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;
  const inCompare = product.id ? isInCompare(product.id) : false;

  const selectedColor =
    variantSelections['color'] ??
    variantSelections['colors'] ??
    variantSelections['colour'] ??
    variantSelections['colours'];
  const selectedSize = variantSelections['size'] ?? variantSelections['sizes'];

  const discountAmount =
    product.compare_at_price && product.compare_at_price > Number(product.price ?? 0)
      ? product.compare_at_price - Number(product.price)
      : 0;

  const mapToBasket = (values: DtoProductWithLike): CartItemPayload => ({
    color: selectedColor,
    size: selectedSize,
    image_url: values.images?.[0],
    is_in_stock: Number(values.stock) > 0,
    price: values.price,
    product_id: values.id,
    product_name: values.name,
    stock: values.stock
  });

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    increment(mapToBasket(product));
  };

  const handleCompare = () => {
    if (!product.id) return;
    if (!isAuthenticated) {
      toast.message(t('toastSignInCompare'));
      return;
    }
    if (inCompare) {
      router.push('/compare');
      return;
    }
    if (!canAddMore) {
      toast.info(t('toastCompareFull'));
      router.push('/compare');
      return;
    }
    void addItem(product.id);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name ?? tBreadcrumb('product'), url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success(t('toastLinkCopied'));
    } catch {
      toast.error(t('toastShareFailed'));
    }
  };

  const trustItems = [
    { icon: IconTruck, label: t('freeShipping') },
    { icon: IconRosetteDiscountCheck, label: t('authenticity') },
    { icon: IconShieldCheck, label: t('returns') }
  ] as const;

  const cartBadgeLabel = itemCount > 99 ? t('cartBadgeMax') : formatInteger(itemCount);

  return (
    <div className='flex flex-col gap-7'>
      <div className='space-y-5'>
        <div className='text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] tracking-[0.18em] uppercase'>
          {product.category?.name && (
            <Link
              href={`/shop?categoryId=${product.category.id ?? ''}`}
              className='hover:text-accent transition-colors'
            >
              {product.category.name}
            </Link>
          )}
          {product.sku && <span>{t('sku', { sku: product.sku })}</span>}
        </div>

        <div className='space-y-4'>
          <h1 className='font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05] font-semibold tracking-tight'>
            {product.name}
          </h1>

          <div className='flex flex-wrap items-center gap-3'>
            <div className='flex items-center gap-0.5'>
              {Array.from({ length: 5 }).map((_, index) => {
                const filled = index < Math.round(product.rating || 0);
                const Icon = filled ? IconStarFilled : IconStar;
                return (
                  <Icon
                    key={index}
                    className={cn(
                      'h-4 w-4',
                      filled ? 'fill-accent text-accent' : 'text-muted-foreground/30'
                    )}
                  />
                );
              })}
            </div>
            <p className='text-muted-foreground text-sm'>
              <span className={cn('text-foreground font-medium', moneyClassName)}>
                {formatDecimal(product.rating ?? 0)}
              </span>
              {product.reviews_count ? t('ratingReviews', { count: product.reviews_count }) : null}
            </p>
          </div>
        </div>

        <div className='flex flex-wrap items-end gap-x-4 gap-y-2'>
          <span className={cn('text-4xl font-semibold tracking-tight', moneyClassName)}>
            {formatPrice(product.price)}
          </span>
          {product.compare_at_price && product.compare_at_price > Number(product.price ?? 0) && (
            <>
              <span
                className={cn('text-muted-foreground pb-1 text-lg line-through', moneyClassName)}
              >
                {formatPrice(product.compare_at_price)}
              </span>
              {discountAmount > 0 && (
                <Badge
                  variant='outline'
                  className='border-accent/30 bg-accent/10 text-accent mb-1 rounded-full px-3 py-1 text-xs font-medium'
                >
                  {t('saveAmount', { amount: formatPrice(discountAmount) })}
                </Badge>
              )}
            </>
          )}
        </div>

        <div className='flex flex-wrap gap-2'>
          {isOutOfStock ? (
            <Badge variant='destructive' className='rounded-full px-3 py-1'>
              {tCard('outOfStock')}
            </Badge>
          ) : isLowStock ? (
            <Badge variant='outline' className='rounded-full px-3 py-1'>
              {tCard('onlyLeft', { count: stock })}
            </Badge>
          ) : (
            <Badge variant='secondary' className='gap-1.5 rounded-full px-3 py-1'>
              <IconPackage className='h-3.5 w-3.5' />
              {t('inStock')}
            </Badge>
          )}
          {product.is_digital && (
            <Badge variant='outline' className='rounded-full px-3 py-1'>
              {t('instantDownload')}
            </Badge>
          )}
        </div>

        {product.description && (
          <p className='text-muted-foreground max-w-xl text-sm leading-relaxed sm:text-[15px]'>
            {product.description}
          </p>
        )}

        {product.id ? (
          <ProductAiBriefButton productId={product.id} productName={product.name} />
        ) : null}
      </div>

      <ProductVariantAttributes
        attributes={product.attributes}
        colors={product.colors}
        sizes={product.sizes}
        onSelectionChange={setVariantSelections}
      />

      <ProductFeatureHighlights attributes={product.attributes} />

      <ProductQuantity
        value={productQuantity}
        onIncrement={handleAddToCart}
        onDecrement={() => decrement(mapToBasket(product))}
        stock={stock}
      />

      <div className='space-y-3 pt-1'>
        <TooltipProvider delayDuration={200}>
          <div className='flex flex-wrap items-center gap-2'>
            <Button
              onClick={handleAddToCart}
              size='lg'
              className='bg-accent text-accent-foreground hover:bg-accent/90 h-14 min-w-0 flex-1 basis-[12rem] rounded-full text-base font-medium shadow-none'
              disabled={isLoading || isOutOfStock}
            >
              {isLoading ? tCard('adding') : isOutOfStock ? tCard('soldOut') : tCard('addToCart')}
            </Button>

            <div className='flex shrink-0 items-center gap-1.5'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    className={iconActionClassName}
                    onClick={() => void handleShare()}
                    aria-label={t('shareProduct')}
                  >
                    <IconShare2 className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='top'>{t('shareProduct')}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    className={cn(
                      iconActionClassName,
                      inCompare && 'border-accent/40 bg-accent/10 text-accent'
                    )}
                    disabled={!product.id}
                    onClick={handleCompare}
                    aria-label={inCompare ? t('openCompare') : t('addToCompare')}
                  >
                    <IconArrowsLeftRight className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='top'>
                  {inCompare ? t('openCompare') : t('addToCompare')}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    className={cn(iconActionClassName, 'relative')}
                    onClick={openCart}
                    aria-label={
                      itemCount > 0 ? t('viewCartWithCount', { count: itemCount }) : t('viewCart')
                    }
                  >
                    <IconBasket className='h-4 w-4' />
                    {itemCount > 0 ? (
                      <span className='bg-gold text-gold-foreground ring-background absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[10px] font-bold ring-2'>
                        {cartBadgeLabel}
                      </span>
                    ) : null}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='top'>
                  {itemCount > 0 ? t('viewCartWithCount', { count: itemCount }) : t('viewCart')}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className='inline-flex'>
                    <LikeButton
                      productName={product.name as string}
                      isLiked={is_liked}
                      productId={product.id as number}
                      className={iconActionClassName}
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent side='top'>
                  {is_liked ? t('removeWishlist') : t('addWishlist')}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </TooltipProvider>

        {isOutOfStock && product.id && product.slug && (
          <ProductStockNotify
            productId={product.id}
            productSlug={product.slug}
            isOutOfStock={isOutOfStock}
          />
        )}
      </div>

      <div className='border-border/60 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between'>
        {trustItems.map(({ icon: Icon, label }, index) => (
          <div key={label} className='flex items-center gap-4'>
            {index > 0 && <div className='bg-border hidden h-8 w-px sm:block' />}
            <div className='flex items-center gap-2.5'>
              <Icon className='text-accent h-4 w-4 shrink-0' />
              <p className='text-muted-foreground text-xs leading-snug sm:max-w-[9rem]'>{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
