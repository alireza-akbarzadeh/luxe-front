import type { GeocodedAddress } from '@/lib/geocoding/types';
import type { DtoDefaultAddressDTO } from '@/services/-account-summary-get.schemas';

/** Builds a map-picker seed from the user's saved default shipping address (no coordinates). */
export function defaultShippingAddressToGeocodedSeed(
  address: DtoDefaultAddressDTO | undefined | null
): GeocodedAddress | null {
  if (!address?.address_line1?.trim()) return null;

  const displayName = [
    address.address_line1,
    address.address_line2,
    address.city,
    address.state,
    address.postal_code,
    address.country
  ]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(', ');

  if (displayName.length < 3) return null;

  return {
    street: address.address_line1 ?? '',
    city: address.city ?? '',
    state: address.state ?? '',
    zipCode: address.postal_code ?? '',
    country: address.country ?? '',
    latitude: 0,
    longitude: 0,
    displayName
  };
}

export function deliveryLocationLabel(location: GeocodedAddress | null): string | null {
  if (!location) return null;
  const city = location.city?.trim();
  if (city) return city;
  const short = location.displayName.split(',')[0]?.trim();
  return short || null;
}
