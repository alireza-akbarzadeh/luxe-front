'use client';

import { useTranslations } from 'next-intl';

import { withForm } from '@/components/forms/useAppForm';
import { Grid } from '@/components/ui/grid';
import { OnboardingCard } from '@/domains/vendor/onboarding/components/onboarding-card';
import { useOnboardingFieldOptions } from '@/domains/vendor/onboarding/lib/onboarding-field-options';
import { vendorOnboardingDefaults } from '@/domains/vendor/onboarding/schemas/vendor-onboarding.schema';

export const BusinessStep = withForm({
  defaultValues: vendorOnboardingDefaults,
  render: function BusinessStepRender({ form }) {
    const t = useTranslations('vendor.onboarding');
    const { businessTypeOptions, countryOptions } = useOnboardingFieldOptions();

    return (
      <OnboardingCard
        title={t('steps.business.cardTitle')}
        description={t('steps.business.cardDescription')}
      >
        <Grid cols={1} gap={4} className='sm:grid-cols-2'>
          <form.AppField
            name='businessLegalName'
            children={(field) => (
              <field.TextField
                label={t('fields.businessLegalName.label')}
                required
                className='sm:col-span-2'
              />
            )}
          />
          <form.AppField
            name='businessType'
            children={(field) => (
              <field.Select
                label={t('fields.businessType.label')}
                options={businessTypeOptions}
                required
              />
            )}
          />
          <form.AppField
            name='country'
            children={(field) => (
              <field.Select label={t('fields.country.label')} options={countryOptions} required />
            )}
          />
          <form.AppField
            name='website'
            children={(field) => (
              <field.TextField label={t('fields.website.label')} placeholder='https://' />
            )}
          />
          <form.AppField
            name='taxId'
            children={(field) => <field.TextField label={t('fields.taxId.label')} />}
          />
        </Grid>
      </OnboardingCard>
    );
  }
});
