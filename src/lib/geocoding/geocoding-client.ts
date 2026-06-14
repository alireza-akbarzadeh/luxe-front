import { parseNominatimResult } from './parse-nominatim-address';
import type { GeocodedAddress, GeoCoordinates, NominatimSearchResult } from './types';

async function fetchGeocoding<T>(params: URLSearchParams): Promise<T> {
  const response = await fetch(`/api/geocoding?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Unable to look up this location. Please try again.');
  }

  return response.json() as Promise<T>;
}

/**
 * Reverse geocode coordinates into structured address fields via our Nominatim proxy.
 */
export async function reverseGeocode(coords: GeoCoordinates): Promise<GeocodedAddress> {
  const params = new URLSearchParams({
    mode: 'reverse',
    lat: String(coords.latitude),
    lon: String(coords.longitude)
  });

  const result = await fetchGeocoding<NominatimSearchResult>(params);
  return parseNominatimResult(result);
}

/**
 * Search for a place by free-text query (address, city, landmark, etc.).
 */
export async function searchAddress(query: string): Promise<GeocodedAddress[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];

  const params = new URLSearchParams({
    mode: 'search',
    q: trimmed
  });

  const results = await fetchGeocoding<NominatimSearchResult[]>(params);
  return results.map(parseNominatimResult);
}

/**
 * Reads the browser geolocation API and reverse geocodes the result.
 */
export function getCurrentCoordinates(): Promise<GeoCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported on this device.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      () => {
        reject(new Error('Unable to access your current location.'));
      },
      { enableHighAccuracy: true, timeout: 10_000 }
    );
  });
}
