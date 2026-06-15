import type { GeocodedAddress, GeoCoordinates } from '@/lib/geocoding/types';
import { normalizePhoneForInput } from '@/lib/phone-utils';
import type { ModelsAddress } from '~/src/services/-addresses-get.schemas';

import type { AddressFormValues } from './account.schema';

export const EMPTY_ADDRESS_FORM_VALUES: AddressFormValues = {
  label: '',
  firstName: '',
  lastName: '',
  street: '',
  apartment: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States',
  phone: '',
  isDefault: false,
  address_type: 'both'
};

export function addressToFormValues(address: ModelsAddress): AddressFormValues {
  const nameParts = (address.recipient_name || '').trim().split(/\s+/);
  const firstName = nameParts[0] ?? '';
  const lastName = nameParts.slice(1).join(' ');

  const addressType = address.address_type;
  const normalizedType: AddressFormValues['address_type'] =
    addressType === 'billing' || addressType === 'shipping' || addressType === 'both'
      ? addressType
      : 'both';

  return {
    label: address.instructions ?? '',
    firstName,
    lastName,
    street: address.address_line1 ?? '',
    apartment: address.address_line2 ?? '',
    city: address.city ?? '',
    state: address.state ?? '',
    zipCode: address.postal_code ?? '',
    country: address.country ?? 'United States',
    phone: normalizePhoneForInput(address.phone) ?? address.phone ?? '',
    isDefault: address.is_default ?? false,
    address_type: normalizedType
  };
}

export function formatAddressSearchQuery(
  values: Pick<AddressFormValues, 'street' | 'apartment' | 'city' | 'state' | 'zipCode' | 'country'>
): string {
  return [
    values.street,
    values.apartment,
    values.city,
    values.state,
    values.zipCode,
    values.country
  ]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(', ');
}

export function formValuesToGeocodedSeed(
  values: AddressFormValues,
  coordinates?: GeoCoordinates | null
): GeocodedAddress {
  return {
    street: values.street,
    city: values.city,
    state: values.state,
    zipCode: values.zipCode,
    country: values.country,
    latitude: coordinates?.latitude ?? 0,
    longitude: coordinates?.longitude ?? 0,
    displayName: formatAddressSearchQuery(values)
  };
}

export function mergeGeocodedAddress(
  current: AddressFormValues,
  geocoded: GeocodedAddress
): Pick<AddressFormValues, 'street' | 'city' | 'state' | 'zipCode' | 'country'> {
  return {
    street: geocoded.street || current.street,
    city: geocoded.city || current.city,
    state: geocoded.state || current.state,
    zipCode: geocoded.zipCode || current.zipCode,
    country: geocoded.country || current.country
  };
}
