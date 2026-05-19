// app/checkout/hooks/useCheckout.ts
import { useCheckoutSteps } from './useCheckoutSteps';
import { useCheckoutSubmit } from './useCheckoutSubmit';

export function useCheckout() {
  const { currentStep, handleNext, handleBack, isFirstStep, isLastStep } =
    useCheckoutSteps();

  const { submitOrder, isPending } = useCheckoutSubmit();

  return {
    currentStep,
    handleNext,
    handleBack,
    isFirstStep,
    isLastStep,
    submitOrder,
    isPending
  };
}
