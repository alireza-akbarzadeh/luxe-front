'use client';

import { Button } from '@/components/ui/button';
import { useCartController } from '@/hooks/useCartController';
import { useGetShippingProviders } from '@/services/-shipping-providers-get';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
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

  const shippingMethod = form.getFieldValue('shippingMethod');
  const selectedShippingPrice =
    shippingProvidersData?.data?.find((m) => m.name === shippingMethod)?.price ?? 0;


  const { total } = useCheckoutTotals({
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
                    <CheckoutPayment
                      form={form}
                    />
                  )}
                  {currentStep === 'Review' && <CheckoutReview formValues={form.state.values} />}
                </AnimatePresence>

                <div className='flex justify-between pt-6'>
                  {currentStep === 'Review' ? (
                    <>
                      <Button
                        onClick={handleBack}
                        variant="link"
                        className='py-4.5 px-6'
                      >
                        <IconChevronLeft className='ml-2 h-4 w-4' />
                        back to payment
                      </Button>
                      <form.Submit
                        className='w-50 rounded-full bg-accent text-accent-foreground py-4.5'
                        isPending={isPending}
                        label={`Place Order – $${total.toFixed(2)}`}
                      />
                    </>
                  ) : (
                    <div className="flex justify-between w-full items-center">
                      <Button
                        onClick={handleBack}
                        variant="link"
                        className='py-4.5 px-6'
                      >
                        <IconChevronLeft className='ml-2 h-4 w-4' />
                        {currentStep === 'Shipping' ? 'back to card' : 'back to shipping'}
                      </Button>
                      <Button
                        onClick={handleNext}
                        className='rounded-full bg-accent text-accent-foreground py-4.5 px-6'
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
            <CheckoutSummary shippingMethod={shippingMethod} />
          </div>
        </div>
      </div>
    </div>
  );
}
