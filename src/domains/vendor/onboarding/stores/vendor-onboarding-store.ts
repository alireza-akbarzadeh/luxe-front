import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  vendorOnboardingDefaults,
  type VendorOnboardingStepId,
  type VendorOnboardingValues
} from '@/domains/vendor/onboarding/schemas/vendor-onboarding.schema';

interface VendorOnboardingState {
  currentStepId: VendorOnboardingStepId;
  completedSteps: VendorOnboardingStepId[];
  draft: VendorOnboardingValues;
  accountCreated: boolean;
}

interface VendorOnboardingActions {
  setCurrentStep: (stepId: VendorOnboardingStepId) => void;
  markCompleted: (stepId: VendorOnboardingStepId) => void;
  updateDraft: (partial: Partial<VendorOnboardingValues>) => void;
  setAccountCreated: (created: boolean) => void;
  reset: () => void;
}

type VendorOnboardingStore = VendorOnboardingState & VendorOnboardingActions;

const initialState: VendorOnboardingState = {
  currentStepId: 'account',
  completedSteps: [],
  draft: vendorOnboardingDefaults,
  accountCreated: false
};

/** Persisted seller onboarding wizard — survives refresh and step navigation. */
export const useVendorOnboardingStore = create<VendorOnboardingStore>()(
  persist(
    (set) => ({
      ...initialState,
      setCurrentStep: (stepId) => set({ currentStepId: stepId }),
      markCompleted: (stepId) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(stepId)
            ? state.completedSteps
            : [...state.completedSteps, stepId]
        })),
      updateDraft: (partial) =>
        set((state) => ({
          draft: { ...state.draft, ...partial }
        })),
      setAccountCreated: (created) => set({ accountCreated: created }),
      reset: () => set(initialState)
    }),
    {
      name: 'luxe-vendor-onboarding',
      partialize: (state) => ({
        currentStepId: state.currentStepId,
        completedSteps: state.completedSteps,
        draft: state.draft,
        accountCreated: state.accountCreated
      })
    }
  )
);

/** Whether a step tab can be opened without losing prior progress. */
export function canOpenOnboardingStep(
  stepId: VendorOnboardingStepId,
  completedSteps: VendorOnboardingStepId[],
  accountCreated: boolean
): boolean {
  if (stepId === 'account') return true;
  if (accountCreated) return true;
  const stepOrder: VendorOnboardingStepId[] = [
    'account',
    'business',
    'store',
    'operations',
    'review'
  ];
  const targetIndex = stepOrder.indexOf(stepId);
  return stepOrder.slice(0, targetIndex).every((id) => completedSteps.includes(id));
}
