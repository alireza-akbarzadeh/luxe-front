'use client';

import { IconBasketCheck, IconShoppingBag, IconStarFilled } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { MouseEvent } from 'react';

import { LikeButton } from '@/components/buttons/like-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/domains/home/lib/home-utils';
import { getProductPath } from '@/domains/product/lib/product-routes';
import { type CartItemPayload, useCartController } from '@/hooks/useCartController';
import { cn } from '@/lib/utils';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

interface ProductListRowProps {
  product: DtoProductWithLike;
  index?: number;
}

function mapProductToCartPayload(product: DtoProductWithLike): CartItemPayload {
  return {
    color: product.colors?.[0]?.toString(),
    size: product.sizes?.[0]?.toString(),
    image_url: product.images?.[0],
    is_in_stock: Number(product.stock) > 0,
    price: product.price,
    product_id: product.id,
    product_name: product.name,
    stock: product.stock
  };
}

/** Horizontal product row for search/list views — actions stay outside the product link. */
export function ProductListRow({ product, index = 0 }: ProductListRowProps) {
  const { increment, isLoading, items: cartItems } = useCartController();

  const productHref = getProductPath(product);
  const primaryImage = product.images?.[0] || '/placeholder.png';
  const isOutOfStock = (product.stock ?? 0) <= 0;
  const cartItem = cartItems?.find((item) => item.product_id === product.id);
  const cartQuantity = cartItem?.quantity ?? 0;

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isOutOfStock) return;
    increment(mapProductToCartPayload(product));
  };

  const cartLabel = isLoading
    ? 'Adding…'
    : isOutOfStock
      ? 'Out of stock'
      : cartQuantity > 0
        ? `In cart (${cartQuantity})`
        : 'Add to cart';

  return (
    <motion.article
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className='bg-card group flex gap-4 rounded-xl border p-4 transition-shadow hover:shadow-lg'
    >
      <Link
        href={productHref}
        className='bg-secondary relative h-32 w-32 shrink-0 overflow-hidden rounded-lg'
        aria-label={`View ${product.name}`}
      >
        <Image
          src={primaryImage}
          alt={product.name ?? 'Product'}
          fill
          sizes='128px'
          className='object-cover transition-transform duration-500 group-hover:scale-105'
        />
        {product.is_new && (
          <Badge className='absolute top-2 left-2' variant='secondary'>
            New
          </Badge>
        )}
        {isOutOfStock && (
          <div className='bg-background/55 absolute inset-0 flex items-center justify-center backdrop-blur-[1px]'>
            <Badge variant='inverse' size='sm'>
              Sold out
            </Badge>
          </div>
        )}
      </Link>

      <div className='flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center'>
        <Link href={productHref} className='min-w-0 flex-1'>
          {product.category?.name && (
            <span className='text-muted-foreground text-xs tracking-wider uppercase'>
              {product.category.name}
            </span>
          )}
          <h3 className='group-hover:text-accent font-display mt-1 line-clamp-2 font-semibold transition-colors'>
            {product.name}
          </h3>
          {product.description && (
            <p className='text-muted-foreground mt-1 line-clamp-2 text-sm'>{product.description}</p>
          )}
          <div className='mt-2 flex flex-wrap items-center gap-x-4 gap-y-1'>
            {(product.rating ?? 0) > 0 && (
              <div className='text-muted-foreground flex items-center gap-1 text-sm'>
                <IconStarFilled className='fill-accent text-accent h-4 w-4' />
                <span>{product.rating?.toFixed(1)}</span>
                {product.reviews_count ? <span>({product.reviews_count})</span> : null}
              </div>
            )}
            <div className='flex items-center gap-2'>
              <span className='font-semibold'>{formatPrice(product.price)}</span>
              {product.compare_at_price && product.compare_at_price > (product.price ?? 0) && (
                <span className='text-muted-foreground text-sm line-through'>
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>
          </div>
        </Link>

        <div className='flex shrink-0 items-center gap-2 sm:flex-col sm:justify-center'>
          <LikeButton
            isLiked={product.is_liked ?? false}
            productId={product.id as number}
            productName={product.name ?? ''}
            className='h-10 w-10'
          />
          <Button
            type='button'
            size={cartQuantity > 0 ? 'default' : 'icon'}
            variant={cartQuantity > 0 ? 'secondary' : 'default'}
            disabled={isLoading || isOutOfStock}
            onClick={handleAddToCart}
            className={cn(cartQuantity > 0 && 'gap-1.5 px-3')}
            aria-label={cartLabel}
          >
            {cartQuantity > 0 ? (
              <IconBasketCheck className='h-4 w-4' />
            ) : (
              <IconShoppingBag className='h-4 w-4' />
            )}
            {cartQuantity > 0 ? (
              <span className='hidden text-xs sm:inline'>{cartQuantity}</span>
            ) : null}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
