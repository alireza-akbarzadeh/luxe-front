import type { CollectionFormValues } from '@/domains/collections-admin/collection.schema';
import {
  COLLECTION_CATEGORY_NONE,
  COLLECTION_PREVIEW_SORT_NONE
} from '@/domains/collections-admin/collection.schema';
import {
  fromScheduleISO,
  parseProductIds,
  toScheduleISO
} from '@/domains/collections-admin/lib/collection-schedule';
import type { DtoUpdateCollectionRequest } from '@/services/-collections-{id}-put.schemas';
import type { DtoCollectionResponse } from '@/services/-collections-get.schemas';
import type { DtoCreateCollectionRequest } from '@/services/-collections-post.schemas';

function optionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function parseCategoryId(value: string | null | undefined): number | undefined {
  if (!value?.trim() || value === COLLECTION_CATEGORY_NONE) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function mapPreviewSort(value: string | undefined): string | undefined {
  if (!value?.trim() || value === COLLECTION_PREVIEW_SORT_NONE) return undefined;
  return value;
}

function mapScheduleField(value: string | undefined): string | undefined {
  return toScheduleISO(value);
}

export function mapFormToCreateCollectionRequest(
  values: CollectionFormValues
): DtoCreateCollectionRequest {
  const productIds =
    values.collection_type === 'manual' ? parseProductIds(values.product_ids) : undefined;

  return {
    slug: values.slug.trim(),
    eyebrow: optionalText(values.eyebrow),
    title: values.title.trim(),
    description: optionalText(values.description),
    href: optionalText(values.href) ?? '/shop',
    image_url: optionalText(values.image_url),
    cta_label: optionalText(values.cta_label) ?? 'Shop collection',
    sort_order: values.sort_order,
    theme: optionalText(values.theme),
    status: values.status,
    collection_type: values.collection_type,
    starts_at: mapScheduleField(values.starts_at),
    ends_at: mapScheduleField(values.ends_at),
    product_ids: productIds,
    preview_sort: mapPreviewSort(values.preview_sort),
    preview_is_new: values.preview_is_new || undefined,
    preview_category_id: parseCategoryId(values.preview_category_id)
  };
}

export function mapFormToUpdateCollectionRequest(
  values: CollectionFormValues
): DtoUpdateCollectionRequest {
  const productIds = values.collection_type === 'manual' ? parseProductIds(values.product_ids) : [];

  return {
    slug: values.slug.trim(),
    eyebrow: optionalText(values.eyebrow),
    title: values.title.trim(),
    description: optionalText(values.description),
    href: optionalText(values.href) ?? '/shop',
    image_url: optionalText(values.image_url),
    cta_label: optionalText(values.cta_label) ?? 'Shop collection',
    sort_order: values.sort_order,
    theme: optionalText(values.theme),
    collection_type: values.collection_type,
    starts_at: mapScheduleField(values.starts_at) ?? '',
    ends_at: mapScheduleField(values.ends_at) ?? '',
    product_ids: productIds,
    preview_sort: mapPreviewSort(values.preview_sort),
    preview_is_new: values.preview_is_new,
    preview_category_id: parseCategoryId(values.preview_category_id)
  };
}

export function mapCollectionToFormValues(collection: DtoCollectionResponse): CollectionFormValues {
  const status = collection.status;
  const validStatus =
    status === 'draft' || status === 'active' || status === 'inactive' || status === 'archived'
      ? status
      : 'draft';

  const collectionType =
    collection.collection_type === 'manual' || collection.collection_type === 'smart'
      ? collection.collection_type
      : 'smart';

  return {
    eyebrow: collection.eyebrow ?? '',
    title: collection.title ?? '',
    slug: collection.slug ?? '',
    description: collection.description ?? '',
    href: collection.href ?? '/shop',
    image_url: collection.image_url ?? '',
    cta_label: collection.cta_label ?? 'Shop collection',
    sort_order: collection.sort_order ?? 0,
    theme: collection.theme ?? '',
    status: validStatus,
    collection_type: collectionType,
    starts_at: fromScheduleISO(collection.starts_at),
    ends_at: fromScheduleISO(collection.ends_at),
    product_ids: (collection.product_ids ?? []).map(String),
    preview_sort: collection.preview_sort ? collection.preview_sort : COLLECTION_PREVIEW_SORT_NONE,
    preview_is_new: collection.preview_is_new ?? false,
    preview_category_id: collection.preview_category_id
      ? String(collection.preview_category_id)
      : COLLECTION_CATEGORY_NONE
  };
}
