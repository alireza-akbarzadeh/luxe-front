'use client';

import { useTranslations } from 'next-intl';

/** Select options for vendor onboarding fields — locale-aware labels. */
export function useOnboardingFieldOptions() {
  const t = useTranslations('vendor.onboarding');

  return {
    businessTypeOptions: [
      { value: 'brand', label: t('fields.businessType.options.brand') },
      { value: 'company', label: t('fields.businessType.options.company') },
      { value: 'individual', label: t('fields.businessType.options.individual') }
    ],
    fulfillmentOptions: [
      { value: 'self', label: t('fields.fulfillmentModel.options.self') },
      { value: 'platform', label: t('fields.fulfillmentModel.options.platform') },
      { value: 'hybrid', label: t('fields.fulfillmentModel.options.hybrid') }
    ],
    countryOptions: [
      { value: 'US', label: t('fields.country.options.us') },
      { value: 'CA', label: t('fields.country.options.ca') },
      { value: 'GB', label: t('fields.country.options.gb') },
      { value: 'DE', label: t('fields.country.options.de') },
      { value: 'FR', label: t('fields.country.options.fr') },
      { value: 'IR', label: t('fields.country.options.ir') },
      { value: 'AE', label: t('fields.country.options.ae') }
    ]
  };
}
