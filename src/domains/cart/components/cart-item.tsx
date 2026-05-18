import { IconMinus, IconPlus, IconX } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import Image from 'next/image';
import { Button } from '~/src/components/ui/button';
import { useCart } from '~/src/hooks/useCartController';
import type { DtoCartItemDetail } from '~/src/services/-cart-get.schemas';

interface CartItemProps {
  cart: DtoCartItemDetail;
  isUpdatingThis: boolean;
  isRemovingThis: boolean;
  index: number;
  cartItemId: number;
}

export function CartItem(props: CartItemProps) {
  const { cart, index, isRemovingThis, isUpdatingThis, cartItemId } = props;
  const { updateQuantity, removeItem } = useCart();

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
            <div className='text-muted-foreground mt-1 flex items-center gap-2 text-sm'>
              {cart.color && <span>Color: {cart.color}</span>}
              {cart.color && cart.size && <span>/</span>}
              {cart.size && <span>Size: {cart.size}</span>}
            </div>
          </div>
          <Button
            variant='ghost'
            size='icon'
            className='text-muted-foreground hover:text-destructive h-8 w-8 shrink-0 rounded-full'
            onClick={() => removeItem(cartItemId)}
            disabled={isRemovingThis}
          >
            {isRemovingThis ? (
              <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
            ) : (
              <IconX className='h-4 w-4' />
            )}
          </Button>
        </div>

        <div className='mt-4 flex items-end justify-between'>
          {/* Quantity */}
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8 rounded-full'
              onClick={() => updateQuantity(cartItemId, Math.max(1, (cart.quantity ?? 0) - 1))}
              disabled={isUpdatingThis}
            >
              <IconMinus className='h-3 w-3' />
            </Button>
            <span className='w-8 text-center font-medium'>{cart.quantity}</span>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8 rounded-full'
              onClick={() => updateQuantity(cartItemId, (cart.quantity ?? 0) + 1)}
              disabled={isUpdatingThis}
            >
              <IconPlus className='h-3 w-3' />
            </Button>
          </div>

          {/* Price with original price strikethrough */}
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
