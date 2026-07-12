'use client';

import { useTranslations } from 'next-intl';

import { Flex } from '@/components/ui/flex';
import { OrderConfirmedActions } from '@/domains/order-confirmed/components/order-confirmed-actions';
import { OrderConfirmedHero } from '@/domains/order-confirmed/components/order-confirmed-hero';
import { OrderConfirmedNotFound } from '@/domains/order-confirmed/components/order-confirmed-not-found';
import { OrderConfirmedOrderCard } from '@/domains/order-confirmed/components/order-confirmed-order-card';
import { OrderConfirmedResolving } from '@/domains/order-confirmed/components/order-confirmed-resolving';
import { OrderConfirmedTrustBadges } from '@/domains/order-confirmed/components/order-confirmed-trust-badges';
import { OrderTrackingProgress } from '@/domains/order-tracking/components/order-tracking-progress';
import { getOrderProgressState } from '@/domains/order-tracking/lib/order-tracking-utils';
import { OrderStatus } from '@/lib/constants/enum-statuses';

import { useOrderConfirmedPage } from './hooks/use-order-confirmed-page';
import { mapOrderToConfirmedView } from './lib/order-confirmed-mapper';
import { isOrderPaymentComplete } from './lib/order-payment-status';

interface OrderConfirmedDomainProps {
  orderId: string;
}

export function OrderConfirmedDomain({ orderId }: OrderConfirmedDomainProps) {
  const tStripe = useTranslations('checkout.stripe');
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

  const paymentComplete = isOrderPaymentComplete(order);
  const isPendingPayment = !paymentComplete;
  const progress = getOrderProgressState(order.status ?? OrderStatus.Pending);
  const orderView = mapOrderToConfirmedView(order);

  return (
    <div className='relative overflow-hidden pt-24 pb-16'>
      <Flex direction='column' className='app-container relative max-w-4xl'>
        <OrderConfirmedHero
          paymentComplete={paymentComplete}
          isFreshCheckout={isFreshCheckout}
          pendingTitle={tStripe('paymentPendingTitle')}
          pendingDescription={tStripe('paymentPendingDescription')}
        />

        <OrderConfirmedOrderCard order={orderView} paymentComplete={paymentComplete} />

        {paymentComplete ? (
          <>
            <OrderTrackingProgress progress={progress} />
            <OrderConfirmedTrustBadges />
          </>
        ) : null}

        <OrderConfirmedActions
          orderId={order.id ?? Number(orderId)}
          showRefreshPayment={isPendingPayment}
          confirmError={isQueryError && confirmFailed ? tStripe('paymentConfirmError') : undefined}
          onRefreshPayment={() => window.location.reload()}
        />
      </Flex>
    </div>
  );
}
