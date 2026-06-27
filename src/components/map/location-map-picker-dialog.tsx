'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { AppDialog } from '@/components/app-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { searchAddress } from '@/lib/geocoding/geocoding-client';
import type { GeocodedAddress, GeoCoordinates } from '@/lib/geocoding/types';

export const MAP_PICKER_DIALOG_HEIGHT = 'h-[min(68vh,620px)] min-h-[320px] sm:min-h-[480px]';

const DeliveryLocationPicker = dynamic(
  () =>
    import('@/components/map/delivery-location-picker').then(
      (module) => module.DeliveryLocationPicker
    ),
  {
    ssr: false,
    loading: () => <Skeleton className={`${MAP_PICKER_DIALOG_HEIGHT} w-full rounded-2xl`} />
  }
);

function hasResolvableQuery(
  address: GeocodedAddress | null | undefined
): address is GeocodedAddress {
  return Boolean(address?.displayName && address.displayName.trim().length >= 3);
}

interface LocationMapPickerSessionProps {
  initialCoordinates?: GeoCoordinates | null;
  initialAddress?: GeocodedAddress | null;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: (address: GeocodedAddress) => void | Promise<void>;
  onCancel: () => void;
}

function LocationMapPickerSession({
  initialCoordinates,
  initialAddress,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel
}: LocationMapPickerSessionProps) {
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

  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    if (!draftAddress || isResolvingSeed) return;

    setIsConfirming(true);
    try {
      await onConfirm(draftAddress);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <>
      {isResolvingSeed && !draftCoordinates ? (
        <Skeleton className={`${MAP_PICKER_DIALOG_HEIGHT} w-full rounded-2xl`} />
      ) : (
        <DeliveryLocationPicker
          value={draftCoordinates ?? initialCoordinates ?? null}
          initialAddress={draftAddress ?? initialAddress ?? null}
          initialSearchQuery={initialAddress?.displayName}
          skipInitialReverseGeocode={Boolean(initialAddress || initialCoordinates)}
          mapClassName={MAP_PICKER_DIALOG_HEIGHT}
          onChange={setDraftCoordinates}
          onAddressResolved={setDraftAddress}
        />
      )}

      <div className='mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
        <Button type='button' variant='outline' onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button
          type='button'
          onClick={handleConfirm}
          disabled={!draftAddress || isResolvingSeed || isConfirming}
        >
          {confirmLabel}
        </Button>
      </div>
    </>
  );
}

export interface LocationMapPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  initialCoordinates?: GeoCoordinates | null;
  initialAddress?: GeocodedAddress | null;
  onConfirm: (address: GeocodedAddress) => void | Promise<void>;
}

/**
 * Responsive map dialog (drawer on mobile) for picking a location via Leaflet + geocoding.
 */
export function LocationMapPickerDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  initialCoordinates,
  initialAddress,
  onConfirm
}: LocationMapPickerDialogProps) {
  const sessionKey = [
    initialCoordinates?.latitude ?? 'no-lat',
    initialCoordinates?.longitude ?? 'no-lng',
    initialAddress?.displayName ?? 'no-address'
  ].join('-');

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size='full'
      className='flex max-h-[96dvh] flex-col'
      contentClassName='overflow-y-auto px-1 sm:px-2'
    >
      {open ? (
        <LocationMapPickerSession
          key={sessionKey}
          initialCoordinates={initialCoordinates}
          initialAddress={initialAddress}
          confirmLabel={confirmLabel}
          cancelLabel={cancelLabel}
          onConfirm={async (address) => {
            await onConfirm(address);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      ) : null}
    </AppDialog>
  );
}
