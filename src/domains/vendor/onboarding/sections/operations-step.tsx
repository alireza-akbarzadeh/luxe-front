'use client';

import { useTranslations } from 'next-intl';

import { withForm } from '@/components/forms/useAppForm';
import { Grid } from '@/components/ui/grid';
import { OnboardingCard } from '@/domains/vendor/onboarding/components/onboarding-card';
import { useOnboardingFieldOptions } from '@/domains/vendor/onboarding/lib/onboarding-field-options';
import { vendorOnboardingDefaults } from '@/domains/vendor/onboarding/schemas/vendor-onboarding.schema';

export const OperationsStep = withForm({
  defaultValues: vendorOnboardingDefaults,
  render: function OperationsStepRender({ form }) {
    const t = useTranslations('vendor.onboarding');
    const { fulfillmentOptions } = useOnboardingFieldOptions();

    return (
      <OnboardingCard
        title={t('steps.operations.cardTitle')}
        description={t('steps.operations.cardDescription')}
      >
        <Grid cols={1} gap={4}>
          <form.AppField
            name='fulfillmentModel'
            children={(field) => (
              <field.Select
                label={t('fields.fulfillmentModel.label')}
                options={fulfillmentOptions}
                required
              />
            )}
          />
          <form.AppField
            name='shippingInfo'
            children={(field) => (
              <field.TextArea label={t('fields.shippingInfo.label')} rows={3} required />
            )}
          />
          <form.AppField
            name='returnPolicy'
            children={(field) => (
              <field.TextArea label={t('fields.returnPolicy.label')} rows={3} required />
            )}
          />
        </Grid>
      </OnboardingCard>
    );
  }
});
