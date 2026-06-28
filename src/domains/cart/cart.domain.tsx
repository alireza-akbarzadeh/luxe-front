'use client';

import { AnimatePresence, motion } from 'framer-motion';
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
import { CartMobileCheckoutBar } from './components/cart-mobile-checkout-bar';
import { CartMobileSummary } from './components/cart-mobile-summary';
import { CartPageSkeleton } from './components/cart-page-skeleton';
import { CartVariantAlert } from './components/cart-variant-alert';
import { OrderSummary } from './components/order-summary';
import { ProductSuggestion } from './components/product-suggestion';
import { useCartCheckoutAction } from './hooks/use-cart-checkout-action';
import { useCartOrderEstimate } from './hooks/use-cart-order-estimate';

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
      <Flex direction='column' className='pt-24 pb-16'>
        <Flex
          direction='column'
          spacing={4}
          align='center'
          className='mx-auto max-w-lg px-4 text-center sm:px-6'
        >
          <Typography.H2>{t('errorTitle')}</Typography.H2>
          <Typography.Text variant='muted'>{t('errorDescription')}</Typography.Text>
          <Button onClick={() => void refetch()} className='rounded-full'>
            {t('retry')}
          </Button>
        </Flex>
      </Flex>
    );
  }

  if (items.length === 0) {
    return (
      <Flex direction='column' className='pt-24 pb-16'>
        <Flex direction='column' spacing={0} className='mx-auto max-w-3xl px-4 sm:px-6 lg:px-8'>
          <CartBreadcrumb />
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Typography.H1 className='font-display mb-8 text-3xl md:text-4xl'>
              {t('title')}
            </Typography.H1>
          </motion.div>
          <CartEmptyState />
        </Flex>
      </Flex>
    );
  }

  return (
    <>
      <Flex direction='column' className='pt-20 pb-28 sm:pt-24 lg:pb-16'>
        <Flex
          direction='column'
          spacing={0}
          className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'
        >
          <CartBreadcrumb />

          <Flex
            direction='column'
            spacing={4}
            className='mb-6 sm:mb-8 sm:flex-row sm:items-end sm:justify-between'
          >
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Typography.H1 className='font-display text-3xl md:text-4xl'>
                {t('title')}
              </Typography.H1>
              <Typography.Text variant='muted' className='mt-2'>
                {t('itemCount', { count: itemCount })} · {t('reviewHint')}
              </Typography.Text>
            </motion.div>
            <Button asChild variant='outline' className='w-full rounded-full sm:w-auto'>
              <Link href='/shop'>{t('continueShopping')}</Link>
            </Button>
          </Flex>

          <CartMobileSummary />

          <Grid gap={8} className='grid-cols-1 lg:grid-cols-3 lg:gap-12'>
            <GridItem className='space-y-4 lg:col-span-2'>
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
            </GridItem>

            <GridItem className='hidden lg:block'>
              <OrderSummary />
            </GridItem>
          </Grid>
        </Flex>
      </Flex>

      <CartMobileCheckoutBar
        total={total}
        itemCount={itemCount}
        hasIncompleteVariants={hasIncompleteVariants}
        onCheckout={() => proceedToCheckout()}
      />
    </>
  );
}
