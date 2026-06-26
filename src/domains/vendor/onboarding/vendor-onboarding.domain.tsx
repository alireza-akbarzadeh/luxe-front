'use client';

import { useTranslations } from 'next-intl';

import { Flex } from '@/components/ui/flex';
import { Stepper, StepperContent, StepperPanel } from '@/components/ui/stepper';
import { Typography } from '@/components/ui/typography';
import { OnboardingFormActions } from '@/domains/vendor/onboarding/components/onboarding-form-actions';
import { OnboardingStepperNav } from '@/domains/vendor/onboarding/components/onboarding-stepper-nav';
import { VendorOnboardingProvider } from '@/domains/vendor/onboarding/context/vendor-onboarding-context';
import { useVendorOnboardingWizard } from '@/domains/vendor/onboarding/hooks/use-vendor-onboarding-wizard';
import { useOnboardingSteps } from '@/domains/vendor/onboarding/lib/onboarding-step-config';
import type { VendorOnboardingStepId } from '@/domains/vendor/onboarding/schemas/vendor-onboarding.schema';
import { AccountStep } from '@/domains/vendor/onboarding/sections/account-step';
import { BusinessStep } from '@/domains/vendor/onboarding/sections/business-step';
import { OperationsStep } from '@/domains/vendor/onboarding/sections/operations-step';
import { ReviewStep } from '@/domains/vendor/onboarding/sections/review-step';
import { StoreStep } from '@/domains/vendor/onboarding/sections/store-step';
import { useVendorOnboardingStore } from '@/domains/vendor/onboarding/stores/vendor-onboarding-store';

interface VendorOnboardingDomainProps {
  isAuthenticated: boolean;
  userEmail?: string;
}

export function VendorOnboardingDomain({
  isAuthenticated,
  userEmail
}: VendorOnboardingDomainProps) {
  const t = useTranslations('vendor.onboarding');
  const { steps } = useOnboardingSteps();
  const accountCreated = useVendorOnboardingStore((s) => s.accountCreated);
  const completedSteps = useVendorOnboardingStore((s) => s.completedSteps);

  const {
    form,
    currentStepId,
    currentIdx,
    isLastStep,
    isSubmitting,
    handleNext,
    handlePrev,
    handleStepperClick
  } = useVendorOnboardingWizard({ isAuthenticated, userEmail, steps });

  return (
    <VendorOnboardingProvider isAuthenticated={isAuthenticated} userEmail={userEmail}>
      <div className='mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14'>
        <Flex direction='column' spacing={2} className='mb-8 text-center'>
          <Typography.H1 className='text-3xl font-semibold tracking-tight md:text-4xl'>
            {t('title')}
          </Typography.H1>
          <Typography.Muted className='mx-auto max-w-2xl text-base'>
            {t('subtitle')}
          </Typography.Muted>
        </Flex>

        <form.AppForm>
          <form.Root
            onSubmit={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isLastStep) {
                await form.handleSubmit();
              } else {
                await handleNext();
              }
            }}
          >
            <Flex direction='column' spacing={8}>
              <Stepper
                steps={steps}
                value={currentStepId}
                onValueChange={(id) => {
                  if (id === currentStepId) return;
                  void handleStepperClick(id as VendorOnboardingStepId);
                }}
                orientation='horizontal'
                responsive
              >
                <OnboardingStepperNav
                  steps={steps}
                  currentStepId={currentStepId}
                  completedSteps={completedSteps}
                  accountCreated={accountCreated}
                  isAuthenticated={isAuthenticated}
                />

                <StepperPanel>
                  <StepperContent value='account' forceMount>
                    {currentStepId === 'account' && <AccountStep form={form} />}
                  </StepperContent>
                  <StepperContent value='business' forceMount>
                    {currentStepId === 'business' && <BusinessStep form={form} />}
                  </StepperContent>
                  <StepperContent value='store' forceMount>
                    {currentStepId === 'store' && <StoreStep form={form} />}
                  </StepperContent>
                  <StepperContent value='operations' forceMount>
                    {currentStepId === 'operations' && <OperationsStep form={form} />}
                  </StepperContent>
                  <StepperContent value='review' forceMount>
                    {currentStepId === 'review' && <ReviewStep form={form} />}
                  </StepperContent>
                </StepperPanel>
              </Stepper>

              <OnboardingFormActions
                currentIdx={currentIdx}
                totalSteps={steps.length}
                isLastStep={isLastStep}
                isSubmitting={isSubmitting}
                onBack={() => void handlePrev()}
              />
            </Flex>
          </form.Root>
        </form.AppForm>
      </div>
    </VendorOnboardingProvider>
  );
}
