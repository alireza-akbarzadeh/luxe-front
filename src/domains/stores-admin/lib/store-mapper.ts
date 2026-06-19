import type { StoreFormValues } from '@/domains/stores-admin/store.schema';
import type { DtoCreateStoreRequest } from '@/services/-stores-post.schemas';
import type { DtoUpdateStoreRequest } from '@/services/-stores-{id}-put.schemas';
import type { DtoStoreResponse } from '@/services/-stores-get.schemas';

function optionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function parseCategoryIds(ids: string[] | undefined): number[] | undefined {
  if (!ids?.length) return undefined;
  const parsed = ids.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0);
  return parsed.length > 0 ? parsed : undefined;
}

export function mapFormToCreateStoreRequest(values: StoreFormValues): DtoCreateStoreRequest {
  return {
    name: values.name.trim(),
    description: optionalText(values.description),
    logo_url: optionalText(values.logo_url),
    banner_url: optionalText(values.banner_url),
    location: optionalText(values.location),
    shipping_info: optionalText(values.shipping_info),
    return_policy: optionalText(values.return_policy),
    category_ids: parseCategoryIds(values.category_ids)
  };
}

export function mapFormToUpdateStoreRequest(values: StoreFormValues): DtoUpdateStoreRequest {
  const categoryIds = parseCategoryIds(values.category_ids);
  return {
    name: values.name.trim(),
    description: optionalText(values.description),
    logo_url: optionalText(values.logo_url),
    banner_url: optionalText(values.banner_url),
    location: optionalText(values.location),
    shipping_info: optionalText(values.shipping_info),
    return_policy: optionalText(values.return_policy),
    is_verified: values.is_verified,
    category_ids: categoryIds
  };
}

export function mapStoreToFormValues(store: DtoStoreResponse): StoreFormValues {
  return {
    name: store.name ?? '',
    description: store.description ?? '',
    logo_url: store.logo_url ?? '',
    banner_url: store.banner_url ?? '',
    location: store.location ?? '',
    shipping_info: store.shipping_info ?? '',
    return_policy: store.return_policy ?? '',
    category_ids: (store.categories ?? [])
      .map((category) => (category.id ? String(category.id) : ''))
      .filter(Boolean),
    is_verified: store.is_verified ?? false
  };
}
