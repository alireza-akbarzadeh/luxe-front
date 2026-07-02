'use client';

import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Typography } from '@/components/ui/typography';
import { useCartController } from '@/hooks/useCartController';
import { useUser } from '@/hooks/useUser';

import CartBreadcrumb from './components/cart-breadcrumb';
import { CartEmptyState } from './components/cart-empty-state';
import { CartGuestState } from './components/cart-guest-state';
import { CartItem } from './components/cart-item';
import { CartItemRow } from './components/cart-item-row';
import { CartMobileCheckoutBar } from './components/cart-mobile-checkout-bar';
import { CartMobileSummary } from './components/cart-mobile-summary';
import { CartPageSkeleton } from './components/cart-page-skeleton';
import { CartVariantAlert } from './components/cart-variant-alert';
import { OrderSummary } from './components/order-summary';
import { ProductSuggestion } from './components/product-suggestion';
import { useCartCheckoutAction } from './hooks/use-cart-checkout-action';
import { useCartOrderEstimate } from './hooks/use-cart-order-estimate';

const cartMainClass =
  'app-container pt-2 pb-[calc(10.5rem+env(safe-area-inset-bottom))] sm:pt-6 sm:pb-[calc(11rem+env(safe-area-inset-bottom))] lg:pt-8 lg:pb-16';

export default function CartPage() {
  const t = useTranslations('cart.page');
  const { isAuthenticated } = useUser();
  const { items, itemCount, subtotal, isLoading, error, refetch, updatingItemId, removingItemId } =
    useCartController();
  const { total } = useCartOrderEstimate(items, subtotal);
  const { hasIncompleteVariants, proceedToCheckout } = useCartCheckoutAction(items);

  if (!isAuthenticated) {
    return <CartGuestState />;
  }

  if (isLoading) {
    return <CartPageSkeleton />;
  }

  if (error) {
    return (
      <main className={cartMainClass}>
        <Flex direction='column' align='center' className='mx-auto mt-12 max-w-lg text-center'>
          <Typography.H2 family='display' className='text-2xl font-semibold'>
            {t('errorTitle')}
          </Typography.H2>
          <Typography.Muted className='mt-2 mb-6 text-sm'>{t('errorDescription')}</Typography.Muted>
          <Button onClick={() => void refetch()} className='rounded-full'>
            {t('retry')}
          </Button>
        </Flex>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className='app-container pt-2 pb-6 sm:pt-6 sm:pb-10 lg:pt-8 lg:pb-16'>
        <CartBreadcrumb />
        <Typography.H1
          family='display'
          className='mb-6 text-2xl font-semibold sm:mb-8 sm:text-3xl lg:text-4xl'
        >
          {t('title')}
        </Typography.H1>
        <CartEmptyState />
      </main>
    );
  }

  return (
    <>
      <main className={cartMainClass}>
        <CartBreadcrumb />

        <header className='mb-4 space-y-3 lg:mb-8'>
          <Flex align='start' justify='between' gap={3}>
            <div className='min-w-0'>
              <Typography.H1
                family='display'
                className='text-2xl font-semibold sm:text-3xl lg:text-4xl'
              >
                {t('title')}
              </Typography.H1>
              <Typography.Muted className='mt-1 text-sm'>
                {t('itemCount', { count: itemCount })} · {t('reviewHint')}
              </Typography.Muted>
            </div>
            <Button
              asChild
              variant='outline'
              className='hidden shrink-0 rounded-full sm:inline-flex'
            >
              <Link href='/shop'>{t('continueShopping')}</Link>
            </Button>
          </Flex>
        </header>

        <CartMobileSummary />

        <Grid gap={8} className='grid-cols-1 lg:grid-cols-3 lg:gap-12'>
          <GridItem className='lg:col-span-2'>
            <CartVariantAlert items={items} />

            <ul className='flex flex-col gap-3 lg:hidden'>
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  cart={item}
                  cartItemId={item.id ?? 0}
                  isUpdating={updatingItemId === item.id}
                  isRemoving={removingItemId === item.id}
                />
              ))}
            </ul>

            <div className='hidden space-y-4 lg:block'>
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
            </div>

            <div className='mt-6'>
              <ProductSuggestion />
            </div>
          </GridItem>

          <GridItem className='hidden lg:block'>
            <OrderSummary />
          </GridItem>
        </Grid>
      </main>

      <CartMobileCheckoutBar
        total={total}
        itemCount={itemCount}
        hasIncompleteVariants={hasIncompleteVariants}
        onCheckout={() => proceedToCheckout()}
      />
    </>
  );
}
