'use client';

import {
  IconArrowRight,
  IconRotateClockwise,
  IconShieldCheck,
  IconTag,
  IconTruck
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/domains/home/lib/home-utils';
import { useCartController } from '~/src/hooks/useCartController';

import { calculateCartTotals, cartHasIncompleteVariants } from '../lib/cart-utils';
import { FreeShippingProgress } from './free-shipping-progress';

export function OrderSummary() {
  const { subtotal, items, itemCount, clearCart, isClearing } = useCartController();

  const { totalDiscount, shipping, total } = calculateCartTotals(items, subtotal);
  const hasIncompleteVariants = cartHasIncompleteVariants(items);
  const checkoutDisabled = hasIncompleteVariants || itemCount === 0;

  return (
    <div className='lg:col-span-1'>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className='bg-card border-border/50 sticky top-24 space-y-4 rounded-2xl border p-6 shadow-sm'
      >
        <div className='flex items-center justify-between'>
          <h2 className='font-display text-lg font-semibold'>Order Summary</h2>
          <span className='text-muted-foreground text-sm tabular-nums'>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        <FreeShippingProgress subtotal={subtotal} />

        <div className='space-y-3 text-sm'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Subtotal</span>
            <span className='tabular-nums'>{formatPrice(subtotal)}</span>
          </div>
          {totalDiscount > 0 && (
            <div className='text-success flex justify-between'>
              <span>Savings</span>
              <span className='tabular-nums'>-{formatPrice(totalDiscount)}</span>
            </div>
          )}
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Shipping</span>
            <span className='tabular-nums'>
              {shipping === 0 ? (
                <span className='text-success font-medium'>Free</span>
              ) : (
                formatPrice(shipping)
              )}
            </span>
          </div>
        </div>

        <Separator />

        <div className='flex items-center justify-between'>
          <span className='font-semibold'>Estimated total</span>
          <span className='font-display text-2xl font-semibold tabular-nums'>
            {formatPrice(total)}
          </span>
        </div>

        <p className='text-muted-foreground text-xs'>Taxes calculated at checkout.</p>

        {hasIncompleteVariants && (
          <p className='text-warning text-xs leading-relaxed'>
            Please select color or size for highlighted items before checkout.
          </p>
        )}

        <Button
          asChild={!checkoutDisabled}
          className='h-11 w-full rounded-full'
          size='lg'
          disabled={checkoutDisabled}
        >
          {checkoutDisabled ? (
            <span>Proceed to Checkout</span>
          ) : (
            <Link href='/checkout'>
              Proceed to Checkout
              <IconArrowRight className='ml-2 h-4 w-4' />
            </Link>
          )}
        </Button>

        <div className='flex items-center gap-2 rounded-xl border border-dashed px-3 py-2.5 text-xs'>
          <IconTag className='text-accent h-4 w-4 shrink-0' />
          <span className='text-muted-foreground'>
            Have a promo code?{' '}
            <Link href='/checkout' className='text-accent font-medium hover:underline'>
              Apply at checkout
            </Link>
          </span>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='text-muted-foreground hover:text-destructive w-full text-xs'
              disabled={isClearing || itemCount === 0}
            >
              Clear cart
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes all {itemCount} {itemCount === 1 ? 'item' : 'items'}. You can always
                add them back from the shop.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep items</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => void clearCart()}
                className='bg-destructive hover:bg-destructive/90'
              >
                Clear cart
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className='grid grid-cols-3 gap-2 border-t pt-4'>
          <div className='p-1 text-center'>
            <IconTruck className='text-muted-foreground mx-auto mb-1 h-5 w-5' />
            <p className='text-muted-foreground text-[10px] leading-tight'>Free over $100</p>
          </div>
          <div className='p-1 text-center'>
            <IconShieldCheck className='text-muted-foreground mx-auto mb-1 h-5 w-5' />
            <p className='text-muted-foreground text-[10px] leading-tight'>Secure checkout</p>
          </div>
          <div className='p-1 text-center'>
            <IconRotateClockwise className='text-muted-foreground mx-auto mb-1 h-5 w-5' />
            <p className='text-muted-foreground text-[10px] leading-tight'>30-day returns</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
