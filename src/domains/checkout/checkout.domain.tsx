'use client';

import { useEffect } from 'react';

import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Stepper, StepperContent, StepperPanel } from '@/components/ui/stepper';
import { useCartController } from '@/hooks/useCartController';
import { cn } from '@/lib/utils';

import { CheckoutBreadcrumb } from './components/checkout-breadcrumb';
import { CheckoutFormNav } from './components/checkout-form-nav';
import { CheckoutLoading } from './components/checkout-loading';
import { CheckoutMobileActionBar } from './components/checkout-mobile-action-bar';
import { CheckoutPaymentCancelledHandler } from './components/checkout-payment-cancelled-handler';
import { CheckoutRedirectingScreen } from './components/checkout-redirecting';
import { CheckoutStepperNav } from './components/checkout-stepper-nav';
import { CheckoutSummary } from './components/checkout-summary';
import { CheckoutTrustBadges } from './components/checkout-trust-badges';
import { EmptyCart } from './components/empty-checkout';
import { CheckoutReview } from './containers/checkout-review';
import { CheckoutShipping } from './containers/checkout-shipping';
import { useCheckoutWizardActions } from './hooks/use-checkout-wizard-actions';
import { useCheckoutTotals } from './hooks/useCartTotal';
import { useCheckoutForm } from './hooks/useCheckoutForm';
import { useCheckoutSteps } from './hooks/useCheckoutSteps';
import { useCheckoutSubmit } from './hooks/useCheckoutSubmit';
import { useCheckoutStore } from './store/checkout.store';
import type { CheckoutStepId } from './types/checkout.types';

export default function CheckoutDomain() {
  const { items, isLoading: isLoadingCart, refetch: refetchCart } = useCartController();
  const { steps, currentStepId } = useCheckoutSteps();
  const { submitOrder, isPending } = useCheckoutSubmit();
  const form = useCheckoutForm({ onSubmit: submitOrder });
  const isRedirecting = useCheckoutStore((s) => s.isRedirecting);
  const shippingProviderId = form.state.values.shippingProviderId;
  const { total } = useCheckoutTotals(shippingProviderId);
  const itemCount = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);

  const {
    isFirst,
    isLast,
    agreedToTerms,
    handleStepperClick,
    onNext,
    handlePlaceOrder,
    handleMobileBack
  } = useCheckoutWizardActions({ form, isPending, submitOrder });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStepId]);

  useEffect(() => {
    const { isRedirecting: redirecting, reset } = useCheckoutStore.getState();
    if (!redirecting) reset();
  }, []);

  useEffect(() => {
    void refetchCart();
  }, [refetchCart]);

  if (isLoadingCart) return <CheckoutLoading />;
  if (isPending || isRedirecting) {
    return <CheckoutRedirectingScreen isPlacing={isPending && !isRedirecting} />;
  }
  if (items.length === 0) return <EmptyCart />;

  return (
    <Flex
      direction='column'
      className={cn(
        'app-container max-w-full min-w-0 overflow-x-clip pt-2 pb-[calc(13rem+env(safe-area-inset-bottom))] sm:pt-6 lg:pb-16',
        isLast && 'pb-[calc(14rem+env(safe-area-inset-bottom))] lg:pb-16'
      )}
    >
      <CheckoutPaymentCancelledHandler />
      <form.AppForm>
        <Flex direction='column' spacing={0} className='w-full max-w-full min-w-0'>
          <CheckoutBreadcrumb />

          <Stepper
            steps={steps}
            value={currentStepId}
            onValueChange={(id) => void handleStepperClick(id as CheckoutStepId)}
            orientation='horizontal'
            className='mb-4 sm:mb-6'
          >
            <CheckoutStepperNav onStepClick={(stepId) => void handleStepperClick(stepId)} />
            <CheckoutTrustBadges />

            <StepperPanel>
              <Grid gap={8} className='grid-cols-1 lg:grid-cols-5 lg:gap-12'>
                <GridItem className='min-w-0 lg:col-span-3'>
                  <form.Root>
                    <StepperContent value='shipping' forceMount>
                      {currentStepId === 'shipping' ? <CheckoutShipping /> : null}
                    </StepperContent>
                    <StepperContent value='review' forceMount>
                      {currentStepId === 'review' ? <CheckoutReview /> : null}
                    </StepperContent>

                    <CheckoutFormNav
                      currentStepId={currentStepId}
                      isFirst={isFirst}
                      isLast={isLast}
                      isPending={isPending}
                      agreedToTerms={agreedToTerms}
                      total={total}
                      onBack={handleMobileBack}
                      onNext={() => void onNext()}
                      onPlaceOrder={() => void handlePlaceOrder()}
                    />
                  </form.Root>
                </GridItem>

                <GridItem className='hidden lg:col-span-2 lg:block'>
                  <CheckoutSummary />
                </GridItem>
              </Grid>
            </StepperPanel>
          </Stepper>
        </Flex>

        <CheckoutMobileActionBar
          total={total}
          itemCount={itemCount}
          isPending={isPending}
          isFirst={isFirst}
          isLast={isLast}
          agreedToTerms={agreedToTerms}
          onBack={handleMobileBack}
          onNext={() => void onNext()}
          onPlaceOrder={() => void handlePlaceOrder()}
        />
      </form.AppForm>
    </Flex>
  );
}
