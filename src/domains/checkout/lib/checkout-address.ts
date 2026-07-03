import { normalizePhoneForInput } from '@/lib/phone-utils';
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
