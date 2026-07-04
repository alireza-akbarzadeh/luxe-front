'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { scrollToCheckoutTerms } from '../lib/scroll-to-checkout-terms';
import { useCheckoutStore } from '../store/checkout.store';
import type { CheckoutFormValues, CheckoutStepId } from '../types/checkout.types';
import type { CheckoutFormApi } from './useCheckoutForm';
import { useCheckoutSteps } from './useCheckoutSteps';
import { useCheckoutValidation } from './useCheckoutValidation';
import { useStripeCheckoutEnabled } from './useStripeCheckoutEnabled';

interface UseCheckoutWizardActionsOptions {
  form: CheckoutFormApi;
  isPending: boolean;
  submitOrder: (values: CheckoutFormValues) => Promise<void>;
}

/** Step navigation, stepper clicks, and place-order flow for the checkout wizard. */
export function useCheckoutWizardActions({
  form,
  isPending,
  submitOrder
}: UseCheckoutWizardActionsOptions) {
  const router = useRouter();
  const t = useTranslations('checkout');
  const { isStripeCheckout } = useStripeCheckoutEnabled();
  const { validateStep, validatePayment } = useCheckoutValidation(form, isStripeCheckout);

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

  const agreedToTerms = useCheckoutStore((s) => s.agreedToTerms);
  const setTermsAttention = useCheckoutStore((s) => s.setTermsAttention);
  const isRedirecting = useCheckoutStore((s) => s.isRedirecting);
  const setSubmitError = useCheckoutStore((s) => s.setSubmitError);

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

  return {
    isFirst,
    isLast,
    agreedToTerms,
    handleStepperClick,
    onNext,
    handlePlaceOrder,
    handleMobileBack
  };
}
