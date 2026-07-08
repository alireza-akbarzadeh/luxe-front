import { toast } from 'sonner';

import { vendorRegisterAction } from '@/actions/auth.actions';
import { mapOnboardingToStorePayload } from '@/domains/vendor/onboarding/lib/map-onboarding-to-store';
import {
  applyVendorOnboardingFieldErrors,
  findOnboardingStepForField,
  getFirstOnboardingErrorMessage,
  getVendorOnboardingFormErrors,
  vendorOnboardingSchema,
  type VendorOnboardingStepId,
  type VendorOnboardingValues
} from '@/domains/vendor/onboarding/schemas/vendor-onboarding.schema';
import { createVendorStore } from '@/lib/api/vendor-stores';
import { formatPhoneE164ForApi } from '@/lib/phone-utils';

type OnboardingFormApi = Parameters<typeof applyVendorOnboardingFieldErrors>[0];

interface SubmitVendorOnboardingParams {
  value: VendorOnboardingValues;
  form: OnboardingFormApi;
  skipAccountFields: boolean;
  setAccountCreated: (created: boolean) => void;
  setCurrentStep: (stepId: VendorOnboardingStepId) => void;
  resetOnboarding: () => void;
  onSuccess: () => void;
  translate: (
    key:
      | 'errors.validationFailed'
      | 'errors.registerFailed'
      | 'success.title'
      | 'success.description',
    values?: Record<string, string>
  ) => string;
}

/** Validates onboarding values, registers vendor if needed, and creates the store. */
export async function submitVendorOnboarding({
  value,
  form,
  skipAccountFields,
  setAccountCreated,
  setCurrentStep,
  resetOnboarding,
  onSuccess,
  translate
}: SubmitVendorOnboardingParams) {
  const formErrors = getVendorOnboardingFormErrors(value, { skipAccountFields });

  if (Object.keys(formErrors).length > 0) {
    applyVendorOnboardingFieldErrors(form, formErrors);
    const firstField = Object.keys(formErrors)[0] as keyof VendorOnboardingValues;
    setCurrentStep(findOnboardingStepForField(firstField));
    toast.error(translate('errors.validationFailed'), {
      description: getFirstOnboardingErrorMessage(formErrors)
    });
    return;
  }

  const parsed = skipAccountFields
    ? vendorOnboardingSchema.omit({ password: true, confirmPassword: true }).safeParse(value)
    : vendorOnboardingSchema.safeParse(value);

  if (!parsed.success) {
    return;
  }

  if (!skipAccountFields) {
    const registerResult = await vendorRegisterAction({
      email: value.email,
      password: value.password,
      firstName: value.firstName,
      lastName: value.lastName,
      phone: formatPhoneE164ForApi(value.phone) ?? undefined
    });

    if (registerResult.error) {
      toast.error(translate('errors.registerFailed'), { description: registerResult.error });
      return;
    }

    setAccountCreated(true);
  }

  await createVendorStore(mapOnboardingToStorePayload(parsed.data as VendorOnboardingValues));
  resetOnboarding();
  toast.success(translate('success.title'), { description: translate('success.description') });
  onSuccess();
}
