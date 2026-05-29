'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { useCartController } from '~/src/hooks/useCartController';

import CartBreadcrumb from './components/cart-breadcrumb';
import { CartItem } from './components/cart-item';
import { OrderSummary } from './components/order-summary';
import { ProductSuggestion } from './components/product-suggestion';

export default function CartPage() {
  const { items, isLoading, error } = useCartController();

  if (isLoading) {
    return (
      <main className='pt-24 pb-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-center py-20'>
            <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
          </div>
        </div>
      </main>
    );
  }
  if (error || items.length === 0) {
    return notFound();
  }

  return (
    <main className='pt-24 pb-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Breadcrumb */}
        <CartBreadcrumb />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8 text-3xl font-bold md:text-4xl'
        >
          Shopping Cart
        </motion.h1>
        <div className='grid gap-8 lg:grid-cols-3 lg:gap-12'>
          {/* Cart Items */}
          <div className='space-y-4 lg:col-span-2'>
            <div className='mb-4 flex items-center justify-between'>
              <span className='text-muted-foreground'>
                {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
              </span>
              <Link href='/shop' className='text-accent text-sm font-medium hover:underline'>
                Continue Shopping
              </Link>
            </div>

            <AnimatePresence mode='popLayout'>
              {items.map((item, index) => {
                const cartItemId = item.id;
                const isUpdatingThis = isLoading && item.id === cartItemId;
                const isRemovingThis = isLoading && item.id === cartItemId;

                return (
                  <CartItem
                    cartItemId={cartItemId || 0}
                    index={index}
                    key={item.id}
                    isUpdatingThis={isUpdatingThis}
                    isRemovingThis={isRemovingThis}
                    cart={item}
                  />
                );
              })}
            </AnimatePresence>

            {/* Suggested Products */}
            <ProductSuggestion />
          </div>

          {/* Order Summary */}
          <OrderSummary />
        </div>
      </div>
    </main>
  );
}
