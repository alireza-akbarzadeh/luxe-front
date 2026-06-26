'use client';

import { useTranslations } from 'next-intl';

import { withForm } from '@/components/forms/useAppForm';
import { Flex } from '@/components/ui/flex';
import { OnboardingCard } from '@/domains/vendor/onboarding/components/onboarding-card';
import { ReviewRow } from '@/domains/vendor/onboarding/components/review-row';
import { VendorAgreementField } from '@/domains/vendor/onboarding/components/vendor-agreement-field';
import { vendorOnboardingDefaults } from '@/domains/vendor/onboarding/schemas/vendor-onboarding.schema';
import { useVendorOnboardingStore } from '@/domains/vendor/onboarding/stores/vendor-onboarding-store';

export const ReviewStep = withForm({
  defaultValues: vendorOnboardingDefaults,
  render: function ReviewStepRender({ form }) {
    const t = useTranslations('vendor.onboarding');
    const draft = useVendorOnboardingStore((s) => s.draft);

    return (
      <OnboardingCard
        title={t('steps.review.cardTitle')}
        description={t('steps.review.cardDescription')}
      >
        <Flex direction='column' spacing={4}>
          <ReviewRow label={t('fields.storeName.label')} value={draft.storeName} />
          <ReviewRow label={t('fields.businessLegalName.label')} value={draft.businessLegalName} />
          <ReviewRow label={t('fields.country.label')} value={draft.country} />
          <ReviewRow label={t('fields.location.label')} value={draft.location} />
          <form.AppField name='acceptVendorTerms' children={() => <VendorAgreementField />} />
        </Flex>
      </OnboardingCard>
    );
  }
});
