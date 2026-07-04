'use client';

import { useStore } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { withForm } from '@/components/forms/useAppForm';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Typography } from '@/components/ui/typography';
import {
  addressModelToGeocodedSeed,
  isShippingDefaultAddress
} from '@/domains/account/address-form-utils';
import { AddressMapPickerDialog } from '@/domains/account/components/address-map-picker-dialog';
import { checkoutDefaultValues } from '@/domains/checkout/checkout.schema';
import type { GeocodedAddress } from '@/lib/geocoding/types';
import { getGetAddressesQueryKey, useGetAddresses } from '@/services/-addresses-get';
import type { ModelsAddress } from '@/services/-addresses-get.schemas';

import {
  applyAddressToCheckoutForm,
  applyGeocodedToCheckoutForm,
  formatCheckoutAddressLabel,
  isCheckoutShippingAddress
} from '../lib/checkout-address';
import { CHECKOUT_COUNTRY_OPTIONS } from '../lib/checkout-countries';
import { CheckoutAddressEditDialog } from './checkout-address-edit-dialog';
import { CheckoutAddressPicker } from './checkout-address-picker';

interface CheckoutShippingAddressBlockProps {
  isAuthenticated: boolean;
}

/** Saved-address picker, map picker, quick edit, and manual shipping fields. */
export const CheckoutShippingAddressBlock = withForm({
  defaultValues: checkoutDefaultValues,
  props: {} as CheckoutShippingAddressBlockProps,
  render: function AddressBlockRender({ form, isAuthenticated }) {
    const t = useTranslations('checkout.shipping');
    const queryClient = useQueryClient();
    const { data: addressesResponse, isLoading: isLoadingAddresses } = useGetAddresses({
      query: { enabled: isAuthenticated }
    });

    const shippingAddressId = useStore(form.store, (s) => s.values.shippingAddressId);
    const isManualAddress = shippingAddressId == null;

    const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
    const [mapPickerSeed, setMapPickerSeed] = useState<GeocodedAddress | null>(null);
    const [editingAddress, setEditingAddress] = useState<ModelsAddress | null>(null);
    const addressesHydratedRef = useRef(false);

    const savedAddresses = useMemo(
      () => (addressesResponse?.data?.addresses ?? []).filter(isCheckoutShippingAddress),
      [addressesResponse?.data?.addresses]
    );

    const activeSavedAddress = useMemo(
      () => savedAddresses.find((address) => address.id === shippingAddressId) ?? null,
      [savedAddresses, shippingAddressId]
    );

    useEffect(() => {
      if (!isAuthenticated || isLoadingAddresses || addressesHydratedRef.current) return;
      if (savedAddresses.length === 0) {
        addressesHydratedRef.current = true;
        return;
      }

      const currentId = form.state.values.shippingAddressId;
      if (currentId != null && savedAddresses.some((address) => address.id === currentId)) {
        addressesHydratedRef.current = true;
        return;
      }

      const preferred =
        savedAddresses.find((address) => isShippingDefaultAddress(address)) ?? savedAddresses[0];

      if (preferred) {
        applyAddressToCheckoutForm(
          form as { setFieldValue: (name: string, value: unknown) => void },
          preferred
        );
      }

      addressesHydratedRef.current = true;
    }, [form, isAuthenticated, isLoadingAddresses, savedAddresses]);

    const handlePickDifferentAddress = () => {
      const seed =
        activeSavedAddress != null
          ? addressModelToGeocodedSeed(activeSavedAddress)
          : addressModelToGeocodedSeed({
              address_line1: form.state.values.addressLine1,
              address_line2: form.state.values.addressLine2,
              city: form.state.values.city,
              state: form.state.values.state,
              postal_code: form.state.values.zip,
              country: form.state.values.country,
              recipient_name: `${form.state.values.firstName} ${form.state.values.lastName}`.trim()
            } as ModelsAddress);

      setMapPickerSeed(seed);
      setIsMapPickerOpen(true);
    };

    const handleMapConfirm = (geocoded: GeocodedAddress) => {
      applyGeocodedToCheckoutForm(
        form as { setFieldValue: (name: string, value: unknown) => void },
        geocoded
      );
      void queryClient.invalidateQueries({ queryKey: getGetAddressesQueryKey() });
      toast.success(t('locationUpdated'));
      setIsMapPickerOpen(false);
    };

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
            onSelectAddress={(address) =>
              applyAddressToCheckoutForm(
                form as { setFieldValue: (name: string, value: unknown) => void },
                address
              )
            }
            onPickDifferentAddress={handlePickDifferentAddress}
            onEditAddress={setEditingAddress}
            isManualSelected={isManualAddress}
          />
        ) : null}

        {activeSavedAddress && !isManualAddress ? (
          <Flex
            direction='column'
            spacing={1}
            className='bg-muted/40 border-border rounded-xl border px-4 py-3'
          >
            <Typography.Text variant='small' className='font-medium'>
              {t('deliveringTo')}
            </Typography.Text>
            <Typography.Text variant='subtle'>
              {formatCheckoutAddressLabel(activeSavedAddress).subtitle}
            </Typography.Text>
          </Flex>
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
            if (!open) setEditingAddress(null);
          }}
          address={editingAddress}
          form={form as { setFieldValue: (name: string, value: unknown) => void }}
          selectedAddressId={shippingAddressId}
        />
      </Flex>
    );
  }
});
