// app/checkout/checkout-domain.tsx
'use client';

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger
} from '@/components/ui/stepper';
import { useCartController } from '@/hooks/useCartController';

import { CheckoutBreadcrumb } from './components/checkout-breadcrumb';
import { CheckoutLoading } from './components/checkout-loading';
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
  const { steps, currentStepId, handleNext, handleBack, isFirst, isLast } = useCheckoutSteps();

  const { submitOrder, isPending } = useCheckoutSubmit();
  const form = useCheckoutForm({ onSubmit: submitOrder });
  const { couponDiscount } = useCheckoutStore();

  const { total } = useCheckoutTotals({
    items,
    couponDiscount,
    shippingProviderId: form.state.values.shippingProviderId as number
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStepId]);

  const isLoadingPage = isLoadingCart;
  if (isLoadingPage) return <CheckoutLoading />;
  if (items.length === 0) return <EmptyCart />;

  return (
    <div className='pt-24 pb-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <CheckoutBreadcrumb />

        <Stepper
          steps={steps}
          value={currentStepId}
          orientation='horizontal'
          responsive
          className='mb-8'
        >
          <StepperNav>
            {steps.map((step, index) => {
              const isCompleted = index < steps.findIndex((s) => s.id === currentStepId);
              return (
                <StepperItem key={step.id} stepId={step.id} completed={isCompleted} disabled>
                  <StepperTrigger className='flex flex-col items-center gap-1 py-2 md:flex-row'>
                    <StepperIndicator>{step.icon}</StepperIndicator>
                    <div className='hidden flex-col md:flex'>
                      <span className='text-sm font-medium'>{step.title}</span>
                      <span className='text-muted-foreground text-xs'>{step.description}</span>
                    </div>
                  </StepperTrigger>
                  {index < steps.length - 1 && <StepperSeparator />}
                </StepperItem>
              );
            })}
          </StepperNav>

          <StepperPanel className='mt-8'>
            <div className='grid gap-8 lg:grid-cols-5 lg:gap-12'>
              <div className='lg:col-span-3'>
                <form.AppForm>
                  <form.Root
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (isLast) form.handleSubmit();
                    }}
                  >
                    <StepperContent value='shipping' forceMount>
                      {currentStepId === 'shipping' && <CheckoutShipping form={form} />}
                    </StepperContent>
                    <StepperContent value='payment' forceMount>
                      {currentStepId === 'payment' && <CheckoutPayment form={form} />}
                    </StepperContent>
                    <StepperContent value='review' forceMount>
                      {currentStepId === 'review' && <CheckoutReview form={form} />}
                    </StepperContent>

                    {/* Navigation */}
                    <div className='flex justify-between pt-6'>
                      {isLast ? (
                        <>
                          <Button onClick={handleBack} variant='link' className='px-6 py-4.5'>
                            <IconChevronLeft className='mr-2 h-4 w-4' />
                            Back to payment
                          </Button>
                          <form.Submit
                            className='bg-accent text-accent-foreground w-50 rounded-full py-4.5'
                            isPending={isPending}
                            label={`Place Order – $${total.toFixed(2)}`}
                          />
                        </>
                      ) : (
                        <div className='flex w-full items-center justify-between'>
                          <Button
                            onClick={handleBack}
                            variant='link'
                            disabled={isFirst}
                            className='px-6 py-4.5'
                          >
                            <IconChevronLeft className='mr-2 h-4 w-4' />
                            {currentStepId === 'shipping' ? 'Back to cart' : 'Back to shipping'}
                          </Button>
                          <Button
                            onClick={handleNext}
                            className='bg-accent text-accent-foreground rounded-full px-6 py-4.5'
                          >
                            {currentStepId === 'shipping' ? 'Payment' : 'Review'}
                            <IconChevronRight className='ml-2 h-4 w-4' />
                          </Button>
                        </div>
                      )}
                    </div>
                  </form.Root>
                </form.AppForm>
              </div>

              {/* Right sidebar – Summary now uses form internally */}
              <div className='lg:col-span-2'>
                <CheckoutSummary form={form} />
              </div>
            </div>
          </StepperPanel>
        </Stepper>
      </div>
    </div>
  );
}
