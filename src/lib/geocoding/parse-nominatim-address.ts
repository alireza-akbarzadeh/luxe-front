import type { GeocodedAddress, NominatimSearchResult } from './types';

/**
 * Maps a Nominatim reverse/search payload into address form fields.
 */
export function parseNominatimResult(result: NominatimSearchResult): GeocodedAddress {
  const address = result.address ?? {};
  const streetParts = [address.house_number, address.road].filter(Boolean);
  const city =
    address.city ?? address.town ?? address.village ?? address.municipality ?? address.county ?? '';

  return {
    street: streetParts.join(' ').trim() || result.display_name.split(',')[0]?.trim() || '',
    city,
    state: address.state ?? '',
    zipCode: address.postcode ?? '',
    country: address.country ?? '',
    latitude: Number.parseFloat(result.lat),
    longitude: Number.parseFloat(result.lon),
    displayName: result.display_name
  };
}
