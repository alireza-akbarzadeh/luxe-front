'use client';

import { useTranslations } from 'next-intl';

import { withForm } from '@/components/forms/useAppForm';
import { Grid } from '@/components/ui/grid';
import { Typography } from '@/components/ui/typography';
import { OnboardingCard } from '@/domains/vendor/onboarding/components/onboarding-card';
import { useVendorOnboardingContext } from '@/domains/vendor/onboarding/context/vendor-onboarding-context';
import { vendorOnboardingDefaults } from '@/domains/vendor/onboarding/schemas/vendor-onboarding.schema';
import { useVendorOnboardingStore } from '@/domains/vendor/onboarding/stores/vendor-onboarding-store';

export const AccountStep = withForm({
  defaultValues: vendorOnboardingDefaults,
  render: function AccountStepRender({ form }) {
    const t = useTranslations('vendor.onboarding');
    const { isAuthenticated, userEmail } = useVendorOnboardingContext();
    const draftEmail = useVendorOnboardingStore((s) => s.draft.email);

    return (
      <OnboardingCard
        title={t('steps.account.cardTitle')}
        description={t('steps.account.cardDescription')}
      >
        {isAuthenticated ? (
          <Typography.Muted className='text-sm'>
            {t('steps.account.signedInAs', { email: userEmail ?? draftEmail })}
          </Typography.Muted>
        ) : (
          <Grid cols={1} gap={4} className='sm:grid-cols-2'>
            <form.AppField
              name='firstName'
              children={(field) => <field.TextField label={t('fields.firstName.label')} required />}
            />
            <form.AppField
              name='lastName'
              children={(field) => <field.TextField label={t('fields.lastName.label')} required />}
            />
            <form.AppField
              name='email'
              children={(field) => (
                <field.TextField
                  label={t('fields.email.label')}
                  type='email'
                  required
                  className='sm:col-span-2'
                />
              )}
            />
            <form.AppField
              name='phone'
              children={(field) => (
                <field.InputPhone label={t('fields.phone.label')} className='sm:col-span-2' />
              )}
            />
            <form.AppField
              name='password'
              children={(field) => (
                <field.InputPassword label={t('fields.password.label')} required />
              )}
            />
            <form.AppField
              name='confirmPassword'
              children={(field) => (
                <field.InputPassword label={t('fields.confirmPassword.label')} required />
              )}
            />
          </Grid>
        )}
      </OnboardingCard>
    );
  }
});
