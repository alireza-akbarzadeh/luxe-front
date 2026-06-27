import type { GeocodedAddress, NominatimSearchResult } from './types';

/**
 * Maps a Nominatim reverse/search payload into address form fields.
 */
export function parseNominatimResult(result: NominatimSearchResult): GeocodedAddress {
  const displayName = result.display_name ?? '';
  const address = result.address ?? {};
  const streetParts = [address.house_number, address.road].filter(Boolean);
  const city =
    address.city ?? address.town ?? address.village ?? address.municipality ?? address.county ?? '';

  return {
    street: streetParts.join(' ').trim() || displayName.split(',')[0]?.trim() || '',
    city,
    state: address.state ?? '',
    zipCode: address.postcode ?? '',
    country: address.country ?? '',
    latitude: Number.parseFloat(result.lat ?? '0'),
    longitude: Number.parseFloat(result.lon ?? '0'),
    displayName
  };
}
