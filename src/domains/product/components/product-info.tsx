'use client';
import { IconBasket, IconCheck, IconChevronRight, IconStar } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

import { LikeButton } from '@/components/buttons/like-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { type CartItemPayload,useCartController } from '@/hooks/useCartController';
import type { DtoProductResponse } from '@/services/-products-get.schemas';

import { ProductBadges } from './product-badges';
import ProductColors from './product-colors';
import ProductQuantity from './product-quantity';
import { ProductSized } from './product-sized';

interface ProductInfoProps {
  product: DtoProductResponse;
  is_liked: boolean;
}

export function ProductInfo({ product, is_liked }: ProductInfoProps) {
  const { increment, decrement, itemCount, items, isLoading } = useCartController();

  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const cartItem = items.find((item) => item.product_id === product.id);

  const stock = product.stock ?? 0;
  const productQuantity = cartItem?.quantity ?? 0;

  const mapToBasket = (values: DtoProductResponse): CartItemPayload => {
    return {
      color: selectedColor,
      size: selectedSize as string,
      image_url: values.images?.[0],
      is_in_stock: Number(values.stock) > 0,
      price: values.price,
      product_id: values.id,
      product_name: values.name,
      stock: values.stock
    };
  };

  return (
    <div className='flex flex-col gap-6'>
      {/* Product header */}
      <div>
        <p className='text-muted-foreground text-xs tracking-widest uppercase'>
          {product.category?.name}
        </p>
        <h1 className='font-display mt-2 text-3xl leading-tight md:text-4xl'>{product.name}</h1>
        <div className='mt-3 flex items-center gap-3'>
          <div className='flex items-center'>
            {Array.from({ length: 5 }).map((_, i) => (
              <IconStar
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(product.rating || 0)
                    ? 'fill-foreground text-foreground'
                    : 'text-muted-foreground/40'
                }`}
              />
            ))}
          </div>
          <p className='text-muted-foreground text-sm'>
            {product.rating} · {product.reviews_count} reviews
          </p>
        </div>
        <div className='mt-4 flex items-baseline gap-3'>
          <span className='text-3xl font-semibold'>${product.price}</span>
          {product.compare_at_price && (
            <>
              <span className='text-muted-foreground text-lg line-through'>
                ${product.compare_at_price}
              </span>
              <Badge variant='outline' className='border-accent text-accent'>
                Save ${product.compare_at_price - Number(product.price)}
              </Badge>
            </>
          )}
        </div>
      </div>

      <p className='text-muted-foreground text-base'>{product.description}</p>
      <Separator />

      <ProductColors
        onSetSelected={setSelectedColor}
        selected={selectedColor || ''}
        colors={product.colors as string[]}
      />
      <ProductSized
        onSetSelected={setSelectedSize}
        selected={selectedSize}
        sizes={product.sizes as string[]}
      />

      <ProductQuantity
        value={productQuantity}
        onIncrement={() => increment(mapToBasket(product))}
        onDecrement={() => decrement(mapToBasket(product))}
        stock={stock}
      />

      <div className='mt-8 flex flex-col gap-4'>
        <div className='flex gap-3'>
          <Button
            onClick={() => increment(mapToBasket(product))}
            size='lg'
            className='bg-foreground text-background hover:bg-foreground/90 flex-1 gap-2'
            disabled={isLoading}
          >
            <IconCheck className='h-4 w-4' />
            {isLoading ? 'Adding...' : 'Add to cart'}
          </Button>

          <Button asChild size='lg' variant='outline' className='flex-1 gap-2'>
            <Link href='/checkout'>
              Checkout
              <IconChevronRight className='h-4 w-4' />
            </Link>
          </Button>
        </div>

        <div className='flex items-center gap-3'>
          <Button asChild size='lg' variant='outline' className='flex-1 rounded-xl border-dashed'>
            <Link href='/cart' className='flex items-center justify-center gap-2'>
              <IconBasket className='size-5' />
              View Cart ({itemCount})
            </Link>
          </Button>

          <LikeButton
            productName={product.name as string}
            isLiked={is_liked}
            productId={product.id as number}
            className='border-input bg-background hover:bg-accent rounded-xl border'
          />
        </div>
      </div>
      <ProductBadges />
    </div>
  );
}
