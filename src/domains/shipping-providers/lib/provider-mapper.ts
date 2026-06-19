import type { ShippingProviderFormValues } from '@/domains/shipping-providers/shipping-provider.schema';
import type { DtoCreateShippingProviderRequest } from '@/services/-shipping-providers-post.schemas';
import type { DtoUpdateShippingProviderRequest } from '@/services/-shipping-providers-{id}-put.schemas';
import type { ModelsShippingProviders } from '@/services/-shipping-providers-get.schemas';

function optionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function mapFormToCreateProviderRequest(
  values: ShippingProviderFormValues
): DtoCreateShippingProviderRequest {
  return {
    name: values.name.trim(),
    description: optionalText(values.description),
    price: values.price,
    is_active: values.is_active
  };
}

export function mapFormToUpdateProviderRequest(
  values: ShippingProviderFormValues
): DtoUpdateShippingProviderRequest {
  return {
    name: values.name.trim(),
    description: optionalText(values.description),
    price: values.price,
    is_active: values.is_active
  };
}

export function mapProviderToFormValues(
  provider: ModelsShippingProviders
): ShippingProviderFormValues {
  return {
    name: provider.name ?? '',
    description: provider.description ?? '',
    price: provider.price ?? 0,
    is_active: provider.is_active ?? true
  };
}
