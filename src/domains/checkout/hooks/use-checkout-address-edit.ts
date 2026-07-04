'use client';

import { useStore } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { useAppForm, useTypedAppFormContext } from '@/components/forms/useAppForm';
import { addressModelToGeocodedSeed } from '@/domains/account/address-form-utils';
import type { GeocodedAddress } from '@/lib/geocoding/types';
import { usePutAddressesId } from '@/services/-addresses-{id}-put';

import {
  applyAddressToCheckoutForm,
  buildAddressUpdatePayload,
  geocodedToAddressEditFields
} from '../lib/checkout-address';
import { upsertCheckoutAddressCache } from '../lib/checkout-address-cache';
import {
  addressToEditFormValues,
  editValuesToMapSeed,
  mergeAddressAfterUpdate
} from '../lib/checkout-address-edit';
import { checkoutDefaultValues } from '../schemas/checkout.schema';
import {
  checkoutAddressEditDefaultValues,
  checkoutAddressEditSchema
} from '../schemas/checkout-address-edit.schema';
import type { CheckoutAddressEditDialogProps } from '../types/checkout.types';

/** Form state, submit, and map-picker flow for the checkout address edit dialog. */
export function useCheckoutAddressEdit({
  open,
  onOpenChange,
  address
}: CheckoutAddressEditDialogProps) {
  const t = useTranslations('checkout.shipping');
  const tCommon = useTranslations('account.common');
  const queryClient = useQueryClient();
  const checkoutForm = useTypedAppFormContext({ defaultValues: checkoutDefaultValues });
  const selectedAddressId = useStore(checkoutForm.store, (s) => s.values.shippingAddressId);
  const updateAddress = usePutAddressesId();
  const [isPending, startTransition] = useTransition();
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const [mapPickerSeed, setMapPickerSeed] = useState<GeocodedAddress | null>(null);

  const editForm = useAppForm({
    defaultValues: checkoutAddressEditDefaultValues,
    validators: {
      onChange: checkoutAddressEditSchema,
      onSubmit: checkoutAddressEditSchema
    },
    onSubmit: async ({ value }) => {
      if (!address?.id) return;

      startTransition(async () => {
        try {
          const payload = buildAddressUpdatePayload(address, {
            addressLine1: value.addressLine1,
            addressLine2: value.addressLine2,
            label: value.label,
            city: value.city,
            state: value.state,
            postal_code: value.zip,
            country: value.country
          });

          const response = await updateAddress.mutateAsync({
            id: address.id as number,
            data: payload
          });

          const updated = mergeAddressAfterUpdate(address, payload, response.address);
          upsertCheckoutAddressCache(queryClient, updated);

          if (selectedAddressId === address.id) {
            applyAddressToCheckoutForm(checkoutForm, updated);
          }

          toast.success(t('addressUpdated'));
          onOpenChange(false);
        } catch (error: unknown) {
          const message =
            (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            tCommon('somethingWrong');
          toast.error(message);
        }
      });
    }
  });

  useEffect(() => {
    if (!open || !address) return;
    editForm.reset(addressToEditFormValues(address));
  }, [address, editForm, open]);

  const handleOpenMapPicker = () => {
    const values = editForm.state.values;
    const hasStreet = values.addressLine1.trim().length > 0;

    if (hasStreet) {
      setMapPickerSeed(editValuesToMapSeed(values));
    } else if (address) {
      setMapPickerSeed(addressModelToGeocodedSeed(address));
    } else {
      setMapPickerSeed(null);
    }

    setIsMapPickerOpen(true);
  };

  const handleMapConfirm = (geocoded: GeocodedAddress) => {
    const mapped = geocodedToAddressEditFields(geocoded);

    editForm.setFieldValue('addressLine1', mapped.addressLine1);
    editForm.setFieldValue('city', mapped.city);
    editForm.setFieldValue('state', mapped.state);
    editForm.setFieldValue('zip', mapped.zip);
    editForm.setFieldValue('country', mapped.country);

    toast.success(t('locationUpdated'));
    setIsMapPickerOpen(false);
  };

  return {
    editForm,
    isPending,
    isMapPickerOpen,
    setIsMapPickerOpen,
    mapPickerSeed,
    handleOpenMapPicker,
    handleMapConfirm,
    handleCancel: () => onOpenChange(false)
  };
}

export type CheckoutAddressEditFormApi = ReturnType<typeof useCheckoutAddressEdit>['editForm'];
