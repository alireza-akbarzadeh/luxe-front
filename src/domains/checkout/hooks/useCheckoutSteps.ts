import { IconCreditCard, IconMapPin, IconPackage } from '@tabler/icons-react';
import { parseAsStringLiteral, useQueryState } from 'nuqs';


export type CheckoutSteps = 'Shipping' | 'Payment' | 'Review';
export const stepNames = ['Shipping', 'Payment', 'Review'] as const;


export const steps = [
  { id: 'Shipping', name: 'Shipping', icon: IconMapPin },
  { id: 'Payment', name: 'Payment', icon: IconCreditCard },
  { id: 'Review', name: 'Review', icon: IconPackage }
];



export function useCheckoutSteps() {
  const [currentStepRaw, setCurrentStep] = useQueryState<CheckoutSteps>(
    'step',
    parseAsStringLiteral(stepNames).withDefault('Shipping')
  );

  const currentStep = currentStepRaw ?? 'Shipping';
  const currentIndex = stepNames.indexOf(currentStep);

  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === stepNames.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(stepNames[currentIndex + 1] as CheckoutSteps);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(stepNames[currentIndex - 1] as CheckoutSteps);
    }
  };

  return {
    currentStep,
    currentIndex,
    isFirstStep,
    isLastStep,
    handleNext,
    handleBack
  };
}

