'use client';

import {
  IconArrowRight,
  IconCheckbox,
  IconClock,
  IconPackage,
  IconShoppingBag
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { OrderNumber } from '@/components/order-number';
import { Button } from '@/components/ui/button';
import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { cn } from '@/lib/utils';

import { OrderConfirmedNotFound } from './components/order-confirmed-not-found';
import { OrderConfirmedResolving } from './components/order-confirmed-resolving';
import { useOrderConfirmedPage } from './hooks/use-order-confirmed-page';
import { isOrderPaymentComplete, resolveOrderPaymentStatus } from './lib/order-payment-status';

interface OrderConfirmedDomainProps {
  orderId: string;
}

export function OrderConfirmedDomain({ orderId }: OrderConfirmedDomainProps) {
  const t = useTranslations('checkout.stripe');
  const {
    validId,
    isFreshCheckout,
    order,
    isResolving,
    confirmingPayment,
    confirmFailed,
    isQueryError
  } = useOrderConfirmedPage(orderId);

  if (!validId) {
    return <OrderConfirmedNotFound />;
  }

  if (isResolving) {
    return <OrderConfirmedResolving confirmingPayment={confirmingPayment} />;
  }

  if (!order) {
    return <OrderConfirmedNotFound />;
  }

  const itemCount = order.items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) ?? 0;
  const total = order.total_amount ?? 0;
  const paymentStatus = resolveOrderPaymentStatus(order);
  const paymentComplete = isOrderPaymentComplete(order);
  const isPendingPayment = !paymentComplete;

  return (
    <div className='pt-24 pb-16'>
      <div className='mx-auto max-w-2xl px-4 sm:px-6'>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center'
        >
          <div
            className={cn(
              'mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full',
              paymentComplete ? 'bg-accent/10' : 'bg-amber-500/10'
            )}
          >
            {paymentComplete ? (
              <IconCheckbox className='text-accent h-10 w-10' stroke={2} />
            ) : (
              <IconClock className='h-10 w-10 text-amber-600' stroke={2} />
            )}
          </div>

          <h1 className='mb-2 text-3xl font-bold tracking-tight'>
            {paymentComplete
              ? isFreshCheckout
                ? 'Order confirmed!'
                : 'Order received'
              : t('paymentPendingTitle')}
          </h1>
          <p className='text-muted-foreground mb-8 text-sm leading-relaxed'>
            {paymentComplete
              ? "Thank you for your purchase. We've received your payment and will send you a confirmation email shortly."
              : t('paymentPendingDescription')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-card border-border/60 mb-8 rounded-2xl border p-6'
        >
          <dl className='space-y-4 text-sm'>
            <div className='flex items-center justify-between gap-4'>
              <dt className='text-muted-foreground'>Order number</dt>
              <dd>
                <OrderNumber value={String(order.id)} size='md' />
              </dd>
            </div>
            <div className='flex items-center justify-between gap-4'>
              <dt className='text-muted-foreground flex items-center gap-1.5'>
                <IconPackage className='h-4 w-4' />
                Items
              </dt>
              <dd>{itemCount}</dd>
            </div>
            {isPendingPayment ? (
              <div className='flex items-center justify-between gap-4'>
                <dt className='text-muted-foreground'>Payment status</dt>
                <dd className='font-medium text-amber-600 capitalize'>
                  {paymentStatus ?? 'pending'}
                </dd>
              </div>
            ) : null}
            <div className='flex items-center justify-between gap-4'>
              <dt className='text-muted-foreground'>
                {paymentComplete ? 'Total paid' : 'Order total'}
              </dt>
              <dd className={cn(cartMoneyClassName, 'text-lg font-bold')}>
                {formatCartMoney(total)}
              </dd>
            </div>
          </dl>
        </motion.div>

        {isPendingPayment ? (
          <div className='mb-6 text-center'>
            <Button
              type='button'
              variant='outline'
              className='rounded-full'
              onClick={() => window.location.reload()}
            >
              {t('refreshPaymentStatus')}
            </Button>
          </div>
        ) : null}

        {isQueryError && confirmFailed ? (
          <p className='text-muted-foreground mb-6 text-center text-sm'>
            {t('paymentConfirmError')}
          </p>
        ) : null}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='flex flex-col gap-3 sm:flex-row sm:justify-center'
        >
          <Button asChild className='rounded-full'>
            <Link href={`/order-tracking/${order.id}?confirmed=1`}>
              Track your order
              <IconArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
          <Button asChild variant='outline' className='rounded-full'>
            <Link href='/shop'>
              <IconShoppingBag className='mr-2 h-4 w-4' />
              Continue shopping
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
