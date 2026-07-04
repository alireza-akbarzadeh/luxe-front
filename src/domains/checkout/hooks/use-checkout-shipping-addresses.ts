'use client';

import { useStore } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { useTypedAppFormContext } from '@/components/forms/useAppForm';
import {
  addressModelToGeocodedSeed,
  isShippingDefaultAddress
} from '@/domains/account/address-form-utils';
import { checkoutDefaultValues } from '@/domains/checkout/schemas/checkout.schema';
import type { GeocodedAddress } from '@/lib/geocoding/types';
import { useDeleteAddressesId } from '@/services/-addresses-{id}-delete';
import { useGetAddresses } from '@/services/-addresses-get';
import type { ModelsAddress } from '@/services/-addresses-get.schemas';
import { postAddresses } from '@/services/-addresses-post';

import {
  applyAddressToCheckoutForm,
  applyGeocodedToCheckoutForm,
  buildCheckoutCreateAddressPayload,
  isCheckoutShippingAddress
} from '../lib/checkout-address';
import {
  removeCheckoutAddressCache,
  upsertCheckoutAddressCache
} from '../lib/checkout-address-cache';

interface UseCheckoutShippingAddressesOptions {
  isAuthenticated: boolean;
}

/**
 * Saved-address list, hydration, map create, and delete for checkout shipping step.
 * Reads checkout form via `useTypedAppFormContext` — must run inside `form.AppForm`.
 */
export function useCheckoutShippingAddresses({
  isAuthenticated
}: UseCheckoutShippingAddressesOptions) {
  const t = useTranslations('checkout.shipping');
  const queryClient = useQueryClient();
  const form = useTypedAppFormContext({ defaultValues: checkoutDefaultValues });
  const { data: addressesResponse, isLoading: isLoadingAddresses } = useGetAddresses({
    query: { enabled: isAuthenticated }
  });

  const shippingAddressId = useStore(form.store, (s) => s.values.shippingAddressId);
  const isManualAddress = shippingAddressId == null;

  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const [mapPickerSeed, setMapPickerSeed] = useState<GeocodedAddress | null>(null);
  const [editingAddress, setEditingAddress] = useState<ModelsAddress | null>(null);
  const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null);
  const [, startAddressAction] = useTransition();
  const addressesHydratedRef = useRef(false);
  const deleteAddressMutation = useDeleteAddressesId();

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
      applyAddressToCheckoutForm(form, preferred);
    }

    addressesHydratedRef.current = true;
  }, [form, isAuthenticated, isLoadingAddresses, savedAddresses]);

  const selectSavedAddress = (address: ModelsAddress) => {
    applyAddressToCheckoutForm(form, address);
  };

  const handlePickDifferentAddress = () => {
    const values = form.state.values;
    const seed =
      activeSavedAddress != null
        ? addressModelToGeocodedSeed(activeSavedAddress)
        : addressModelToGeocodedSeed({
            address_line1: values.addressLine1,
            address_line2: values.addressLine2,
            city: values.city,
            state: values.state,
            postal_code: values.zip,
            country: values.country,
            recipient_name: `${values.firstName} ${values.lastName}`.trim()
          } as ModelsAddress);

    setMapPickerSeed(seed);
    setIsMapPickerOpen(true);
  };

  const handleMapConfirm = (geocoded: GeocodedAddress) => {
    const values = form.state.values;
    const phone = values.phone || activeSavedAddress?.phone || '';
    const recipientName =
      `${values.firstName} ${values.lastName}`.trim() ||
      activeSavedAddress?.recipient_name ||
      'Customer';

    if (isAuthenticated) {
      const payload = buildCheckoutCreateAddressPayload(geocoded, {
        recipientName,
        phone,
        addressLine2: values.addressLine2
      });

      if (payload) {
        startAddressAction(async () => {
          try {
            const response = await postAddresses(payload);
            const created = response.address;

            if (created?.id) {
              upsertCheckoutAddressCache(queryClient, created);
              applyAddressToCheckoutForm(form, created);
              toast.success(t('addressSaved'));
              setIsMapPickerOpen(false);
              return;
            }
          } catch (error: unknown) {
            const message =
              (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
              t('addressSaveFailed');
            toast.error(message);
          }

          applyGeocodedToCheckoutForm(form, geocoded);
          toast.success(t('locationUpdated'));
          setIsMapPickerOpen(false);
        });
        return;
      }
    }

    applyGeocodedToCheckoutForm(form, geocoded);
    toast.success(t('locationUpdated'));
    setIsMapPickerOpen(false);
  };

  const handleDeleteAddress = (address: ModelsAddress) => {
    if (address.id == null) return;

    const addressId = address.id as number;
    setDeletingAddressId(addressId);

    startAddressAction(async () => {
      try {
        await deleteAddressMutation.mutateAsync({ id: addressId });
        removeCheckoutAddressCache(queryClient, addressId);

        if (shippingAddressId === addressId) {
          const remaining = savedAddresses.filter((item) => item.id !== addressId);
          const next = remaining.find((item) => isShippingDefaultAddress(item)) ?? remaining[0];

          if (next) {
            applyAddressToCheckoutForm(form, next);
          } else {
            form.setFieldValue('shippingAddressId', null);
          }
        }

        toast.success(t('addressDeleted'));
      } catch (error: unknown) {
        const message =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          t('addressDeleteFailed');
        toast.error(message);
      } finally {
        setDeletingAddressId(null);
      }
    });
  };

  const closeEditDialog = () => setEditingAddress(null);

  return {
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
  };
}
