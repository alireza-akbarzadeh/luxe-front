'use client';

import { useTranslations } from 'next-intl';

import { useTypedAppFormContext } from '@/components/forms/useAppForm';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Typography } from '@/components/ui/typography';
import { checkoutDefaultValues } from '@/domains/checkout/schemas/checkout.schema';

import { CHECKOUT_COUNTRY_OPTIONS } from '../lib/checkout-countries';

/** Manual shipping address fields when no saved address is selected. */
export function CheckoutManualAddressFields() {
  const t = useTranslations('checkout.shipping');
  const form = useTypedAppFormContext({ defaultValues: checkoutDefaultValues });

  return (
    <>
      <Typography.Muted className='text-sm'>{t('addressEditableHint')}</Typography.Muted>
      <Grid template='form' gap={4} className='min-w-0'>
        <GridItem>
          <form.AppField name='firstName'>
            {(field) => (
              <field.TextField
                label={t('firstName')}
                placeholder={t('firstNamePlaceholder')}
                autoComplete='given-name'
              />
            )}
          </form.AppField>
        </GridItem>
        <GridItem>
          <form.AppField name='lastName'>
            {(field) => (
              <field.TextField
                label={t('lastName')}
                placeholder={t('lastNamePlaceholder')}
                autoComplete='family-name'
              />
            )}
          </form.AppField>
        </GridItem>
      </Grid>
      <form.AppField name='addressLine1'>
        {(field) => (
          <field.TextField
            label={t('addressLine1')}
            placeholder={t('addressLine1Placeholder')}
            autoComplete='address-line1'
          />
        )}
      </form.AppField>
      <form.AppField name='addressLine2'>
        {(field) => (
          <field.TextField
            label={t('addressLine2')}
            placeholder={t('addressLine2Placeholder')}
            autoComplete='address-line2'
          />
        )}
      </form.AppField>
      <Grid gap={4} className='min-w-0 grid-cols-1 sm:grid-cols-3'>
        <GridItem>
          <form.AppField name='city'>
            {(field) => (
              <field.TextField
                label={t('city')}
                placeholder={t('cityPlaceholder')}
                autoComplete='address-level2'
              />
            )}
          </form.AppField>
        </GridItem>
        <GridItem>
          <form.AppField name='state'>
            {(field) => (
              <field.TextField
                label={t('state')}
                placeholder={t('statePlaceholder')}
                autoComplete='address-level1'
              />
            )}
          </form.AppField>
        </GridItem>
        <GridItem>
          <form.AppField name='zip'>
            {(field) => (
              <field.TextField
                label={t('zip')}
                placeholder={t('zipPlaceholder')}
                autoComplete='postal-code'
              />
            )}
          </form.AppField>
        </GridItem>
      </Grid>
      <form.AppField name='country'>
        {(field) => (
          <field.Select
            label={t('country')}
            options={[...CHECKOUT_COUNTRY_OPTIONS]}
            placeholder={t('countryPlaceholder')}
          />
        )}
      </form.AppField>
      <form.AppField name='phone'>
        {(field) => (
          <field.InputPhone
            label={t('phone')}
            placeholder={t('phonePlaceholder')}
            autoComplete='tel'
          />
        )}
      </form.AppField>
      <form.AppField name='saveInfo'>
        {(field) => <field.Checkbox label={t('saveInfo')} id='checkout-save-info' />}
      </form.AppField>
    </>
  );
}
