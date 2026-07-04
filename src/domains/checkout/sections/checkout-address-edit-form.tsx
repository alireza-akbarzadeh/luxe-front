'use client';

import { IconMapPin } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import type { CheckoutAddressEditFormProps } from '@/domains/checkout/types/checkout.types';

import { CHECKOUT_COUNTRY_OPTIONS } from '../lib/checkout-countries';

export function CheckoutAddressEditForm({
  form,
  isPending,
  onPickOnMap,
  onCancel
}: CheckoutAddressEditFormProps) {
  const t = useTranslations('checkout.shipping');
  const tCommon = useTranslations('account.common');

  return (
    <form.AppForm>
      <form.Root
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className='space-y-4'
      >
        <Button
          type='button'
          variant='outline'
          className='w-full rounded-full sm:w-auto'
          onClick={onPickOnMap}
        >
          <IconMapPin className='me-2 h-4 w-4' />
          {t('pickOnMap')}
        </Button>

        <form.AppField name='label'>
          {(field) => (
            <field.TextField label={t('addressLabel')} placeholder={t('addressLabelPlaceholder')} />
          )}
        </form.AppField>
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
        <Flex direction='row' justify='end' spacing={2} className='pt-2'>
          <Button type='button' variant='outline' onClick={onCancel}>
            {tCommon('cancel')}
          </Button>
          <form.Submit isPending={isPending} label={tCommon('saveAddress')} />
        </Flex>
      </form.Root>
    </form.AppForm>
  );
}
