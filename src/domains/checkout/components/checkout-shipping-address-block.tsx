'use client';

import { useTranslations } from 'next-intl';

import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Typography } from '@/components/ui/typography';
import { AddressMapPickerDialog } from '@/domains/account/components/address-map-picker-dialog';

import { useCheckoutShippingAddresses } from '../hooks/use-checkout-shipping-addresses';
import { formatCheckoutAddressLabel } from '../lib/checkout-address';
import { CHECKOUT_COUNTRY_OPTIONS } from '../lib/checkout-countries';
import { CheckoutAddressEditDialog } from './checkout-address-edit-dialog';
import { CheckoutAddressPicker } from './checkout-address-picker';
import { CheckoutPickDifferentAddress } from './checkout-pick-different-address';

interface CheckoutShippingAddressBlockProps {
  isAuthenticated: boolean;
}

/** Saved-address picker, map picker, quick edit, and manual shipping fields. */
export function CheckoutShippingAddressBlock({
  isAuthenticated
}: CheckoutShippingAddressBlockProps) {
  const t = useTranslations('checkout.shipping');

  const {
    form,
    shippingAddressId,
    isManualAddress,
    isLoadingAddresses,
    savedAddresses,
    activeSavedAddress,
    isMapPickerOpen,
    setIsMapPickerOpen,
    mapPickerSeed,
    editingAddress,
    setEditingAddress,
    closeEditDialog,
    deletingAddressId,
    selectSavedAddress,
    handlePickDifferentAddress,
    handleMapConfirm,
    handleDeleteAddress
  } = useCheckoutShippingAddresses({ isAuthenticated });

  return (
    <Flex direction='column' spacing={4}>
      <Typography.Text variant='small' className='font-semibold'>
        {t('address')}
      </Typography.Text>

      {isAuthenticated && isLoadingAddresses ? (
        <Typography.Text variant='muted'>{t('loadingAddresses')}</Typography.Text>
      ) : savedAddresses.length > 0 ? (
        <CheckoutAddressPicker
          addresses={savedAddresses}
          selectedId={shippingAddressId}
          onSelectAddress={selectSavedAddress}
          onEditAddress={setEditingAddress}
          onDeleteAddress={handleDeleteAddress}
          isDeletingId={deletingAddressId}
        />
      ) : null}

      {activeSavedAddress && !isManualAddress ? (
        <Flex
          direction='column'
          spacing={1}
          className='bg-muted border-border rounded-xl border px-4 py-3'
        >
          <Typography.Text variant='small' className='font-medium'>
            {t('deliveringTo')}
          </Typography.Text>
          <Typography.Text variant='subtle'>
            {formatCheckoutAddressLabel(activeSavedAddress).subtitle}
          </Typography.Text>
        </Flex>
      ) : null}

      {savedAddresses.length > 0 ? (
        <CheckoutPickDifferentAddress
          isActive={isManualAddress}
          onClick={handlePickDifferentAddress}
        />
      ) : null}

      {isManualAddress ? (
        <>
          <Typography.Text variant='subtle'>{t('addressEditableHint')}</Typography.Text>
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
      ) : (
        <form.AppField name='phone'>
          {(field) => (
            <field.InputPhone
              label={t('phone')}
              placeholder={t('phonePlaceholder')}
              autoComplete='tel'
            />
          )}
        </form.AppField>
      )}

      <AddressMapPickerDialog
        open={isMapPickerOpen}
        onOpenChange={setIsMapPickerOpen}
        initialAddress={mapPickerSeed}
        onConfirm={handleMapConfirm}
      />

      <CheckoutAddressEditDialog
        open={editingAddress != null}
        onOpenChange={(open) => {
          if (!open) closeEditDialog();
        }}
        address={editingAddress}
      />
    </Flex>
  );
}
