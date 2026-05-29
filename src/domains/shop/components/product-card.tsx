import { IconBasketCheck, IconShoppingBag, IconStar } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { LikeButton } from '@/components/buttons/like-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type CartItemPayload, useCartController } from '@/hooks/useCartController';
import type { DtoProductResponse } from '~/src/services/-products-get.schemas';

export interface ProductCardProps {
  product: DtoProductResponse & { is_liked?: boolean };
  index?: number;
  size?: 'default' | 'compact';
}

export function ProductCard({ product, index = 0, size = 'default' }: ProductCardProps) {
  const isCompact = size === 'compact';
  const { increment, isLoading, items: cartItems } = useCartController(); // Get cart items

  const discountPercent = product.compare_at_price
    ? Math.round(
        ((product.compare_at_price - (product.price as number)) / product.compare_at_price) * 100
      )
    : 0;

  // Find quantity of this product in the cart
  const cartItem = cartItems?.find((item) => item.product_id === product.id);
  const cartQuantity = cartItem?.quantity ?? 0;

  const mapToBasket = (values: DtoProductResponse & { is_liked?: boolean }): CartItemPayload => {
    return {
      color: values.colors?.[0]?.toString(),
      size: values.colors?.[0]?.toString(),
      image_url: values.images?.[0],
      is_in_stock: Number(values.stock) > 0,
      price: values.price,
      product_id: values.id,
      product_name: values.name,
      stock: values.stock
    };
  };

  const handleAddToCart = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    increment(mapToBasket(product));
  };

  // Button text based on cart quantity
  const getButtonText = () => {
    if (isLoading) return isCompact ? '...' : 'Adding...';
    if (cartQuantity > 0) {
      return isCompact ? `${cartQuantity}` : `In Cart (${cartQuantity})`;
    }
    return isCompact ? 'Add' : 'Add to Cart';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className='h-full'
    >
      <Link
        href={`/product/${product.id}`}
        className='group border-border/60 bg-card hover:border-border hover:shadow-primary/5 flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg'
      >
        <div
          className={`bg-muted relative aspect-4/5 overflow-hidden ${isCompact ? 'rounded-t-2xl' : ''}`}
        >
          <Image
            src={product?.images?.[0] || '/placeholder.png'}
            alt={product.name ?? ''}
            loading='lazy'
            className='h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]'
          />

          <div className='from-foreground/25 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

          <div
            className={`absolute top-2.5 left-2.5 flex flex-col gap-1 ${isCompact ? 'top-2 left-2' : 'top-3 left-3 gap-1.5'}`}
          >
            {product.is_new && (
              <Badge variant='inverse' size={isCompact ? 'sm' : 'default'}>
                New
              </Badge>
            )}
            {discountPercent > 0 && (
              <Badge variant='accentOutline' size={isCompact ? 'sm' : 'default'}>
                -{discountPercent}%
              </Badge>
            )}
          </div>
          <LikeButton
            isLiked={product.is_liked ?? false}
            productId={product.id as number}
            productName={product.name || ''}
            className='bg-background/90 hover:bg-background absolute top-2.5 right-2.5 rounded-full p-1.5 opacity-100 shadow-sm backdrop-blur-sm transition-opacity sm:opacity-0 sm:group-hover:opacity-100'
          />

          <div
            className={`absolute inset-x-2.5 bottom-2.5 transition-all duration-300 sm:inset-x-3 sm:bottom-3 ${
              isCompact
                ? 'translate-y-0 opacity-100'
                : 'translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
            }`}
          >
            <Button
              onClick={handleAddToCart}
              disabled={isLoading}
              className={`w-full gap-1.5 shadow-lg ${isCompact ? 'h-8 text-xs' : 'gap-2'}`}
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
          className={`flex flex-1 flex-col ${isCompact ? 'gap-1 p-2.5 sm:p-3' : 'gap-1.5 p-4 pt-3'}`}
        >
          {!isCompact && (
            <p className='text-muted-foreground text-xs tracking-widest uppercase'>
              {product.category?.name}
            </p>
          )}
          <h3
            className={`font-display group-hover:text-accent leading-tight transition-colors ${
              isCompact ? 'line-clamp-2 text-sm font-medium' : 'text-lg'
            }`}
          >
            {product.name}
          </h3>
          {!isCompact && (
            <div className='text-muted-foreground flex-start gap-1.5 text-xs'>
              <IconStar className='fill-foreground text-foreground h-3.5 w-3.5' />
              <span>{product.rating}</span>
              <span>· {product.reviews_count} reviews</span>
            </div>
          )}
          <div
            className={`flex items-baseline gap-1.5 ${isCompact ? 'mt-auto pt-0.5' : 'gap-2 pt-1'}`}
          >
            <span className={isCompact ? 'text-sm font-semibold' : 'text-base font-semibold'}>
              ${product.price}
            </span>
            {product.compare_at_price && product.compare_at_price > (product.price ?? 0) && (
              <span
                className={`text-muted-foreground line-through ${isCompact ? 'text-xs' : 'text-sm'}`}
              >
                ${product.compare_at_price}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
