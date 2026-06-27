import { parseNominatimResult } from './parse-nominatim-address';
import type { GeocodedAddress, GeoCoordinates, NominatimSearchResult } from './types';

async function fetchGeocoding<T>(params: URLSearchParams): Promise<T> {
  const response = await fetch(`/api/geocoding?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Unable to look up this location. Please try again.');
  }

  return response.json() as Promise<T>;
}

function assertNominatimResult(result: NominatimSearchResult): void {
  if (result.error) {
    throw new Error('Unable to look up this location. Please try again.');
  }

  if (!result.lat || !result.lon || !result.display_name) {
    throw new Error('No address found for this point. Drag the pin or search for a place.');
  }
}

/** Builds a minimal address when reverse geocoding is unavailable. */
export function coordinatesToFallbackAddress(coords: GeoCoordinates): GeocodedAddress {
  const label = `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;

  return {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    latitude: coords.latitude,
    longitude: coords.longitude,
    displayName: label
  };
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
  assertNominatimResult(result);
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
  return results
    .filter((item) => item.lat && item.lon && item.display_name)
    .map(parseNominatimResult);
}

function mapGeolocationError(error: GeolocationPositionError | null): string {
  switch (error?.code) {
    case 1:
      return 'Location permission was denied. Allow location access in your browser settings.';
    case 2:
      return 'Your device could not determine a location. Try again or pick a point on the map.';
    case 3:
      return 'Finding your location took too long. Try again or pick a point on the map.';
    default:
      return 'Unable to access your current location.';
  }
}

function readCurrentPosition(options: PositionOptions): Promise<GeoCoordinates> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => reject(error),
      options
    );
  });
}

/**
 * Reads the browser geolocation API. Retries with lower accuracy when high accuracy times out.
 */
export async function getCurrentCoordinates(): Promise<GeoCoordinates> {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported on this device.');
  }

  const attempts: PositionOptions[] = [
    { enableHighAccuracy: false, timeout: 12_000, maximumAge: 300_000 },
    { enableHighAccuracy: true, timeout: 20_000, maximumAge: 60_000 }
  ];

  let lastError: GeolocationPositionError | null = null;

  for (const options of attempts) {
    try {
      return await readCurrentPosition(options);
    } catch (error) {
      lastError = error as GeolocationPositionError;
      if (lastError.code === 1) {
        break;
      }
    }
  }

  throw new Error(mapGeolocationError(lastError));
}
