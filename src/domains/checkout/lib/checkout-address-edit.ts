import type { GeocodedAddress } from '@/lib/geocoding/types';
import type { DtoUpdateAddressRequest } from '@/services/-addresses-{id}-put.schemas';
import type { ModelsAddress } from '@/services/-addresses-get.schemas';

import type { CheckoutAddressEditValues } from '../schemas/checkout-address-edit.schema';
import { addressToCheckoutFields } from './checkout-address';

/** Maps quick-edit form values to a map-picker seed (no coordinates). */
export function editValuesToMapSeed(values: CheckoutAddressEditValues): GeocodedAddress {
  const displayName = [
    values.addressLine1,
    values.addressLine2,
    values.city,
    values.state,
    values.zip,
    values.country
  ]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(', ');

  return {
    street: values.addressLine1,
    city: values.city,
    state: values.state,
    zipCode: values.zip,
    country: values.country,
    latitude: 0,
    longitude: 0,
    displayName
  };
}

/** Maps a saved address row into the address edit dialog form. */
export function addressToEditFormValues(address: ModelsAddress): CheckoutAddressEditValues {
  const fields = addressToCheckoutFields(address);

  return {
    label: address.instructions ?? '',
    addressLine1: fields.addressLine1,
    addressLine2: fields.addressLine2 ?? '',
    city: fields.city,
    state: fields.state,
    zip: fields.zip,
    country: fields.country
  };
}

/** Merges PUT payload into the saved row when the API omits the full address body. */
export function mergeAddressAfterUpdate(
  address: ModelsAddress,
  payload: DtoUpdateAddressRequest,
  responseAddress?: ModelsAddress | null
): ModelsAddress {
  if (responseAddress) return responseAddress;

  return {
    ...address,
    address_line1: payload.address_line1,
    address_line2: payload.address_line2,
    city: payload.city,
    state: payload.state,
    postal_code: payload.postal_code,
    country: payload.country,
    instructions: payload.instructions
  };
}
