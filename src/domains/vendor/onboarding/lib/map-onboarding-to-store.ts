import type { VendorCreateStorePayload } from '@/lib/api/vendor-stores';

import type { VendorOnboardingValues } from '../schemas/vendor-onboarding.schema';

export function mapOnboardingToStorePayload(
  values: VendorOnboardingValues
): VendorCreateStorePayload {
  return {
    name: values.storeName,
    description: values.storeDescription,
    logo_url: values.logoUrl || undefined,
    location: values.location,
    shipping_info: values.shippingInfo,
    return_policy: values.returnPolicy,
    business_legal_name: values.businessLegalName,
    business_type: values.businessType,
    country: values.country,
    website: values.website || undefined,
    tax_id: values.taxId || undefined,
    fulfillment_model: values.fulfillmentModel,
    category_ids: values.categoryIds
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id) && id > 0),
    latitude: values.locationLat,
    longitude: values.locationLng
  };
}
