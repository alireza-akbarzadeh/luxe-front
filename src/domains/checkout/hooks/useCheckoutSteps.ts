import { IconCreditCard, IconMapPin, IconPackage } from '@tabler/icons-react';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import {useRouter} from "next/navigation";


export type CheckoutSteps = 'Shipping' | 'Payment' | 'Review';
export const stepNames = ['Shipping', 'Payment', 'Review'] as const;


export const steps = [
  { id: 'Shipping', name: 'Shipping', icon: IconMapPin },
  { id: 'Payment', name: 'Payment', icon: IconCreditCard },
  { id: 'Review', name: 'Review', icon: IconPackage }
];



export function useCheckoutSteps() {
  const {push}=useRouter()
  const [currentStepRaw, setCurrentStep] = useQueryState<CheckoutSteps>(
    'step',
    parseAsStringLiteral(stepNames).withDefault('Shipping')
  );

  const currentStep = currentStepRaw ?? 'Shipping';
  const currentIndex = stepNames.indexOf(currentStep);

  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === stepNames.length - 1;

  const handleNext = async () => {
    if (!isLastStep) {
      await  setCurrentStep(stepNames[currentIndex + 1] as CheckoutSteps);
    }
  };

  const handleBack = async () => {
    if (currentStep === "Shipping") {
      push("/cart")
      return
    }
    if (!isFirstStep) {
      await  setCurrentStep(stepNames[currentIndex - 1] as CheckoutSteps);
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

