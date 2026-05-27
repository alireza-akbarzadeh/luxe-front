import { IconMinus, IconPlus, IconX } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '~/src/components/ui/button';
import { useCartController } from '~/src/hooks/useCartController';
import { Badge } from '~/src/components/ui/badge';
import type { DtoCartItemDetail } from '~/src/services/-cart-get.schemas';
import { getContrastColor } from '~/src/lib/colros';

interface CartItemProps {
  cart: DtoCartItemDetail;
  index: number;

  isUpdatingThis?: boolean;
  isRemovingThis?: boolean;
  cartItemId: number;
}

export function CartItem({
  cart,
  index,
  cartItemId,
  isUpdatingThis,
  isRemovingThis
}: CartItemProps) {
  const { updateCartItemQuantity, removeCartItem, updateCartItemVariant, isUpdating, isRemoving } =
    useCartController();

  const isUpdatingItem = isUpdatingThis ?? isUpdating;
  const isRemovingItem = isRemovingThis ?? isRemoving;

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartItemQuantity(cartItemId, newQuantity);
  };

  const handleRemove = () => removeCartItem(cartItemId);

  const handleSelectColor = (color: string) => {
    updateCartItemVariant(cartItemId, color, cart.selected_size || '');
  };

  const handleSelectSize = (size: string) => {
    updateCartItemVariant(cartItemId, cart.selected_color || '', size);
  };

  const hasColorOptions = cart.color && cart.color.length > 0;
  const hasSizeOptions = cart.size && cart.size.length > 0;
  const needsColorSelection =
    hasColorOptions && (!cart.selected_color || cart.selected_color === '');
  const needsSizeSelection = hasSizeOptions && (!cart.selected_size || cart.selected_size === '');

  return (
    <motion.div
      key={cart.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.05 }}
      className='bg-card border-border/50 flex gap-4 rounded-2xl border p-4'
    >
      {/* Product Image */}
      <Link href={`/product/${cart.product_id}`} className='shrink-0'>
        <div className='bg-muted relative h-24 w-24 overflow-hidden rounded-xl sm:h-32 sm:w-32'>
          <Image
            src={cart.image || '/placeholder.png'}
            alt={cart.name || ''}
            fill
            className='object-cover'
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className='min-w-0 flex-1'>
        <div className='flex items-start justify-between gap-2'>
          <div>
            <Link
              href={`/product/${cart.product_id}`}
              className='hover:text-accent line-clamp-1 font-semibold transition-colors'
            >
              {cart.name}
            </Link>

            {/* Color selection UI */}
            {hasColorOptions && (
              <div className='mt-2'>
                {needsColorSelection ? (
                  <div className='flex flex-wrap items-center gap-1.5'>
                    <span className='text-muted-foreground text-xs'>Select color:</span>
                    {cart?.color?.map((c) => (
                      <Button
                        key={c}
                        variant='outline'
                        size='sm'
                        className='h-7 px-2 text-xs'
                        onClick={() => handleSelectColor(c.toString())}
                      >
                        {c}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className='flex items-center gap-1.5'>
                    <span className='text-muted-foreground text-xs'>Color:</span>
                    <Badge variant='secondary' className='gap-1'>
                      {cart.selected_color}
                      <button
                        onClick={() => handleSelectColor('')}
                        className='hover:text-destructive ml-1'
                        aria-label='Change color'
                      >
                        <IconX className='h-3 w-3' />
                      </button>
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {/* Size selection UI */}
            {hasSizeOptions && (
              <div className='mt-2'>
                {needsSizeSelection ? (
                  <div className='flex flex-wrap items-center gap-1.5'>
                    <span className='text-muted-foreground text-xs'>Select size:</span>
                    {cart?.size?.map((s) => (
                      <Button
                        key={s}
                        variant='outline'
                        size='sm'
                        className='h-7 px-2 text-xs'
                        onClick={() => handleSelectSize(s.toString())}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className='flex items-center gap-1.5'>
                    <span className='text-muted-foreground text-xs'>Size:</span>
                    <Badge variant='secondary' className='gap-1'>
                      {cart.selected_size}
                      <button
                        onClick={() => handleSelectSize('')}
                        className='hover:text-destructive ml-1'
                        aria-label='Change size'
                      >
                        <IconX className='h-3 w-3' />
                      </button>
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </div>

          <Button
            variant='ghost'
            size='icon'
            className='text-muted-foreground hover:text-destructive h-8 w-8 shrink-0 rounded-full'
            onClick={handleRemove}
            disabled={isRemovingItem}
          >
            {isRemovingItem ? (
              <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
            ) : (
              <IconX className='h-4 w-4' />
            )}
          </Button>
        </div>

        <div className='mt-4 flex items-end justify-between'>
          {/* Quantity controls */}
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8 rounded-full'
              onClick={() => handleUpdateQuantity((cart.quantity ?? 0) - 1)}
              disabled={isUpdatingItem || (cart.quantity ?? 0) <= 1}
            >
              <IconMinus className='h-3 w-3' />
            </Button>
            <span className='w-8 text-center font-medium'>{cart.quantity}</span>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8 rounded-full'
              onClick={() => handleUpdateQuantity((cart.quantity ?? 0) + 1)}
              disabled={isUpdatingItem}
            >
              <IconPlus className='h-3 w-3' />
            </Button>
          </div>

          {/* Price */}
          <div className='text-right'>
            ${((cart.price ?? 0) * (cart.quantity ?? 0)).toFixed(2)}
            {cart.original_price && cart.original_price > (cart.price ?? 0) && (
              <p className='text-muted-foreground text-sm line-through'>
                ${(cart.original_price * (cart.quantity ?? 0)).toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
