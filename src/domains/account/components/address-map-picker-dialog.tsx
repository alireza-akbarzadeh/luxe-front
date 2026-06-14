'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { AppDialog } from '@/components/app-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { searchAddress } from '@/lib/geocoding/geocoding-client';
import type { GeocodedAddress, GeoCoordinates } from '@/lib/geocoding/types';

const MAP_DIALOG_HEIGHT = 'h-[min(68vh,620px)] min-h-[320px] sm:min-h-[480px]';

const DeliveryLocationPicker = dynamic(
  () =>
    import('@/components/map/delivery-location-picker').then(
      (module) => module.DeliveryLocationPicker
    ),
  {
    ssr: false,
    loading: () => <Skeleton className={`${MAP_DIALOG_HEIGHT} w-full rounded-2xl`} />
  }
);

interface AddressMapPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCoordinates?: GeoCoordinates | null;
  initialAddress?: GeocodedAddress | null;
  onConfirm: (address: GeocodedAddress) => void;
}

function hasResolvableQuery(
  address: GeocodedAddress | null | undefined
): address is GeocodedAddress {
  return Boolean(address?.displayName && address.displayName.trim().length >= 3);
}

interface AddressMapPickerSessionProps {
  initialCoordinates?: GeoCoordinates | null;
  initialAddress?: GeocodedAddress | null;
  onConfirm: (address: GeocodedAddress) => void;
  onCancel: () => void;
}

/**
 * Mounted only while the dialog is open — state resets naturally on unmount.
 */
function AddressMapPickerSession({
  initialCoordinates,
  initialAddress,
  onConfirm,
  onCancel
}: AddressMapPickerSessionProps) {
  const needsAsyncGeocode = !initialCoordinates && hasResolvableQuery(initialAddress);

  const [draftCoordinates, setDraftCoordinates] = useState<GeoCoordinates | null>(
    initialCoordinates ?? null
  );
  const [draftAddress, setDraftAddress] = useState<GeocodedAddress | null>(initialAddress ?? null);
  const [isResolvingSeed, setIsResolvingSeed] = useState(needsAsyncGeocode);

  useEffect(() => {
    if (!needsAsyncGeocode || !initialAddress) return;

    let cancelled = false;

    void searchAddress(initialAddress.displayName)
      .then((results) => {
        if (cancelled) return;

        const match = results[0];
        if (!match) return;

        setDraftCoordinates({
          latitude: match.latitude,
          longitude: match.longitude
        });
        setDraftAddress(match);
      })
      .finally(() => {
        if (!cancelled) setIsResolvingSeed(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initialAddress, needsAsyncGeocode]);

  const handleConfirm = () => {
    if (!draftAddress) return;
    onConfirm(draftAddress);
  };

  return (
    <>
      {isResolvingSeed && !draftCoordinates ? (
        <Skeleton className={`${MAP_DIALOG_HEIGHT} w-full rounded-2xl`} />
      ) : (
        <DeliveryLocationPicker
          value={draftCoordinates ?? initialCoordinates ?? null}
          initialAddress={draftAddress ?? initialAddress ?? null}
          initialSearchQuery={initialAddress?.displayName}
          skipInitialReverseGeocode={Boolean(initialAddress || initialCoordinates)}
          mapClassName={MAP_DIALOG_HEIGHT}
          onChange={setDraftCoordinates}
          onAddressResolved={setDraftAddress}
        />
      )}

      <div className='mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='button' onClick={handleConfirm} disabled={!draftAddress || isResolvingSeed}>
          Use this location
        </Button>
      </div>
    </>
  );
}

/**
 * Responsive map dialog for picking a delivery location in account addresses.
 * Seeds from existing form values when editing so users can adjust one field on the map.
 */
export function AddressMapPickerDialog({
  open,
  onOpenChange,
  initialCoordinates,
  initialAddress,
  onConfirm
}: AddressMapPickerDialogProps) {
  const sessionKey = [
    initialCoordinates?.latitude ?? 'no-lat',
    initialCoordinates?.longitude ?? 'no-lng',
    initialAddress?.displayName ?? 'no-address'
  ].join('-');

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Choose delivery location'
      description='Search, use your current location, or drag the pin on the map.'
      size='full'
      className='flex max-h-[96dvh] flex-col'
      contentClassName='overflow-y-auto px-1 sm:px-2'
    >
      {open ? (
        <AddressMapPickerSession
          key={sessionKey}
          initialCoordinates={initialCoordinates}
          initialAddress={initialAddress}
          onConfirm={(address) => {
            onConfirm(address);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      ) : null}
    </AppDialog>
  );
}
