'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { getFieldErrorMessage } from '@/components/forms/form';
import { withForm } from '@/components/forms/useAppForm';
import { Grid } from '@/components/ui/grid';
import { OnboardingCard } from '@/domains/vendor/onboarding/components/onboarding-card';
import { VendorLocationField } from '@/domains/vendor/onboarding/components/vendor-location-field';
import { vendorOnboardingDefaults } from '@/domains/vendor/onboarding/schemas/vendor-onboarding.schema';
import { useGetCategories } from '@/services/-categories-get';

export const StoreStep = withForm({
  defaultValues: vendorOnboardingDefaults,
  render: function StoreStepRender({ form }) {
    const t = useTranslations('vendor.onboarding');
    const { data: categoriesData } = useGetCategories({ limit: 100 });

    const categoryOptions = useMemo(() => {
      const categories = categoriesData?.data?.categories ?? [];
      return categories
        .filter((category) => category.id)
        .map((category) => ({
          value: String(category.id),
          label: category.name ?? `Category ${category.id}`
        }));
    }, [categoriesData]);

    return (
      <OnboardingCard
        title={t('steps.store.cardTitle')}
        description={t('steps.store.cardDescription')}
      >
        <Grid cols={1} gap={4}>
          <form.AppField
            name='storeName'
            children={(field) => <field.TextField label={t('fields.storeName.label')} required />}
          />
          <form.AppField
            name='storeDescription'
            children={(field) => (
              <field.TextArea label={t('fields.storeDescription.label')} rows={4} required />
            )}
          />
          <form.AppField
            name='location'
            children={(field) => (
              <VendorLocationField
                location={field.state.value ?? ''}
                locationLat={form.state.values.locationLat}
                locationLng={form.state.values.locationLng}
                onChange={({ location, locationLat, locationLng }) => {
                  field.handleChange(location);
                  form.setFieldValue('locationLat', locationLat);
                  form.setFieldValue('locationLng', locationLng);
                }}
                error={
                  field.state.meta.isTouched && field.state.meta.errors?.[0]
                    ? (getFieldErrorMessage(field.state.meta.errors[0]) ?? undefined)
                    : undefined
                }
              />
            )}
          />
          <form.AppField
            name='categoryIds'
            children={(field) => (
              <field.MultiSelect
                label={`${t('fields.categoryIds.label')} *`}
                placeholder={t('fields.categoryIds.placeholder')}
                props={{
                  options: categoryOptions,
                  getOptionValue: (opt) => opt.value,
                  getOptionLabel: (opt) => opt.label
                }}
              />
            )}
          />
          <form.AppField
            name='logoUrl'
            children={(field) => (
              <field.TextField
                label={t('fields.logoUrl.label')}
                placeholder='https://'
                detail={t('fields.logoUrl.detail')}
              />
            )}
          />
        </Grid>
      </OnboardingCard>
    );
  }
});
