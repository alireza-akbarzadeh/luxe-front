import type { GeocodedAddress } from '@/lib/geocoding/types';
import { normalizePhoneForInput } from '@/lib/phone-utils';
import type { DtoDefaultAddressDTO } from '@/services/-account-summary-get.schemas';
import { putAddressesId } from '@/services/-addresses-{id}-put';
import type { DtoUpdateAddressRequest } from '@/services/-addresses-{id}-put.schemas';
import { postAddresses } from '@/services/-addresses-post';
import type { DtoCreateAddressRequest } from '@/services/-addresses-post.schemas';

export interface SaveGeocodedShippingContext {
  recipientName: string;
  phone: string;
  existingDefaultShipping?: DtoDefaultAddressDTO | null;
  instructions?: string;
}

function resolvePhone(phone: string | undefined | null): string | null {
  const normalized = normalizePhoneForInput(phone ?? undefined);
  return normalized ?? null;
}

function buildAddressFields(address: GeocodedAddress, instructions: string) {
  const line1 =
    address.street?.trim() || address.displayName.split(',')[0]?.trim() || 'Delivery location';

  return {
    address_line1: line1,
    address_line2: '',
    city: address.city?.trim() || 'Unknown',
    state: address.state?.trim() || '',
    postal_code: address.zipCode?.trim() || '00000',
    country: address.country?.trim() || 'United States',
    instructions: instructions.trim() || 'Delivery location'
  };
}

/** Persists a map-picked location as the user's default shipping address. */
export async function saveGeocodedShippingAddress(
  address: GeocodedAddress,
  ctx: SaveGeocodedShippingContext
) {
  const phone = resolvePhone(ctx.phone);
  if (!phone) {
    throw new Error('A valid phone number is required to save your delivery address.');
  }

  const recipientName = ctx.recipientName.trim() || 'Customer';
  const fields = buildAddressFields(address, ctx.instructions ?? 'Delivery location');
  const existingId = ctx.existingDefaultShipping?.id;

  if (existingId) {
    const payload: DtoUpdateAddressRequest = {
      address_type: 'shipping',
      is_default: true,
      recipient_name: recipientName,
      phone,
      ...fields
    };

    return putAddressesId(existingId, payload);
  }

  const payload: DtoCreateAddressRequest = {
    address_type: 'shipping',
    is_default: true,
    recipient_name: recipientName,
    phone,
    ...fields
  };

  return postAddresses(payload);
}
