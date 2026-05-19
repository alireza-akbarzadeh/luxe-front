'use client';

import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Button } from '~/src/components/ui/button';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useCart } from '~/src/hooks/useCartController';
import { useGetShippingProviders } from '~/src/services/-shipping-providers-get';
import { CheckoutBreadcrumb } from './components/checkout-breadcrumb';
import { CheckoutSteps } from './components/checkout-steps';
import { CheckoutSummary } from './components/checkout-summary';
import { CheckoutLoading } from './components/checkout-loading';
import { EmptyCart } from './components/empty-checkout';
import { CheckoutShipping } from './containers/checkout-shipping';
import { CheckoutPayment } from './containers/checkout-payment';
import { CheckoutReview } from './containers/checkout-review';
import { useCheckoutSteps } from './hooks/useCheckoutSteps';
import { useCheckoutForm } from './hooks/useCheckoutForm';
import { useCheckoutCoupon } from './hooks/useCheckoutCoupon';
import { useCheckoutTotals } from './hooks/useCheckoutForm';
import { useCheckoutSubmit } from './hooks/useCheckoutSubmit';

export default function CheckoutDomain() {
  const { items, isLoading: isLoadingCart } = useCart();
  const { data: shippingProvidersData, isLoading: isLoadingShipping } = useGetShippingProviders();
  const { currentStep, handleNext, handleBack, isFirstStep } = useCheckoutSteps();
  const { submitOrder, isPending } = useCheckoutSubmit();
  const form = useCheckoutForm({ onSubmit: submitOrder });

  const shippingMethod = form.getFieldValue('shippingMethod');
  const selectedShippingPrice =
    shippingProvidersData?.data?.find((m) => m.name === shippingMethod)?.price ?? 0;

  const subtotalFromCart = items.reduce(
    (sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 0),
    0
  );
  const { couponDiscount, appliedCouponCode, applyCoupon, isApplyingCoupon } =
    useCheckoutCoupon({
      subtotal: subtotalFromCart,
      setCouponCode: (code) => form.setFieldValue('couponCode', code),
    });

  const { subtotal, tax, total } = useCheckoutTotals({
    items,
    shippingPrice: selectedShippingPrice,
    couponDiscount,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const isLoadingPage = isLoadingCart || isLoadingShipping;
  if (isLoadingPage) return <CheckoutLoading />;
  if (items.length === 0) return <EmptyCart />;

  return (
    <div className='pt-24 pb-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <CheckoutBreadcrumb />
        <CheckoutSteps currentStep={currentStep} />

        <div className='grid gap-8 lg:grid-cols-5 lg:gap-12'>
          <div className='lg:col-span-3'>
            {/* Use the enhanced form instance directly */}
            <form.AppForm>
              <form.Root
                onSubmit={(e) => {
                  e.preventDefault();
                  if (currentStep === 'Review') form.handleSubmit();
                }}
              >
                <AnimatePresence mode='wait'>
                  {currentStep === 'Shipping' && (
                    <CheckoutShipping form={form} shippingProviders={shippingProvidersData?.data || []} />
                  )}
                  {currentStep === 'Payment' && (
                    <CheckoutPayment form={form} />
                  )}
                  {currentStep === 'Review' && <CheckoutReview form={form} />}
                </AnimatePresence>

                <div className='flex justify-between pt-6'>
                  {!isFirstStep && (
                    <Button variant='ghost' onClick={handleBack} className='rounded-full'>
                      <IconChevronLeft className='mr-2 h-4 w-4' /> Back
                    </Button>
                  )}
                  {currentStep === 'Review' ? (
                    <form.Submit
                      className='min-w-[180px] rounded-full bg-accent text-accent-foreground py-4.5'
                      isPending={isPending}
                      label={`Place Order – $${total.toFixed(2)}`}
                    />
                  ) : (
                    <Button
                      onClick={handleNext}
                      className='rounded-full bg-accent text-accent-foreground py-4.5 px-6'
                    >
                      {currentStep === 'Shipping' ? 'Payment' : 'Review'}
                      <IconChevronRight className='ml-2 h-4 w-4' />
                    </Button>
                  )}
                </div>
              </form.Root>
            </form.AppForm>
          </div>

          <div className='lg:col-span-2'>
            <CheckoutSummary
              shippingMethod={shippingMethod}
              couponDiscount={couponDiscount}
              couponCode={appliedCouponCode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
