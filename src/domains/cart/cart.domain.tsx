'use client';

import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Typography } from '@/components/ui/typography';
import { PersonalizationJourneyPromo } from '@/domains/personalization/components/personalization-journey-promo';
import { CartSmartBundles } from '@/domains/smart-bundles/components/cart-smart-bundles';
import { useCartController } from '@/hooks/useCartController';
import { MOBILE_PAGE_COMMERCE_PADDING_CLASS } from '@/lib/mobile-commerce-drawer';
import { useAuth } from '~/src/components/providers/auth-provider';

import CartBreadcrumb from './components/cart-breadcrumb';
import { CartEmptyState } from './components/cart-empty-state';
import { CartGuestState } from './components/cart-guest-state';
import { CartHeaderActions } from './components/cart-header-actions';
import { CartItem } from './components/cart-item';
import { CartItemRow } from './components/cart-item-row';
import { CartMobileCheckoutBar } from './components/cart-mobile-checkout-bar';
import { CartPageSkeleton } from './components/cart-page-skeleton';
import { CartSharedView } from './components/cart-shared-view';
import { CartSmartInsights } from './components/cart-smart-insights';
import { CartVariantAlert } from './components/cart-variant-alert';
import { OrderSummary } from './components/order-summary';
import { ProductSuggestion } from './components/product-suggestion';
import { useCartCheckoutAction } from './hooks/use-cart-checkout-action';
import { useCartOrderEstimate } from './hooks/use-cart-order-estimate';
import { useCartShareQuery } from './hooks/use-cart-share-query';

const cartMainClass = `app-container pt-2 ${MOBILE_PAGE_COMMERCE_PADDING_CLASS} sm:pt-6 lg:pt-8`;

export default function CartPage() {
  const t = useTranslations('cart.page');
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [shareCode] = useCartShareQuery();
  const { items, itemCount, subtotal, isLoading, error, refetch, updatingItemId, removingItemId } =
    useCartController();
  const { total } = useCartOrderEstimate(items, subtotal);
  const { hasIncompleteVariants, proceedToCheckout } = useCartCheckoutAction(items);

  if (shareCode) {
    return <CartSharedView shareCode={shareCode} isAuthenticated={isAuthenticated} />;
  }

  if (isAuthLoading) {
    return <CartPageSkeleton />;
  }

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
        <Flex direction='row' align='start' justify='between' gap={3} className='mb-6 sm:mb-8'>
          <Typography.H1
            family='display'
            className='text-2xl font-semibold sm:text-3xl lg:text-4xl'
          >
            {t('title')}
          </Typography.H1>
          <CartHeaderActions items={[]} showShare={false} />
        </Flex>
        <CartEmptyState />
        <PersonalizationJourneyPromo variant='empty-cart' className='mx-auto mt-8 max-w-lg' />
      </main>
    );
  }

  return (
    <>
      <main className={cartMainClass}>
        <CartBreadcrumb />

        <header className='mb-5 lg:mb-8'>
          <Flex direction='row' align='start' justify='between' gap={3}>
            <div className='min-w-0'>
              <Typography.Overline className='text-gold lg:hidden'>
                {t('mobileEyebrow')}
              </Typography.Overline>
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
            <Flex direction='row' spacing={2} align='center' className='shrink-0'>
              <CartHeaderActions items={items} />
              <Button asChild variant='outline' className='hidden rounded-full sm:inline-flex'>
                <Link href='/shop'>{t('continueShopping')}</Link>
              </Button>
            </Flex>
          </Flex>
        </header>

        <Grid gap={8} className='grid-cols-1 lg:grid-cols-3 lg:gap-12'>
          <GridItem className='lg:col-span-2'>
            <CartVariantAlert items={items} />

            <ul className='bg-muted/25 flex flex-col gap-2.5 rounded-3xl p-2 lg:hidden lg:bg-transparent lg:p-0'>
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

            <div className='mt-6 space-y-8'>
              <CartSmartInsights />
              <CartSmartBundles />
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
