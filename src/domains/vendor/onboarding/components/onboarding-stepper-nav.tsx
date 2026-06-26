'use client';

import { IconCheck } from '@tabler/icons-react';

import {
  type StepDefinition,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTitle,
  StepperTrigger} from '@/components/ui/stepper';
import type { VendorOnboardingStepId } from '@/domains/vendor/onboarding/schemas/vendor-onboarding.schema';
import { canOpenOnboardingStep } from '@/domains/vendor/onboarding/stores/vendor-onboarding-store';

interface OnboardingStepperNavProps {
  steps: StepDefinition[];
  currentStepId: VendorOnboardingStepId;
  completedSteps: VendorOnboardingStepId[];
  accountCreated: boolean;
  isAuthenticated: boolean;
}

export function OnboardingStepperNav({
  steps,
  currentStepId,
  completedSteps,
  accountCreated,
  isAuthenticated
}: OnboardingStepperNavProps) {
  return (
    <StepperNav>
      {steps.map((step) => {
        const stepId = step.id as VendorOnboardingStepId;
        const isCompleted = completedSteps.includes(stepId);
        const isClickable =
          canOpenOnboardingStep(stepId, completedSteps, accountCreated || isAuthenticated) ||
          stepId === currentStepId;

        return (
          <StepperItem
            key={step.id}
            stepId={step.id}
            completed={isCompleted}
            disabled={!isClickable}
          >
            <StepperTrigger className='flex flex-col items-center gap-1 py-2 md:flex-row'>
              <StepperIndicator>
                {isCompleted ? <IconCheck className='size-4' /> : step.icon}
              </StepperIndicator>
              <div className='hidden text-center md:block md:text-start'>
                <StepperTitle>{step.title}</StepperTitle>
                <StepperDescription className='hidden lg:block'>
                  {step.description}
                </StepperDescription>
              </div>
            </StepperTrigger>
            <StepperSeparator />
          </StepperItem>
        );
      })}
    </StepperNav>
  );
}
