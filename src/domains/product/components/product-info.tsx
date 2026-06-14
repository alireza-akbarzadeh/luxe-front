'use client';

import {
  IconBasket,
  IconCheck,
  IconChevronRight,
  IconPackage,
  IconScale,
  IconStar,
  IconStarFilled,
  IconTruck
} from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

import { LikeButton } from '@/components/buttons/like-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import useCompareController from '@/domains/compare/hooks/useCompareController';
import { formatPrice } from '@/domains/home/lib/home-utils';
import { type CartItemPayload, useCartController } from '@/hooks/useCartController';
import { cn } from '@/lib/utils';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

import ProductColors from './product-colors';
import ProductQuantity from './product-quantity';
import { ProductSized } from './product-sized';

interface ProductInfoProps {
  product: DtoProductWithLike;
  is_liked: boolean;
}

export function ProductInfo({ product, is_liked }: ProductInfoProps) {
  const { increment, decrement, itemCount, items, isLoading } = useCartController();
  const { addItem, isInCompare, canAddMore } = useCompareController();

  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(product?.sizes?.[0] ?? null);

  const cartItem = items.find((item) => item.product_id === product.id);
  const stock = product.stock ?? 0;
  const productQuantity = cartItem?.quantity ?? 0;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;
  const inCompare = product.id ? isInCompare(product.id) : false;

  const discountAmount =
    product.compare_at_price && product.compare_at_price > Number(product.price ?? 0)
      ? product.compare_at_price - Number(product.price)
      : 0;

  const mapToBasket = (values: DtoProductWithLike): CartItemPayload => ({
    color: selectedColor,
    size: selectedSize as string,
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

  return (
    <div className='border-border/60 bg-card flex flex-col gap-6 rounded-2xl border p-6 shadow-sm sm:p-8 lg:sticky lg:top-28 lg:self-start'>
      <div className='space-y-4'>
        <div className='flex flex-wrap items-center gap-2'>
          {product.category?.name && (
            <Link
              href={`/shop?categoryId=${product.category.id ?? ''}`}
              className='text-muted-foreground hover:text-accent text-xs tracking-[0.2em] uppercase transition-colors'
            >
              {product.category.name}
            </Link>
          )}
          {product.sku && (
            <span className='text-muted-foreground text-xs'>SKU · {product.sku}</span>
          )}
        </div>

        <h1 className='font-display text-3xl leading-tight font-semibold md:text-4xl lg:text-[2.75rem]'>
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
                    filled ? 'fill-accent text-accent' : 'text-muted-foreground/35'
                  )}
                />
              );
            })}
          </div>
          <p className='text-muted-foreground text-sm'>
            <span className='text-foreground font-medium'>{product.rating?.toFixed(1)}</span>
            {product.reviews_count ? ` · ${product.reviews_count} reviews` : null}
          </p>
        </div>

        <div className='flex flex-wrap items-end gap-3'>
          <span className='text-3xl font-semibold tracking-tight'>
            {formatPrice(product.price)}
          </span>
          {product.compare_at_price && product.compare_at_price > Number(product.price ?? 0) && (
            <>
              <span className='text-muted-foreground text-lg line-through'>
                {formatPrice(product.compare_at_price)}
              </span>
              {discountAmount > 0 && (
                <Badge variant='accentOutline' className='mb-0.5'>
                  Save {formatPrice(discountAmount)}
                </Badge>
              )}
            </>
          )}
        </div>

        <div className='flex flex-wrap gap-2'>
          {isOutOfStock ? (
            <Badge variant='destructive'>Out of stock</Badge>
          ) : isLowStock ? (
            <Badge variant='outline'>Only {stock} left</Badge>
          ) : (
            <Badge variant='secondary' className='gap-1'>
              <IconPackage className='h-3 w-3' />
              In stock
            </Badge>
          )}
          {product.is_digital && <Badge variant='accentOutline'>Instant download</Badge>}
        </div>
      </div>

      {product.description && (
        <p className='text-muted-foreground line-clamp-4 text-sm leading-relaxed sm:text-base'>
          {product.description}
        </p>
      )}

      <Separator />

      {product.colors && product.colors.length > 0 && (
        <ProductColors
          onSetSelected={setSelectedColor}
          selected={selectedColor || ''}
          colors={product.colors as string[]}
        />
      )}

      {product.sizes && product.sizes.length > 0 && (
        <ProductSized
          onSetSelected={setSelectedSize}
          selected={selectedSize}
          sizes={product.sizes as string[]}
        />
      )}

      <ProductQuantity
        value={productQuantity}
        onIncrement={handleAddToCart}
        onDecrement={() => decrement(mapToBasket(product))}
        stock={stock}
      />

      <div className='flex flex-col gap-3'>
        <div className='flex gap-3'>
          <Button
            onClick={handleAddToCart}
            size='lg'
            className='bg-accent text-accent-foreground hover:bg-accent/90 h-12 flex-1 gap-2 rounded-full text-base shadow-sm'
            disabled={isLoading || isOutOfStock}
          >
            <IconCheck className='h-4 w-4' />
            {isLoading ? 'Adding…' : isOutOfStock ? 'Sold out' : 'Add to cart'}
          </Button>

          <LikeButton
            productName={product.name as string}
            isLiked={is_liked}
            productId={product.id as number}
            className='border-input bg-background hover:bg-muted h-12 w-12 shrink-0 rounded-full border'
          />
        </div>

        <div className='flex gap-3'>
          <Button asChild size='lg' variant='outline' className='h-11 flex-1 rounded-full'>
            <Link href='/checkout'>
              Buy now
              <IconChevronRight className='h-4 w-4' />
            </Link>
          </Button>
          <Button
            type='button'
            size='lg'
            variant='outline'
            className='h-11 flex-1 gap-2 rounded-full'
            disabled={!product.id || inCompare || !canAddMore}
            onClick={() => product.id && addItem(product.id)}
          >
            <IconScale className='h-4 w-4' />
            {inCompare ? 'In compare' : 'Compare'}
          </Button>
        </div>

        <Button
          asChild
          size='lg'
          variant='ghost'
          className='h-11 rounded-full border border-dashed'
        >
          <Link href='/cart' className='flex items-center justify-center gap-2'>
            <IconBasket className='size-5' />
            View cart ({itemCount})
          </Link>
        </Button>
      </div>

      <div className='border-border/60 bg-muted/30 grid grid-cols-2 gap-3 rounded-xl border p-4 sm:grid-cols-3'>
        {[
          [IconTruck, 'Free shipping over $150'],
          [IconPackage, 'Authenticity guaranteed'],
          [IconCheck, '30-day easy returns']
        ].map(([Icon, label]) => {
          const TrustIcon = Icon as typeof IconTruck;
          return (
            <div key={label as string} className='flex items-start gap-2.5'>
              <TrustIcon className='text-accent mt-0.5 h-4 w-4 shrink-0' />
              <p className='text-muted-foreground text-xs leading-snug'>{label as string}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
