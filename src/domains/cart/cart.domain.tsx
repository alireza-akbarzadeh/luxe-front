'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useCartController } from '~/src/hooks/useCartController';
import { useUser } from '~/src/hooks/useUser';

import CartBreadcrumb from './components/cart-breadcrumb';
import { CartEmptyState } from './components/cart-empty-state';
import { CartGuestState } from './components/cart-guest-state';
import { CartItem } from './components/cart-item';
import { CartMobileCheckoutBar } from './components/cart-mobile-checkout-bar';
import { CartPageSkeleton } from './components/cart-page-skeleton';
import { CartVariantAlert } from './components/cart-variant-alert';
import { OrderSummary } from './components/order-summary';
import { ProductSuggestion } from './components/product-suggestion';
import { useCartCheckoutAction } from './hooks/use-cart-checkout-action';
import { useCartOrderEstimate } from './hooks/use-cart-order-estimate';

export default function CartPage() {
  const { isAuthenticated } = useUser();
  const { items, itemCount, subtotal, isLoading, error, refetch, updatingItemId, removingItemId } =
    useCartController();
  const { total } = useCartOrderEstimate(items, subtotal);
  const { proceedToCheckout } = useCartCheckoutAction(items);

  if (!isAuthenticated) {
    return <CartGuestState />;
  }

  if (isLoading) {
    return <CartPageSkeleton />;
  }

  if (error) {
    return (
      <main className='pt-24 pb-16'>
        <div className='mx-auto max-w-lg px-4 text-center sm:px-6'>
          <h1 className='font-display mb-2 text-2xl font-semibold'>Couldn&apos;t load your cart</h1>
          <p className='text-muted-foreground mb-6 text-sm'>
            Something went wrong while fetching your items. Please try again.
          </p>
          <Button onClick={() => void refetch()} className='rounded-full'>
            Retry
          </Button>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className='pt-24 pb-16'>
        <div className='mx-auto max-w-3xl px-4 sm:px-6 lg:px-8'>
          <CartBreadcrumb />
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className='font-display mb-8 text-3xl font-semibold md:text-4xl'
          >
            Shopping Cart
          </motion.h1>
          <CartEmptyState />
        </div>
      </main>
    );
  }

  return (
    <>
      <main className='pt-24 pb-28 lg:pb-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <CartBreadcrumb />

          <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className='font-display text-3xl font-semibold md:text-4xl'>Shopping Cart</h1>
              <p className='text-muted-foreground mt-2 text-sm'>
                {itemCount} {itemCount === 1 ? 'item' : 'items'} · Review before checkout
              </p>
            </motion.div>
            <Button asChild variant='outline' className='rounded-full'>
              <Link href='/shop'>Continue shopping</Link>
            </Button>
          </div>

          <div className='grid gap-8 lg:grid-cols-3 lg:gap-12'>
            <div className='space-y-4 lg:col-span-2'>
              <CartVariantAlert items={items} />

              <AnimatePresence mode='popLayout'>
                {items.map((item, index) => (
                  <CartItem
                    key={item.id}
                    cart={item}
                    index={index}
                    cartItemId={item.id ?? 0}
                    isUpdating={updatingItemId === item.id}
                    isRemoving={removingItemId === item.id}
                  />
                ))}
              </AnimatePresence>

              <ProductSuggestion />
            </div>

            <OrderSummary />
          </div>
        </div>
      </main>

      <CartMobileCheckoutBar
        total={total}
        itemCount={itemCount}
        onCheckout={() => proceedToCheckout()}
      />
    </>
  );
}
