// hooks/useCheckoutSteps.tsx
'use client';

import { IconClipboardCheck, IconCreditCard, IconTruckDelivery } from '@tabler/icons-react';
import { useCallback } from 'react';

import type { StepDefinition } from '@/components/ui/stepper';

import { CHECKOUT_STEP_IDS, type CheckoutStepId } from '../checkout.schema';
import { useCheckoutStore } from '../store/checkout.store';

const STEPS: StepDefinition[] = [
  {
    id: 'shipping',
    title: 'Shipping',
    description: 'Delivery address & method',
    icon: <IconTruckDelivery />
  },
  {
    id: 'payment',
    title: 'Payment',
    description: 'Billing details',
    icon: <IconCreditCard />
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Confirm & place order',
    icon: <IconClipboardCheck />
  }
];

export type { CheckoutStepId };

export function useCheckoutSteps() {
  const currentStepId = useCheckoutStore((s) => s.currentStep);
  const completedSteps = useCheckoutStore((s) => s.completedSteps);
  const setCurrentStep = useCheckoutStore((s) => s.setCurrentStep);
  const markStepCompleted = useCheckoutStore((s) => s.markStepCompleted);

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
    steps: STEPS,
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
