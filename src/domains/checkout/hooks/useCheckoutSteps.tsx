// hooks/useCheckoutSteps.ts
'use client';

import { IconClipboardCheck, IconCreditCard, IconTruckDelivery } from '@tabler/icons-react';
import { useCallback, useState } from 'react';

import type { StepDefinition } from '@/components/ui/stepper';

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

export type CheckoutStepId = (typeof STEPS)[number]['id'];

export function useCheckoutSteps() {
  const [currentStepId, setCurrentStepId] = useState<CheckoutStepId>('shipping');
  const stepIds = STEPS.map((s) => s.id);
  const currentIndex = stepIds.indexOf(currentStepId);

  const handleNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < stepIds.length) {
      setCurrentStepId(stepIds[nextIndex] as CheckoutStepId);
    }
  }, [currentIndex, stepIds]);

  const handleBack = useCallback(() => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStepId(stepIds[prevIndex] as CheckoutStepId);
    }
  }, [currentIndex, stepIds]);

  return {
    steps: STEPS,
    currentStepId,
    currentIndex,
    handleNext,
    handleBack,
    isFirst: currentIndex === 0,
    isLast: currentIndex === stepIds.length - 1
  };
}
