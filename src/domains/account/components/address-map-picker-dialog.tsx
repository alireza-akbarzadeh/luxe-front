'use client';

import { useTranslations } from 'next-intl';

import { LocationMapPickerDialog } from '@/components/map/location-map-picker-dialog';
import type { GeocodedAddress, GeoCoordinates } from '@/lib/geocoding/types';

interface AddressMapPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCoordinates?: GeoCoordinates | null;
  initialAddress?: GeocodedAddress | null;
  onConfirm: (address: GeocodedAddress) => void;
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
  const t = useTranslations('account.addresses');
  const tCommon = useTranslations('account.common');

  return (
    <LocationMapPickerDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('mapDialogTitle')}
      description={t('mapDialogDescription')}
      confirmLabel={t('useThisLocation')}
      cancelLabel={tCommon('cancel')}
      initialCoordinates={initialCoordinates}
      initialAddress={initialAddress}
      onConfirm={onConfirm}
    />
  );
}
