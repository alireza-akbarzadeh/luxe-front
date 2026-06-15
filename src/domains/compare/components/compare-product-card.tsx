'use client';

import { IconShoppingCart, IconX } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/domains/home/lib/home-utils';
import { getProductPath } from '@/domains/product/lib/product-routes';
import { type CartItemPayload, useCartController } from '@/hooks/useCartController';
import { cn } from '@/lib/utils';
import type { DtoCompareProductResponse } from '@/services/-compare-post.schemas';

interface CompareProductCardProps {
  product: DtoCompareProductResponse;
  onRemove: (productId: number) => void;
  compact?: boolean;
}

export function CompareProductCard({ product, onRemove, compact = false }: CompareProductCardProps) {
  const { increment } = useCartController();

  const handleAddToCart = () => {
    if (!product.id) return;
    const cartItem: CartItemPayload = {
      product_id: product.id,
      product_name: product.name ?? '',
      price: product.price ?? 0,
      stock: product.stock ?? 0,
      is_in_stock: (product.stock ?? 0) > 0,
      image_url: product.images?.[0] ?? ''
    };
    increment(cartItem);
  };

  return (
    <div className='bg-card border-border/70 relative flex h-full flex-col overflow-hidden rounded-2xl border p-3 shadow-sm'>
      <Button
        type='button'
        variant='outline'
        size='icon'
        className='bg-background absolute top-3 right-3 z-10 h-8 w-8 rounded-full shadow-sm'
        onClick={() => product.id && onRemove(product.id)}
        aria-label={`Remove ${product.name ?? 'product'} from compare`}
      >
        <IconX className='h-4 w-4' />
      </Button>

      <Link href={getProductPath(product)} className='group block shrink-0'>
        <div
          className={cn(
            'bg-secondary relative mb-3 overflow-hidden rounded-xl',
            compact ? 'aspect-[4/5] max-h-[180px] w-full' : 'mb-4 aspect-[4/5]'
          )}
        >
          <Image
            src={product.images?.[0] || '/placeholder.png'}
            alt={product.name ?? ''}
            fill
            className='object-cover transition-transform duration-300 group-hover:scale-105'
          />
          {product.is_new && (
            <Badge className='bg-accent text-accent-foreground absolute top-2 left-2'>New</Badge>
          )}
        </div>
      </Link>

      {product.store_name && !compact && (
        <Link
          href={`/store/${product.store_slug}`}
          className='text-muted-foreground hover:text-primary truncate text-xs transition-colors'
        >
          {product.store_name}
        </Link>
      )}

      <Link href={getProductPath(product)}>
        <h3
          className={cn(
            'mt-1 font-semibold',
            compact ? 'line-clamp-2 min-h-0 text-sm leading-snug' : 'line-clamp-2 min-h-12'
          )}
        >
          {product.name}
        </h3>
      </Link>

      <div className={cn('mt-2 flex flex-wrap items-center gap-2', compact && 'mt-1')}>
        <span className={cn('font-bold tabular-nums', compact ? 'text-lg' : 'text-xl')}>
          {formatPrice(product.price)}
        </span>
        {product.compare_at_price && product.compare_at_price > (product.price ?? 0) && (
          <span className='text-muted-foreground text-sm line-through tabular-nums'>
            {formatPrice(product.compare_at_price)}
          </span>
        )}
      </div>

      {!compact && (
        <Button className='mt-auto gap-1 rounded-full pt-4' size='sm' onClick={handleAddToCart}>
          <IconShoppingCart className='h-4 w-4' />
          Add to cart
        </Button>
      )}
    </div>
  );
}
