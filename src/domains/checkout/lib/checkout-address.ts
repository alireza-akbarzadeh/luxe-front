import type { GeocodedAddress } from '@/lib/geocoding/types';
import { normalizePhoneForInput } from '@/lib/phone-utils';
import type { DtoUpdateAddressRequest } from '@/services/-addresses-{id}-put.schemas';
import type { ModelsAddress } from '@/services/-addresses-get.schemas';

import type { CheckoutFormValues } from '../checkout.schema';

type CheckoutAddressFields = Pick<
  CheckoutFormValues,
  | 'firstName'
  | 'lastName'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'state'
  | 'zip'
  | 'country'
  | 'phone'
  | 'shippingAddressId'
>;

/** Saved addresses usable for checkout shipping (excludes billing-only). */
export function isCheckoutShippingAddress(address: ModelsAddress): boolean {
  const type = address.address_type;
  return type === 'shipping' || type === 'both' || !type;
}

/** Maps a saved address row into checkout shipping form fields. */
export function addressToCheckoutFields(address: ModelsAddress): CheckoutAddressFields {
  const nameParts = (address.recipient_name || '').trim().split(/\s+/);

  return {
    firstName: nameParts[0] ?? '',
    lastName: nameParts.slice(1).join(' '),
    addressLine1: address.address_line1 ?? '',
    addressLine2: address.address_line2 ?? '',
    city: address.city ?? '',
    state: address.state ?? '',
    zip: address.postal_code ?? '',
    country: address.country ?? 'United States',
    phone: normalizePhoneForInput(address.phone) ?? address.phone ?? '',
    shippingAddressId: address.id ?? null
  };
}

/** Applies a saved address to the checkout form in one update. */
export function applyAddressToCheckoutForm(
  form: { setFieldValue: (name: string, value: unknown) => void },
  address: ModelsAddress
) {
  const fields = addressToCheckoutFields(address);
  (Object.keys(fields) as (keyof CheckoutAddressFields)[]).forEach((key) => {
    form.setFieldValue(key, fields[key]);
  });
}

/** Applies geocoded map data to checkout shipping fields (manual entry). */
export function applyGeocodedToCheckoutForm(
  form: { setFieldValue: (name: string, value: unknown) => void },
  geocoded: GeocodedAddress
) {
  const line1 = geocoded.street?.trim() || geocoded.displayName.split(',')[0]?.trim() || '';

  form.setFieldValue('shippingAddressId', null);
  if (line1) form.setFieldValue('addressLine1', line1);
  if (geocoded.city) form.setFieldValue('city', geocoded.city);
  if (geocoded.state) form.setFieldValue('state', geocoded.state);
  if (geocoded.zipCode) form.setFieldValue('zip', geocoded.zipCode);
  if (geocoded.country) form.setFieldValue('country', geocoded.country);
}

/** Builds a PUT payload by merging quick-edit fields into an existing saved row. */
export function buildAddressUpdatePayload(
  address: ModelsAddress,
  edits: { addressLine1: string; addressLine2?: string; label?: string }
): DtoUpdateAddressRequest {
  const addressType = address.address_type;
  const normalizedType =
    addressType === 'billing' || addressType === 'shipping' || addressType === 'both'
      ? addressType
      : 'shipping';

  return {
    address_type: normalizedType,
    recipient_name: address.recipient_name ?? '',
    phone: address.phone ?? '',
    address_line1: edits.addressLine1.trim(),
    address_line2: (edits.addressLine2 ?? address.address_line2 ?? '').trim(),
    city: address.city ?? '',
    state: address.state ?? '',
    postal_code: address.postal_code ?? '',
    country: address.country ?? '',
    is_default: address.is_default ?? false,
    instructions: (edits.label ?? address.instructions ?? '').trim()
  };
}

/** Compact label for address picker cards. */
export function formatCheckoutAddressLabel(address: ModelsAddress): {
  title: string;
  subtitle: string;
} {
  const title = address.instructions?.trim() || address.address_line1 || 'Address';
  const subtitle = [
    address.recipient_name,
    [address.address_line1, address.city, address.state, address.postal_code]
      .filter(Boolean)
      .join(', ')
  ]
    .filter(Boolean)
    .join(' · ');

  return { title, subtitle };
}
