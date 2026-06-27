// app/checkout/checkout-domain.tsx
'use client';

import { IconCheck, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useStore } from '@tanstack/react-form';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

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
import { formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { useCartController } from '@/hooks/useCartController';

import {
  CHECKOUT_STEP_IDS,
  type CheckoutFormValues,
  type CheckoutStepId,
  getCheckoutStepErrors,
  getCheckoutStepFields} from './checkout.schema';
import { CheckoutBreadcrumb } from './components/checkout-breadcrumb';
import { CheckoutLoading } from './components/checkout-loading';
import { CheckoutPaymentCancelledHandler } from './components/checkout-payment-cancelled-handler';
import { CheckoutPlacingOrderOverlay } from './components/checkout-placing-order-overlay';
import { CheckoutRedirectingScreen } from './components/checkout-redirecting';
import { CheckoutSummary } from './components/checkout-summary';
import { EmptyCart } from './components/empty-checkout';
import { CheckoutPayment } from './containers/checkout-payment';
import { CheckoutReview } from './containers/checkout-review';
import { CheckoutShipping } from './containers/checkout-shipping';
import { useCheckoutTotals } from './hooks/useCartTotal';
import { useCheckoutForm } from './hooks/useCheckoutForm';
import { useCheckoutSteps } from './hooks/useCheckoutSteps';
import { useCheckoutSubmit } from './hooks/useCheckoutSubmit';
import { useStripeCheckoutEnabled } from './hooks/useStripeCheckoutEnabled';
import { useCheckoutStore } from './store/checkout.store';

export default function CheckoutDomain() {
  const router = useRouter();
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

  const agreedToTerms = useCheckoutStore((s) => s.agreedToTerms);
  const isRedirecting = useCheckoutStore((s) => s.isRedirecting);
  const setSubmitError = useCheckoutStore((s) => s.setSubmitError);
  const shippingProviderId = useStore(form.store, (s) => s.values.shippingProviderId);
  const { total } = useCheckoutTotals(shippingProviderId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStepId]);

  // Fresh wizard when entering checkout (skip if a redirect is already in progress).
  useEffect(() => {
    const { isRedirecting, reset } = useCheckoutStore.getState();
    if (!isRedirecting) reset();
  }, []);

  const validateStep = useCallback(
    async (stepId: CheckoutStepId) => {
      const fields = getCheckoutStepFields(stepId, isStripeCheckout);
      await Promise.all(fields.map((name) => form.validateField(name, 'submit')));

      const stepErrors = getCheckoutStepErrors(form.state.values, stepId, {
        stripeCheckout: isStripeCheckout
      });
      for (const [fieldName, messages] of Object.entries(stepErrors)) {
        if (!messages?.length) continue;
        form.setFieldMeta(fieldName as keyof CheckoutFormValues, (prev) => ({
          ...prev,
          errors: messages,
          isTouched: true
        }));
      }

      if (Object.keys(stepErrors).length > 0) return false;

      const meta = form.state.fieldMeta;
      return fields.every((field) => !meta[field]?.errors?.length);
    },
    [form, isStripeCheckout]
  );

  const onNext = useCallback(async () => {
    const valid = await validateStep(currentStepId);
    if (!valid) {
      toast.error('Please complete the highlighted fields before continuing.');
      return;
    }
    handleNext();
  }, [validateStep, currentStepId, handleNext]);

  const handleStepperClick = useCallback(
    async (stepId: CheckoutStepId) => {
      if (isPending) return;
      const targetIndex = CHECKOUT_STEP_IDS.indexOf(stepId);
      // Backwards / already-completed navigation is always allowed.
      if (targetIndex <= currentIndex || completedSteps.includes(stepId)) {
        goToStep(stepId);
        return;
      }
      // Jumping ahead requires the current step to be valid.
      const valid = await validateStep(currentStepId);
      if (!valid) {
        toast.error('Please complete the highlighted fields before continuing.');
        return;
      }
      markStepCompleted(currentStepId);
      goToStep(stepId);
    },
    [
      currentIndex,
      completedSteps,
      goToStep,
      validateStep,
      currentStepId,
      markStepCompleted,
      isPending
    ]
  );

  const handlePlaceOrder = useCallback(async () => {
    if (isPending || isRedirecting) return;

    if (!agreedToTerms) {
      toast.error('Please accept the terms to place your order.');
      return;
    }

    setSubmitError(null);

    for (const stepId of ['shipping', 'payment'] as CheckoutStepId[]) {
      const valid = await validateStep(stepId);
      if (!valid) {
        toast.error(
          stepId === 'shipping'
            ? 'Please complete your shipping details.'
            : isStripeCheckout
              ? 'Please review your order details.'
              : 'Please complete your payment details.'
        );
        goToStep(stepId);
        return;
      }
    }

    try {
      await submitOrder(form.state.values);
    } catch {
      // Errors are surfaced via toast + submitError in useCheckoutSubmit
    }
  }, [
    isPending,
    isRedirecting,
    agreedToTerms,
    setSubmitError,
    validateStep,
    goToStep,
    submitOrder,
    form,
    isStripeCheckout
  ]);

  const isLoadingPage = isLoadingCart;
  if (isLoadingPage) return <CheckoutLoading />;
  if (isRedirecting) return <CheckoutRedirectingScreen />;
  if (items.length === 0) return <EmptyCart />;

  return (
    <div className='pt-24 pb-16'>
      <CheckoutPaymentCancelledHandler />
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <CheckoutBreadcrumb />

        <Stepper
          steps={steps}
          value={currentStepId}
          onValueChange={(id) => handleStepperClick(id as CheckoutStepId)}
          orientation='horizontal'
          className='mb-8'
        >
          <StepperNav className='w-full flex-row'>
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id as CheckoutStepId);
              const isClickable = isCompleted || index <= currentIndex;
              return (
                <StepperItem
                  key={step.id}
                  stepId={step.id}
                  completed={isCompleted}
                  disabled={!isClickable && step.id !== currentStepId}
                  className='min-w-0 flex-1'
                >
                  <StepperTrigger className='flex w-full flex-col items-center gap-1 px-1 py-2 sm:flex-row sm:gap-2'>
                    <StepperIndicator className='size-7 sm:size-8'>
                      {isCompleted ? <IconCheck className='size-3.5 sm:size-4' /> : step.icon}
                    </StepperIndicator>
                    <div className='flex min-w-0 flex-col items-center text-center sm:items-start sm:text-left'>
                      <span className='truncate text-[11px] font-medium sm:text-sm'>
                        {step.title}
                      </span>
                      <span className='text-muted-foreground hidden text-xs sm:block'>
                        {step.description}
                      </span>
                    </div>
                  </StepperTrigger>
                  {index < steps.length - 1 && (
                    <StepperSeparator className='mx-1 h-0.5 flex-1 sm:mx-2' />
                  )}
                </StepperItem>
              );
            })}
          </StepperNav>

          <StepperPanel className='mt-8'>
            <div className='grid gap-8 lg:grid-cols-5 lg:gap-12'>
              <div className='lg:col-span-3'>
                <form.AppForm>
                  <form.Root className='space-y-0'>
                    <StepperContent value='shipping' forceMount>
                      {currentStepId === 'shipping' && <CheckoutShipping form={form} />}
                    </StepperContent>
                    <StepperContent value='payment' forceMount>
                      {currentStepId === 'payment' && <CheckoutPayment form={form} />}
                    </StepperContent>
                    <StepperContent value='review' forceMount>
                      {currentStepId === 'review' && (
                        <div className='relative'>
                          {isPending && <CheckoutPlacingOrderOverlay />}
                          <CheckoutReview form={form} />
                        </div>
                      )}
                    </StepperContent>

                    {/* Navigation */}
                    <div className='flex justify-between pt-6'>
                      {isLast ? (
                        <>
                          <Button
                            type='button'
                            onClick={handleBack}
                            variant='link'
                            disabled={isPending}
                            className='px-6 py-4.5'
                          >
                            <IconChevronLeft className='mr-2 h-4 w-4' />
                            Back to payment
                          </Button>
                          <Button
                            type='button'
                            onClick={handlePlaceOrder}
                            loading={isPending}
                            disabled={!agreedToTerms || isPending}
                            aria-busy={isPending}
                            className='bg-accent text-accent-foreground w-56 rounded-full py-4.5 hover:text-white'
                          >
                            {isPending
                              ? 'Placing order…'
                              : `Place Order – ${formatCartMoney(total)}`}
                          </Button>
                        </>
                      ) : (
                        <div className='flex w-full items-center justify-between'>
                          <Button
                            type='button'
                            onClick={() => (isFirst ? router.push('/cart') : handleBack())}
                            variant='link'
                            className='px-6 py-4.5'
                          >
                            <IconChevronLeft className='mr-2 h-4 w-4' />
                            {currentStepId === 'shipping' ? 'Back to cart' : 'Back to shipping'}
                          </Button>
                          <Button
                            type='button'
                            onClick={onNext}
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
