'use client';

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { useCartController } from '@/hooks/useCartController';
import { useGetShippingProviders } from '@/services/-shipping-providers-get';

import { CheckoutBreadcrumb } from './components/checkout-breadcrumb';
import { CheckoutLoading } from './components/checkout-loading';
import { CheckoutSteps } from './components/checkout-steps';
import { CheckoutSummary } from './components/checkout-summary';
import { EmptyCart } from './components/empty-checkout';
import { CheckoutPayment } from './containers/checkout-payment';
import { CheckoutReview } from './containers/checkout-review';
import { CheckoutShipping } from './containers/checkout-shipping';
import { useCheckoutForm, useCheckoutTotals } from './hooks/useCheckoutForm';
import { useCheckoutSteps } from './hooks/useCheckoutSteps';
import { useCheckoutSubmit } from './hooks/useCheckoutSubmit';
import { useCheckoutStore } from './store/checkout.store';

export default function CheckoutDomain() {
  const { items, isLoading: isLoadingCart } = useCartController();
  const { data: shippingProvidersData, isLoading: isLoadingShipping } = useGetShippingProviders();
  const { currentStep, handleNext, handleBack } = useCheckoutSteps();
  const { submitOrder, isPending } = useCheckoutSubmit();
  const form = useCheckoutForm({ onSubmit: submitOrder });

  const { couponDiscount } = useCheckoutStore();

  const selectedShipping = shippingProvidersData?.data?.find(
    (m) => m.id === form.state.values.shippingProviderId
  );

  const { subtotal, tax } = useCheckoutTotals({
    items,
    shippingPrice: selectedShipping?.price ?? 0.0,
    couponDiscount
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
            <form.AppForm>
              <form.Root
                onSubmit={(e) => {
                  e.preventDefault();
                  if (currentStep === 'Review') form.handleSubmit();
                }}
              >
                <AnimatePresence mode='wait'>
                  {currentStep === 'Shipping' && (
                    <CheckoutShipping
                      form={form}
                      shippingProviders={shippingProvidersData?.data || []}
                    />
                  )}
                  {currentStep === 'Payment' && <CheckoutPayment form={form} />}
                  {currentStep === 'Review' && (
                    <CheckoutReview
                      shippingProviderName={selectedShipping?.name}
                      formValues={form.state.values}
                    />
                  )}
                </AnimatePresence>

                <div className='flex justify-between pt-6'>
                  {currentStep === 'Review' ? (
                    <>
                      <Button onClick={handleBack} variant='link' className='px-6 py-4.5'>
                        <IconChevronLeft className='ml-2 h-4 w-4' />
                        back to payment
                      </Button>
                      <form.Subscribe selector={(state) => state.values.shippingProviderId}>
                        {(shippingProviderId) => {
                          const selectedShipping = shippingProvidersData?.data?.find(
                            (p) => p.id === shippingProviderId
                          );
                          const shippingPrice = selectedShipping?.price ?? 0;
                          const total = subtotal + shippingPrice + tax - couponDiscount;
                          return (
                            <form.Submit
                              className='bg-accent text-accent-foreground w-50 rounded-full py-4.5'
                              isPending={isPending}
                              label={`Place Order – $${total.toFixed(2)}`}
                            />
                          );
                        }}
                      </form.Subscribe>
                    </>
                  ) : (
                    <div className='flex w-full items-center justify-between'>
                      <Button onClick={handleBack} variant='link' className='px-6 py-4.5'>
                        <IconChevronLeft className='ml-2 h-4 w-4' />
                        {currentStep === 'Shipping' ? 'back to card' : 'back to shipping'}
                      </Button>
                      <Button
                        onClick={handleNext}
                        className='bg-accent text-accent-foreground rounded-full px-6 py-4.5'
                      >
                        {currentStep === 'Shipping' ? 'Payment' : 'Review'}
                        <IconChevronRight className='ml-2 h-4 w-4' />
                      </Button>
                    </div>
                  )}
                </div>
              </form.Root>
            </form.AppForm>
          </div>
          <div className='lg:col-span-2'>
            <form.Subscribe selector={(state) => state.values.shippingProviderId}>
              {(shippingProviderId) => (
                <CheckoutSummary shippingProviderId={shippingProviderId as number} />
              )}
            </form.Subscribe>
          </div>
        </div>
      </div>
    </div>
  );
}
