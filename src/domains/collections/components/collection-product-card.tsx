'use client';

import {
  IconBasketCheck,
  IconShoppingBag,
  IconStarFilled
} from '@tabler/icons-react';
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

interface CollectionProductCardProps {
  product: DtoProductWithLike;
  index?: number;
}

function toCartPayload(product: DtoProductWithLike): CartItemPayload {
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

export function CollectionProductCard({ product, index = 0 }: CollectionProductCardProps) {
  const { increment, isLoading, items: cartItems } = useCartController();

  const productHref = getProductPath(product);
  const primaryImage = product.images?.[0] || '/placeholder.png';
  const secondaryImage = product.images?.[1];
  const isOutOfStock = (product.stock ?? 0) <= 0;

  const discountPercent = product.compare_at_price
    ? Math.round(
        ((product.compare_at_price - (product.price as number)) / product.compare_at_price) * 100
      )
    : 0;

  const cartQuantity = cartItems?.find((item) => item.product_id === product.id)?.quantity ?? 0;

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isOutOfStock) return;
    increment(toCartPayload(product));
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className='group bg-card border-border/40 hover:border-border/70 flex h-full flex-col overflow-hidden rounded-[1.35rem] border shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-lg'
    >
      <div className='relative p-2.5 sm:p-3'>
        <Link
          href={productHref}
          className='bg-muted/40 relative block aspect-[4/5] overflow-hidden rounded-[1.1rem]'
          aria-label={`View ${product.name}`}
        >
          <Image
            src={primaryImage}
            alt={product.name ?? 'Product'}
            fill
            sizes='(max-width: 640px) 45vw, 22vw'
            className={cn(
              'object-cover transition-all duration-700 ease-out',
              secondaryImage
                ? 'group-hover:scale-[1.03] group-hover:opacity-0'
                : 'group-hover:scale-[1.05]'
            )}
          />

          {secondaryImage ? (
            <Image
              src={secondaryImage}
              alt=''
              aria-hidden
              fill
              loading='lazy'
              sizes='(max-width: 640px) 45vw, 22vw'
              className='object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:opacity-100'
            />
          ) : null}

          <div className='from-foreground/25 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

          {(product.is_new || discountPercent > 0) && (
            <div className='absolute top-3 left-3 flex flex-wrap gap-1.5'>
              {product.is_new ? (
                <Badge
                  variant='secondary'
                  className='border-border/50 bg-background/90 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase backdrop-blur-sm'
                >
                  New
                </Badge>
              ) : null}
              {discountPercent > 0 ? (
                <Badge
                  variant='secondary'
                  className='bg-gold/90 text-gold-foreground rounded-full border-0 px-2.5 py-0.5 text-[10px] font-semibold'
                >
                  -{discountPercent}%
                </Badge>
              ) : null}
            </div>
          )}

          {isOutOfStock ? (
            <div className='bg-background/50 absolute inset-0 flex items-center justify-center backdrop-blur-[1px]'>
              <Badge variant='secondary' className='rounded-full px-3 py-1 text-xs'>
                Sold out
              </Badge>
            </div>
          ) : null}
        </Link>

        <LikeButton
          isLiked={product.is_liked ?? false}
          productId={product.id as number}
          productName={product.name || ''}
          className='bg-background/90 hover:bg-background absolute top-5 right-5 rounded-full shadow-sm backdrop-blur-sm transition-opacity sm:opacity-0 sm:group-hover:opacity-100'
        />

        <div className='pointer-events-none absolute inset-x-4 bottom-4 flex justify-center opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 sm:translate-y-2'>
          <Button
            type='button'
            size='sm'
            disabled={isLoading || isOutOfStock}
            onClick={handleAddToCart}
            className={cn(
              'h-9 min-w-[8.5rem] rounded-full px-4 shadow-lg backdrop-blur-sm',
              cartQuantity > 0
                ? 'bg-background/95 text-foreground hover:bg-background'
                : 'bg-foreground text-background hover:bg-foreground/90'
            )}
          >
            {cartQuantity > 0 ? (
              <>
                <IconBasketCheck className='size-4' />
                In bag · {cartQuantity}
              </>
            ) : (
              <>
                <IconShoppingBag className='size-4' />
                Add to bag
              </>
            )}
          </Button>
        </div>
      </div>

      <div className='flex flex-1 flex-col px-3.5 pt-0.5 pb-4 sm:px-4 sm:pb-5'>
        {product.category?.name ? (
          <p className='text-muted-foreground text-[10px] font-semibold tracking-[0.16em] uppercase'>
            {product.category.name}
          </p>
        ) : null}

        <Link href={productHref} className='mt-1.5 block'>
          <h3 className='font-display group-hover:text-accent line-clamp-2 text-[0.95rem] leading-snug font-medium transition-colors sm:text-base'>
            {product.name}
          </h3>
        </Link>

        <div className='mt-auto flex items-end justify-between gap-3 pt-3'>
          <div className='min-w-0'>
            <div className='flex flex-wrap items-baseline gap-x-2 gap-y-0.5'>
              <span className='text-foreground text-sm font-semibold tabular-nums sm:text-[0.95rem]'>
                {formatPrice(product.price)}
              </span>
              {product.compare_at_price && product.compare_at_price > (product.price ?? 0) ? (
                <span className='text-muted-foreground text-xs tabular-nums line-through'>
                  {formatPrice(product.compare_at_price)}
                </span>
              ) : null}
            </div>
          </div>

          {product.rating ? (
            <div className='text-muted-foreground flex shrink-0 items-center gap-1 text-xs'>
              <IconStarFilled className='fill-gold text-gold size-3.5' />
              <span className='text-foreground/80 font-medium tabular-nums'>
                {product.rating.toFixed(1)}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
