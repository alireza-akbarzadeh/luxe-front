'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Stepper, StepperContent, StepperPanel } from '@/components/ui/stepper';
import { useCartController } from '@/hooks/useCartController';
import { cn } from '@/lib/utils';

import type { CheckoutStepId } from './checkout.schema';
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
import { useCheckoutTotals } from './hooks/useCartTotal';
import { useCheckoutForm } from './hooks/useCheckoutForm';
import { useCheckoutSteps } from './hooks/useCheckoutSteps';
import { useCheckoutSubmit } from './hooks/useCheckoutSubmit';
import { useCheckoutValidation } from './hooks/useCheckoutValidation';
import { useStripeCheckoutEnabled } from './hooks/useStripeCheckoutEnabled';
import { scrollToCheckoutTerms } from './lib/scroll-to-checkout-terms';
import { useCheckoutStore } from './store/checkout.store';

export default function CheckoutDomain() {
  const router = useRouter();
  const t = useTranslations('checkout');
  const { items, isLoading: isLoadingCart } = useCartController();
  const {
    steps,
    currentStepId,
    currentIndex,
    completedSteps,
    goToStep,
    markStepCompleted,
    handleNext,
    handleBack,
    isFirst,
    isLast
  } = useCheckoutSteps();

  const { submitOrder, isPending } = useCheckoutSubmit();
  const { isStripeCheckout } = useStripeCheckoutEnabled();
  const form = useCheckoutForm({ onSubmit: submitOrder });
  const { validateStep, validatePayment } = useCheckoutValidation(form, isStripeCheckout);

  const agreedToTerms = useCheckoutStore((s) => s.agreedToTerms);
  const setTermsAttention = useCheckoutStore((s) => s.setTermsAttention);
  const isRedirecting = useCheckoutStore((s) => s.isRedirecting);
  const setSubmitError = useCheckoutStore((s) => s.setSubmitError);
  const shippingProviderId = form.state.values.shippingProviderId;
  const { total } = useCheckoutTotals(shippingProviderId);
  const itemCount = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStepId]);

  useEffect(() => {
    const { isRedirecting: redirecting, reset } = useCheckoutStore.getState();
    if (!redirecting) reset();
  }, []);

  const handleStepperClick = useCallback(
    async (stepId: CheckoutStepId) => {
      if (isPending) return;
      const targetIndex = steps.findIndex((s) => s.id === stepId);
      if (targetIndex <= currentIndex || completedSteps.includes(stepId)) {
        goToStep(stepId);
        return;
      }
      const valid = await validateStep(currentStepId);
      if (!valid) {
        toast.error(t('validation.completeFields'));
        return;
      }
      markStepCompleted(currentStepId);
      goToStep(stepId);
    },
    [
      steps,
      currentIndex,
      completedSteps,
      goToStep,
      validateStep,
      currentStepId,
      markStepCompleted,
      isPending,
      t
    ]
  );

  const onNext = useCallback(async () => {
    const valid = await validateStep(currentStepId);
    if (!valid) {
      toast.error(t('validation.completeFields'));
      return;
    }
    handleNext();
  }, [validateStep, currentStepId, handleNext, t]);

  const handlePlaceOrder = useCallback(async () => {
    if (isPending || isRedirecting) return;

    if (!agreedToTerms) {
      setTermsAttention(true);
      scrollToCheckoutTerms();
      toast.error(t('validation.acceptTerms'));
      return;
    }

    setSubmitError(null);

    const shippingValid = await validateStep('shipping');
    if (!shippingValid) {
      toast.error(t('navigation.completeShipping'));
      goToStep('shipping');
      return;
    }

    const paymentValid = await validatePayment();
    if (!paymentValid) {
      toast.error(t('navigation.completePayment'));
      goToStep('review');
      return;
    }

    try {
      await submitOrder(form.state.values);
    } catch {
      // Errors surfaced via toast + submitError in useCheckoutSubmit
    }
  }, [
    isPending,
    isRedirecting,
    agreedToTerms,
    setTermsAttention,
    setSubmitError,
    validateStep,
    validatePayment,
    goToStep,
    submitOrder,
    form,
    t
  ]);

  const handleMobileBack = useCallback(() => {
    if (isFirst) {
      router.push('/cart');
      return;
    }
    handleBack();
  }, [isFirst, router, handleBack]);

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
                <form.AppForm>
                  <form.Root>
                    <StepperContent value='shipping' forceMount>
                      {currentStepId === 'shipping' ? <CheckoutShipping form={form} /> : null}
                    </StepperContent>
                    <StepperContent value='review' forceMount>
                      {currentStepId === 'review' ? <CheckoutReview form={form} /> : null}
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
                </form.AppForm>
              </GridItem>

              <GridItem className='hidden lg:col-span-2 lg:block'>
                <CheckoutSummary form={form} />
              </GridItem>
            </Grid>
          </StepperPanel>
        </Stepper>
      </Flex>

      <CheckoutMobileActionBar
        form={form}
        total={total}
        itemCount={itemCount}
        currentStepId={currentStepId}
        isFirst={isFirst}
        isLast={isLast}
        isPending={isPending}
        agreedToTerms={agreedToTerms}
        onBack={handleMobileBack}
        onNext={() => void onNext()}
        onPlaceOrder={() => void handlePlaceOrder()}
      />
    </Flex>
  );
}
