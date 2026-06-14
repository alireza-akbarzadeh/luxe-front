export interface GeocodedAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
  displayName: string;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface NominatimAddressDetails {
  house_number?: string;
  road?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export interface NominatimSearchResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: NominatimAddressDetails;
}
