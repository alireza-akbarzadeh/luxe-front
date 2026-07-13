'use client';

import {
  IconArrowRight,
  IconRotateClockwise,
  IconShare2,
  IconShieldCheck,
  IconTag,
  IconTruck
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

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
import { CartShareDialog } from '@/domains/cart/components/cart-share-dialog';
import { useCartController } from '@/hooks/useCartController';
import { cn } from '@/lib/utils';

import { useCartCheckoutAction } from '../hooks/use-cart-checkout-action';
import { useCartOrderEstimate } from '../hooks/use-cart-order-estimate';
import { formatEstimatedTaxLabel } from '../lib/cart-commerce-settings';
import { cartMoneyClassName, formatCartMoney } from '../lib/cart-utils';
import { FreeShippingProgress } from './free-shipping-progress';

export function OrderSummary() {
  const t = useTranslations('cart');
  const { subtotal, items, itemCount, clearCart, isClearing } = useCartController();
  const { totalDiscount, shipping, tax, total, settings } = useCartOrderEstimate(items, subtotal);
  const { hasIncompleteVariants, proceedToCheckout } = useCartCheckoutAction(items);
  const checkoutDisabled = itemCount === 0;
  const [shareOpen, setShareOpen] = useState(false);

  return (
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
          <span className={cartMoneyClassName}>{formatCartMoney(subtotal)}</span>
        </div>
        {totalDiscount > 0 && (
          <div className='text-success flex justify-between'>
            <span>Savings</span>
            <span className={cartMoneyClassName}>-{formatCartMoney(totalDiscount)}</span>
          </div>
        )}
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>Shipping</span>
          <span className={cartMoneyClassName}>
            {shipping === 0 ? (
              <span className='text-success font-medium'>Free</span>
            ) : (
              formatCartMoney(shipping)
            )}
          </span>
        </div>
        {settings.estimatedTaxEnabled && tax > 0 ? (
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>
              Est. tax ({formatEstimatedTaxLabel(settings.estimatedTaxRate)})
            </span>
            <span className={cartMoneyClassName}>{formatCartMoney(tax)}</span>
          </div>
        ) : null}
      </div>

      <Separator />

      <div className='flex items-center justify-between'>
        <span className='font-semibold'>Estimated total</span>
        <span className={cn('text-2xl font-semibold', cartMoneyClassName)}>
          {formatCartMoney(total)}
        </span>
      </div>

      <p className='text-muted-foreground text-xs'>
        {settings.estimatedTaxEnabled
          ? 'Final tax is confirmed at checkout based on your address.'
          : 'Taxes calculated at checkout.'}
      </p>

      {hasIncompleteVariants ? (
        <p className='text-warning text-xs leading-relaxed'>
          Select color or size for the highlighted items, then tap checkout again.
        </p>
      ) : null}

      <Button
        type='button'
        className='h-11 w-full rounded-full'
        size='lg'
        disabled={checkoutDisabled}
        onClick={() => proceedToCheckout()}
      >
        Proceed to Checkout
        <IconArrowRight className='ml-2 h-4 w-4' />
      </Button>

      <Button
        type='button'
        variant='outline'
        className='w-full rounded-full'
        disabled={items.length === 0}
        onClick={() => setShareOpen(true)}
      >
        <IconShare2 className='size-4' />
        {t('share.action')}
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
              This removes all {itemCount} {itemCount === 1 ? 'item' : 'items'}. You can always add
              them back from the shop.
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
          <p className='text-muted-foreground text-[10px] leading-tight'>
            Free over {formatCartMoney(settings.freeShippingThreshold)}
          </p>
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

      <CartShareDialog open={shareOpen} onOpenChange={setShareOpen} items={items} />
    </motion.div>
  );
}
