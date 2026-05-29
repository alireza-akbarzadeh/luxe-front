'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconShoppingCart, IconX } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartController, type CartItemPayload } from '~/src/hooks/useCartController';
import type { DtoCompareProductResponse } from '~/src/services/-compare-post.schemas';
import useCompareController from '~/src/domains/compare/hooks/useCompareController';

interface CompareProductCardProps {
  product: DtoCompareProductResponse;
}

export function CompareProductCard({ product }: CompareProductCardProps) {
  const { removeItem } = useCompareController();
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
    <Card className='group relative p-4'>
      <Button
        variant='ghost'
        size='icon'
        className='absolute top-2 right-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100'
        onClick={() => product.id && removeItem(product.id)}
      >
        <IconX className='h-4 w-4' />
      </Button>

      <Link href={`/product/${product.id}`}>
        <div className='bg-secondary relative mb-4 aspect-square overflow-hidden rounded-lg'>
          <Image
            src={product.images?.[0] || '/placeholder.png'}
            alt={product.name ?? ''}
            fill
            className='object-cover transition-transform duration-300 hover:scale-105'
          />
          {product.is_new && (
            <Badge className='bg-accent text-accent-foreground absolute top-2 left-2'>New</Badge>
          )}
        </div>
      </Link>

      {product.store_name && (
        <Link
          href={`/store/${product.store_slug}`}
          className='text-muted-foreground hover:text-primary text-xs transition-colors'
        >
          {product.store_name}
        </Link>
      )}
      <h3 className='mt-1 line-clamp-2 min-h-12 font-semibold'>{product.name}</h3>

      <div className='mt-2 flex items-center gap-2'>
        <span className='text-xl font-bold'>${product.price}</span>
        {product.compare_at_price && product.compare_at_price > (product.price ?? 0) && (
          <span className='text-muted-foreground text-sm line-through'>
            ${product.compare_at_price}
          </span>
        )}
      </div>

      <div className='mt-4 flex gap-2'>
        <Button className='flex-1 gap-1' size='sm' onClick={handleAddToCart}>
          <IconShoppingCart className='h-4 w-4' />
          Add
        </Button>
        {/* Wishlist removed as requested */}
      </div>
    </Card>
  );
}
