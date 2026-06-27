'use client';

import { IconMapPin } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { LocationMapPickerDialog } from '@/components/map/location-map-picker-dialog';
import { NavbarActionButton } from '@/components/navbar/navbar-action-button';
import { useAuth } from '@/components/providers/auth-provider';
import { saveGeocodedShippingAddress } from '@/domains/account/lib/save-geocoded-shipping-address';
import {
  defaultShippingAddressToGeocodedSeed,
  deliveryLocationLabel
} from '@/lib/geocoding/default-address-seed';
import type { GeocodedAddress, GeoCoordinates } from '@/lib/geocoding/types';
import { cn } from '@/lib/utils';
import {
  getGetAccountSummaryQueryKey,
  useGetAccountSummary
} from '@/services/-account-summary-get';
import { getGetAddressesQueryKey } from '@/services/-addresses-get';
import { useDeliveryLocationStore } from '@/stores/delivery-location-store';

function pickMapSeed(
  persisted: GeocodedAddress | null,
  savedDefault: GeocodedAddress | null
): GeocodedAddress | null {
  return persisted ?? savedDefault;
}

function pickMapCoordinates(persisted: GeocodedAddress | null): GeoCoordinates | null {
  if (
    persisted &&
    Number.isFinite(persisted.latitude) &&
    Number.isFinite(persisted.longitude) &&
    !(persisted.latitude === 0 && persisted.longitude === 0)
  ) {
    return { latitude: persisted.latitude, longitude: persisted.longitude };
  }
  return null;
}

export function DeliveryLocationButton() {
  const t = useTranslations('nav.deliveryLocation');
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const location = useDeliveryLocationStore((state) => state.location);
  const setLocation = useDeliveryLocationStore((state) => state.setLocation);

  const { data: summaryResponse } = useGetAccountSummary({
    query: {
      enabled: isAuthenticated,
      staleTime: 10 * 60 * 1000
    }
  });

  const summary = summaryResponse?.data;

  const savedShippingSeed = useMemo(
    () => defaultShippingAddressToGeocodedSeed(summary?.default_shipping_address),
    [summary?.default_shipping_address]
  );

  const label = deliveryLocationLabel(location) ?? deliveryLocationLabel(savedShippingSeed);

  const mapInitialAddress = pickMapSeed(location, savedShippingSeed);
  const mapInitialCoordinates = pickMapCoordinates(location);

  const ariaLabel = label ? t('ariaWithLocation', { location: label }) : t('ariaSetLocation');

  const handleConfirm = async (address: GeocodedAddress) => {
    setLocation(address);

    if (!isAuthenticated || !summary) {
      toast.success(t('saved'));
      return;
    }

    setIsSaving(true);
    try {
      const recipientName = [summary.first_name, summary.last_name]
        .filter(Boolean)
        .join(' ')
        .trim();
      const phone = summary.default_shipping_address?.phone?.trim() || summary.phone?.trim() || '';

      await saveGeocodedShippingAddress(address, {
        recipientName,
        phone,
        existingDefaultShipping: summary.default_shipping_address,
        instructions: summary.default_shipping_address?.address_line1 ? 'Home' : 'Delivery location'
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getGetAccountSummaryQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getGetAddressesQueryKey() })
      ]);

      toast.success(t('savedAsDefault'));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('saveDefaultFailed');
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <NavbarActionButton
        type='button'
        size='sm'
        aria-label={ariaLabel}
        title={ariaLabel}
        onClick={() => setOpen(true)}
        className={cn('h-10 max-w-[9rem] gap-1.5 px-2 sm:max-w-[11rem]')}
      >
        <IconMapPin className='size-5 shrink-0' stroke={1.75} />
        <span className='hidden truncate text-xs font-medium sm:inline'>
          {label ?? t('setLocation')}
        </span>
      </NavbarActionButton>

      <LocationMapPickerDialog
        open={open}
        onOpenChange={(next) => {
          if (!isSaving) setOpen(next);
        }}
        title={t('dialogTitle')}
        description={t('dialogDescription')}
        confirmLabel={isSaving ? t('saving') : t('confirm')}
        cancelLabel={t('cancel')}
        initialAddress={mapInitialAddress}
        initialCoordinates={mapInitialCoordinates}
        onConfirm={(address) => {
          void handleConfirm(address);
        }}
      />
    </>
  );
}
