'use client';

import { IconMapPin } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { LocationMapPickerDialog } from '@/components/map/location-map-picker-dialog';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import type { GeocodedAddress, GeoCoordinates } from '@/lib/geocoding/types';

interface VendorLocationFieldProps {
  location: string;
  locationLat?: number;
  locationLng?: number;
  onChange: (values: { location: string; locationLat?: number; locationLng?: number }) => void;
  error?: string;
}

function formatLocationLabel(address: GeocodedAddress): string {
  if (address.displayName?.trim()) return address.displayName.trim();
  const parts = [address.city, address.country].filter(Boolean);
  return parts.join(', ');
}

export function VendorLocationField({
  location,
  locationLat,
  locationLng,
  onChange,
  error
}: VendorLocationFieldProps) {
  const t = useTranslations('vendor.onboarding.fields.location');
  const tCommon = useTranslations('account.common');
  const [open, setOpen] = useState(false);

  const initialCoordinates: GeoCoordinates | null =
    locationLat != null && locationLng != null
      ? { latitude: locationLat, longitude: locationLng }
      : null;

  const initialAddress: GeocodedAddress | null = location
    ? {
        displayName: location,
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        latitude: locationLat ?? 0,
        longitude: locationLng ?? 0
      }
    : null;

  return (
    <Flex direction='column' spacing={2} fullWidth>
      <Typography.Text className='text-sm font-medium'>
        {t('label')}
        <span className='text-destructive ml-0.5'>*</span>
      </Typography.Text>

      <Flex
        direction='row'
        align='center'
        justify='between'
        fullWidth
        className='border-input bg-background rounded-md border px-3 py-2'
      >
        <Flex direction='row' align='center' spacing={2} className='min-w-0 flex-1'>
          <IconMapPin className='text-muted-foreground size-4 shrink-0' aria-hidden />
          <Typography.Text className='truncate text-sm'>
            {location || t('placeholder')}
          </Typography.Text>
        </Flex>
        <Button type='button' variant='outline' size='sm' onClick={() => setOpen(true)}>
          {t('pickOnMap')}
        </Button>
      </Flex>

      {error ? (
        <Typography.Text className='text-destructive text-xs'>{error}</Typography.Text>
      ) : null}

      <LocationMapPickerDialog
        open={open}
        onOpenChange={setOpen}
        title={t('mapDialogTitle')}
        description={t('mapDialogDescription')}
        confirmLabel={t('useThisLocation')}
        cancelLabel={tCommon('cancel')}
        initialCoordinates={initialCoordinates}
        initialAddress={initialAddress}
        onConfirm={(address) => {
          onChange({
            location: formatLocationLabel(address),
            locationLat: address.latitude,
            locationLng: address.longitude
          });
        }}
      />
    </Flex>
  );
}
