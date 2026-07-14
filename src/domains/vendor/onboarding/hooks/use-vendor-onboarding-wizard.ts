'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import type { StepDefinition } from '@/components/ui/stepper';
import { getVendorApplySuccessHref } from '@/domains/vendor/lib/vendor-routes';
import { submitVendorOnboarding } from '@/domains/vendor/onboarding/lib/submit-vendor-onboarding';
import {
  applyVendorOnboardingFieldErrors,
  getFirstOnboardingErrorMessage,
  getVendorOnboardingStepErrors,
  vendorOnboardingSchema,
  type VendorOnboardingStepId,
  type VendorOnboardingValues
} from '@/domains/vendor/onboarding/schemas/vendor-onboarding.schema';
import {
  canOpenOnboardingStep,
  useVendorOnboardingStore
} from '@/domains/vendor/onboarding/stores/vendor-onboarding-store';

interface UseVendorOnboardingWizardOptions {
  isAuthenticated: boolean;
  userEmail?: string;
  steps: StepDefinition[];
}

/** Form instance, step navigation, and submit handler for the vendor onboarding wizard. */
export function useVendorOnboardingWizard({
  isAuthenticated,
  userEmail,
  steps
}: UseVendorOnboardingWizardOptions) {
  const t = useTranslations('vendor.onboarding');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStepId = useVendorOnboardingStore((s) => s.currentStepId);
  const completedSteps = useVendorOnboardingStore((s) => s.completedSteps);
  const draft = useVendorOnboardingStore((s) => s.draft);
  const accountCreated = useVendorOnboardingStore((s) => s.accountCreated);
  const setCurrentStep = useVendorOnboardingStore((s) => s.setCurrentStep);
  const markCompleted = useVendorOnboardingStore((s) => s.markCompleted);
  const updateDraft = useVendorOnboardingStore((s) => s.updateDraft);
  const setAccountCreated = useVendorOnboardingStore((s) => s.setAccountCreated);
  const resetOnboarding = useVendorOnboardingStore((s) => s.reset);

  const defaultValues = useMemo(
    () => ({
      ...draft,
      ...(isAuthenticated && userEmail ? { email: userEmail } : {})
    }),
    [draft, isAuthenticated, userEmail]
  );

  const skipAccountFields = isAuthenticated || accountCreated;

  const form = useAppForm({
    defaultValues,
    validators: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSubmit: vendorOnboardingSchema as any
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        await submitVendorOnboarding({
          value,
          form,
          skipAccountFields,
          setAccountCreated,
          setCurrentStep,
          resetOnboarding,
          onSuccess: (storeName) => router.push(getVendorApplySuccessHref(storeName)),
          translate: (key, values) => t(key, values)
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : t('errors.submitFailed');
        toast.error(t('errors.submitFailed'), { description: message });
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!accountCreated) setAccountCreated(true);
    if (currentStepId === 'account') {
      markCompleted('account');
      setCurrentStep('business');
    }
  }, [
    accountCreated,
    currentStepId,
    isAuthenticated,
    markCompleted,
    setAccountCreated,
    setCurrentStep
  ]);

  const currentIdx = steps.findIndex((s) => s.id === currentStepId);
  const isLastStep = currentStepId === 'review';

  const validateStep = useCallback(
    async (stepId: VendorOnboardingStepId) => {
      if (stepId === 'account' && skipAccountFields) return true;

      const values = form.state.values as VendorOnboardingValues;
      const stepErrors = getVendorOnboardingStepErrors(values, stepId, { skipAccountFields });
      applyVendorOnboardingFieldErrors(form, stepErrors);

      if (Object.keys(stepErrors).length > 0) {
        toast.error(t('errors.validationFailed'), {
          description: getFirstOnboardingErrorMessage(stepErrors)
        });
        return false;
      }
      return true;
    },
    [form, skipAccountFields, t]
  );

  const goToStep = useCallback(
    async (targetId: VendorOnboardingStepId, skipValidation = false) => {
      if (targetId === currentStepId) return;

      const targetIdx = steps.findIndex((s) => s.id === targetId);
      if (!skipValidation && targetIdx > currentIdx) {
        const valid = await validateStep(currentStepId);
        if (!valid) return;
      }

      updateDraft(form.state.values as VendorOnboardingValues);
      markCompleted(currentStepId);
      setCurrentStep(targetId);
    },
    [
      currentIdx,
      currentStepId,
      form,
      markCompleted,
      setCurrentStep,
      steps,
      updateDraft,
      validateStep
    ]
  );

  const handleNext = useCallback(async () => {
    const next = steps[currentIdx + 1];
    if (next) await goToStep(next.id as VendorOnboardingStepId);
  }, [currentIdx, goToStep, steps]);

  const handlePrev = useCallback(async () => {
    const prev = steps[currentIdx - 1];
    if (prev) await goToStep(prev.id as VendorOnboardingStepId, true);
  }, [currentIdx, goToStep, steps]);

  const handleStepperClick = useCallback(
    async (stepId: VendorOnboardingStepId) => {
      if (stepId === currentStepId) return;
      if (
        !canOpenOnboardingStep(stepId, completedSteps, accountCreated || isAuthenticated) &&
        stepId !== currentStepId
      ) {
        return;
      }
      await goToStep(stepId, completedSteps.includes(stepId));
    },
    [accountCreated, completedSteps, currentStepId, goToStep, isAuthenticated]
  );

  return {
    form,
    currentStepId,
    currentIdx,
    isLastStep,
    isSubmitting,
    handleNext,
    handlePrev,
    handleStepperClick
  };
}
