import type { GeocodedAddress } from '@/lib/geocoding/types';
import { formatPhoneE164ForApi, normalizePhoneForInput } from '@/lib/phone-utils';
import type { DtoUpdateAddressRequest } from '@/services/-addresses-{id}-put.schemas';
import type { ModelsAddress } from '@/services/-addresses-get.schemas';
import type { DtoCreateAddressRequest } from '@/services/-addresses-post.schemas';

import type { CheckoutFormValues } from '../types/checkout.types';
import type { CheckoutAddressFormApi } from '../types/checkout.types';

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
export function applyAddressToCheckoutForm(form: CheckoutAddressFormApi, address: ModelsAddress) {
  const fields = addressToCheckoutFields(address);
  (Object.keys(fields) as (keyof CheckoutAddressFields)[]).forEach((key) => {
    form.setFieldValue(key, fields[key]);
  });
}

/** Applies geocoded map data to checkout shipping fields (manual entry). */
export function applyGeocodedToCheckoutForm(
  form: CheckoutAddressFormApi,
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
  edits: {
    addressLine1: string;
    addressLine2?: string;
    label?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  }
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
    city: (edits.city ?? address.city ?? '').trim(),
    state: (edits.state ?? address.state ?? '').trim(),
    postal_code: (edits.postal_code ?? address.postal_code ?? '').trim(),
    country: (edits.country ?? address.country ?? '').trim(),
    is_default: address.is_default ?? false,
    instructions: (edits.label ?? address.instructions ?? '').trim()
  };
}

/** Maps geocoded map result into checkout address edit form fields. */
export function geocodedToAddressEditFields(geocoded: GeocodedAddress): {
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
} {
  const line1 = geocoded.street?.trim() || geocoded.displayName.split(',')[0]?.trim() || '';

  return {
    addressLine1: line1,
    city: geocoded.city?.trim() ?? '',
    state: geocoded.state?.trim() ?? '',
    zip: geocoded.zipCode?.trim() ?? '',
    country: geocoded.country?.trim() ?? ''
  };
}

/** Builds POST /addresses payload from a map pick during checkout. Returns null when phone is missing. */
export function buildCheckoutCreateAddressPayload(
  geocoded: GeocodedAddress,
  ctx: {
    recipientName: string;
    phone: string;
    addressLine2?: string;
    label?: string;
  }
): DtoCreateAddressRequest | null {
  const phone = formatPhoneE164ForApi(ctx.phone) ?? normalizePhoneForInput(ctx.phone);
  if (!phone) return null;

  const mapped = geocodedToAddressEditFields(geocoded);

  return {
    address_type: 'shipping',
    is_default: false,
    recipient_name: ctx.recipientName.trim() || 'Customer',
    phone,
    address_line1: mapped.addressLine1,
    address_line2: (ctx.addressLine2 ?? '').trim(),
    city: mapped.city || 'Unknown',
    state: mapped.state || '',
    postal_code: mapped.zip || '00000',
    country: mapped.country || 'United States',
    instructions: (ctx.label ?? 'Delivery location').trim() || 'Delivery location'
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
