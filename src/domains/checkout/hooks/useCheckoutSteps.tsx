// hooks/useCheckoutSteps.tsx
'use client';

import { IconClipboardCheck, IconTruckDelivery } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

import type { StepDefinition } from '@/components/ui/stepper';

import { CHECKOUT_STEP_IDS, type CheckoutStepId } from '../checkout.schema';
import { useCheckoutStore } from '../store/checkout.store';

export type { CheckoutStepId };

export function useCheckoutSteps() {
  const t = useTranslations('checkout.steps');
  const currentStepId = useCheckoutStore((s) => s.currentStep);
  const completedSteps = useCheckoutStore((s) => s.completedSteps);
  const setCurrentStep = useCheckoutStore((s) => s.setCurrentStep);
  const markStepCompleted = useCheckoutStore((s) => s.markStepCompleted);

  const steps: StepDefinition[] = [
    {
      id: 'shipping',
      title: t('shipping.title'),
      description: t('shipping.description'),
      icon: <IconTruckDelivery />
    },
    {
      id: 'review',
      title: t('review.title'),
      description: t('review.description'),
      icon: <IconClipboardCheck />
    }
  ];

  const currentIndex = CHECKOUT_STEP_IDS.indexOf(currentStepId);

  const goToStep = useCallback((step: CheckoutStepId) => setCurrentStep(step), [setCurrentStep]);

  const handleNext = useCallback(() => {
    const nextStep = CHECKOUT_STEP_IDS[currentIndex + 1];
    if (nextStep) {
      markStepCompleted(currentStepId);
      setCurrentStep(nextStep);
    }
  }, [currentIndex, currentStepId, markStepCompleted, setCurrentStep]);

  const handleBack = useCallback(() => {
    const prevStep = CHECKOUT_STEP_IDS[currentIndex - 1];
    if (prevStep) setCurrentStep(prevStep);
  }, [currentIndex, setCurrentStep]);

  return {
    steps,
    currentStepId,
    currentIndex,
    completedSteps,
    goToStep,
    markStepCompleted,
    handleNext,
    handleBack,
    isFirst: currentIndex === 0,
    isLast: currentIndex === CHECKOUT_STEP_IDS.length - 1
  };
}
