'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

import { AppDialog } from '@/components/app-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { GeocodedAddress, GeoCoordinates } from '@/lib/geocoding/types';

const DeliveryLocationPicker = dynamic(
  () =>
    import('@/components/map/delivery-location-picker').then(
      (module) => module.DeliveryLocationPicker
    ),
  {
    ssr: false,
    loading: () => <Skeleton className='h-[min(52vh,420px)] w-full rounded-2xl' />
  }
);

interface AddressMapPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCoordinates?: GeoCoordinates | null;
  onConfirm: (address: GeocodedAddress) => void;
}

/**
 * Responsive map dialog for picking a delivery location in account addresses.
 */
export function AddressMapPickerDialog({
  open,
  onOpenChange,
  initialCoordinates,
  onConfirm
}: AddressMapPickerDialogProps) {
  const [draftCoordinates, setDraftCoordinates] = useState<GeoCoordinates | null>(null);
  const [draftAddress, setDraftAddress] = useState<GeocodedAddress | null>(null);

  const pickerKey = initialCoordinates
    ? `${initialCoordinates.latitude}-${initialCoordinates.longitude}`
    : 'default';

  const handleConfirm = () => {
    if (!draftAddress) return;
    onConfirm(draftAddress);
    onOpenChange(false);
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setDraftCoordinates(null);
          setDraftAddress(null);
        }
        onOpenChange(nextOpen);
      }}
      title='Choose delivery location'
      description='Search, use your current location, or drag the pin on the map.'
      size='xl'
      className='flex max-h-[92dvh] flex-col'
      contentClassName='overflow-y-auto'
    >
      {open ? (
        <DeliveryLocationPicker
          key={pickerKey}
          value={draftCoordinates ?? initialCoordinates ?? null}
          onChange={setDraftCoordinates}
          onAddressResolved={setDraftAddress}
        />
      ) : null}

      <div className='mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
        <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button type='button' onClick={handleConfirm} disabled={!draftAddress}>
          Use this location
        </Button>
      </div>
    </AppDialog>
  );
}
