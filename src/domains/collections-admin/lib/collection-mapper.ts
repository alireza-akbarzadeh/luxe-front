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
import type {
  DtoCollectionProductOverrideInput,
  DtoCollectionResponse,
  DtoCollectionRuleCondition,
  DtoCollectionRules
} from '@/services/-collections-get.schemas';
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

function parseOptionalNumber(value: string | null | undefined): number | undefined {
  if (!value?.trim() || value === COLLECTION_CATEGORY_NONE) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function buildCollectionRules(values: CollectionFormValues): DtoCollectionRules | undefined {
  const conditions: DtoCollectionRuleCondition[] = [];

  const categoryId = parseCategoryId(values.rule_category_id);
  const brandId = parseCategoryId(values.rule_brand_id);

  if (categoryId) {
    conditions.push({ field: 'category_id', operator: 'eq', value: categoryId });
  }
  if (brandId) {
    conditions.push({ field: 'brand_id', operator: 'eq', value: brandId });
  }
  if (values.rule_search?.trim()) {
    conditions.push({ field: 'search', operator: 'contains', value: values.rule_search.trim() });
  }
  if (values.rule_min_price > 0) {
    conditions.push({ field: 'min_price', operator: 'gte', value: values.rule_min_price });
  }
  if (values.rule_max_price > 0) {
    conditions.push({ field: 'max_price', operator: 'lte', value: values.rule_max_price });
  }
  if (values.rule_min_rating > 0) {
    conditions.push({ field: 'min_rating', operator: 'gte', value: values.rule_min_rating });
  }
  if (values.rule_is_new) {
    conditions.push({ field: 'is_new', operator: 'eq', value: true });
  }
  if (values.rule_in_stock) {
    conditions.push({ field: 'in_stock', operator: 'eq', value: true });
  }
  if (values.rule_on_sale) {
    conditions.push({ field: 'on_sale', operator: 'eq', value: true });
  }
  if (values.sort_key?.trim()) {
    conditions.push({ field: 'sort', operator: 'eq', value: values.sort_key });
  }

  if (conditions.length === 0) return undefined;
  return {
    operator: values.rule_operator,
    conditions
  };
}

export function mapFormToCreateCollectionRequest(
  values: CollectionFormValues,
  productOverrides: DtoCollectionProductOverrideInput[] = []
): DtoCreateCollectionRequest {
  const productIds =
    values.mode === 'manual' || values.mode === 'hybrid'
      ? parseProductIds(values.product_ids)
      : undefined;
  const rules = buildCollectionRules(values);
  const previewCategoryId = parseCategoryId(values.rule_category_id);
  const previewIsNew = values.rule_is_new || undefined;
  const previewSort = mapPreviewSort(values.sort_key);

  return {
    slug: values.slug.trim(),
    eyebrow: optionalText(values.eyebrow),
    title: values.title.trim(),
    subtitle: optionalText(values.subtitle),
    description: optionalText(values.description),
    href: `/collections/${values.slug.trim()}`,
    image_url: optionalText(values.image_url) || optionalText(values.desktop_image_url),
    cta_label: optionalText(values.cta_label) ?? 'Shop collection',
    sort_order: values.sort_order,
    theme: optionalText(values.theme),
    status: values.status,
    collection_type: values.mode === 'manual' ? 'manual' : 'smart',
    mode: values.mode,
    starts_at: mapScheduleField(values.starts_at),
    ends_at: mapScheduleField(values.ends_at),
    product_ids: productIds,
    product_overrides: productOverrides,
    preview_sort: previewSort,
    preview_is_new: previewIsNew,
    preview_category_id: previewCategoryId,
    sort_key: values.sort_key,
    rules,
    seo_title: optionalText(values.seo_title),
    seo_description: optionalText(values.seo_description),
    meta_keywords: optionalText(values.meta_keywords),
    og_title: optionalText(values.og_title),
    og_description: optionalText(values.og_description),
    og_image_url: optionalText(values.og_image_url),
    twitter_title: optionalText(values.twitter_title),
    twitter_description: optionalText(values.twitter_description),
    twitter_image_url: optionalText(values.twitter_image_url),
    canonical_url: optionalText(values.canonical_url),
    robots_directives: optionalText(values.robots_directives),
    is_indexable: values.is_indexable,
    hero_title: optionalText(values.hero_title),
    hero_description: optionalText(values.hero_description),
    desktop_image_url: optionalText(values.desktop_image_url),
    tablet_image_url: optionalText(values.tablet_image_url),
    mobile_image_url: optionalText(values.mobile_image_url),
    overlay_opacity: values.overlay_opacity,
    theme_variant: optionalText(values.theme_variant)
  };
}

export function mapFormToUpdateCollectionRequest(
  values: CollectionFormValues,
  productOverrides: DtoCollectionProductOverrideInput[] = []
): DtoUpdateCollectionRequest {
  const productIds =
    values.mode === 'manual' || values.mode === 'hybrid' ? parseProductIds(values.product_ids) : [];
  const rules = buildCollectionRules(values);
  const previewCategoryId = parseCategoryId(values.rule_category_id);
  const previewIsNew = values.rule_is_new || undefined;

  return {
    slug: values.slug.trim(),
    eyebrow: optionalText(values.eyebrow),
    title: values.title.trim(),
    subtitle: optionalText(values.subtitle),
    description: optionalText(values.description),
    href: `/collections/${values.slug.trim()}`,
    image_url: optionalText(values.image_url) || optionalText(values.desktop_image_url),
    cta_label: optionalText(values.cta_label) ?? 'Shop collection',
    sort_order: values.sort_order,
    theme: optionalText(values.theme),
    collection_type: values.mode === 'manual' ? 'manual' : 'smart',
    mode: values.mode,
    starts_at: mapScheduleField(values.starts_at) ?? '',
    ends_at: mapScheduleField(values.ends_at) ?? '',
    product_ids: productIds,
    product_overrides: productOverrides,
    preview_sort: mapPreviewSort(values.sort_key),
    preview_is_new: previewIsNew,
    preview_category_id: previewCategoryId,
    sort_key: values.sort_key,
    rules,
    seo_title: optionalText(values.seo_title),
    seo_description: optionalText(values.seo_description),
    meta_keywords: optionalText(values.meta_keywords),
    og_title: optionalText(values.og_title),
    og_description: optionalText(values.og_description),
    og_image_url: optionalText(values.og_image_url),
    twitter_title: optionalText(values.twitter_title),
    twitter_description: optionalText(values.twitter_description),
    twitter_image_url: optionalText(values.twitter_image_url),
    canonical_url: optionalText(values.canonical_url),
    robots_directives: optionalText(values.robots_directives),
    is_indexable: values.is_indexable,
    hero_title: optionalText(values.hero_title),
    hero_description: optionalText(values.hero_description),
    desktop_image_url: optionalText(values.desktop_image_url),
    tablet_image_url: optionalText(values.tablet_image_url),
    mobile_image_url: optionalText(values.mobile_image_url),
    overlay_opacity: values.overlay_opacity,
    theme_variant: optionalText(values.theme_variant)
  };
}

export function mapCollectionToFormValues(collection: DtoCollectionResponse): CollectionFormValues {
  const status = collection.status;
  const validStatus =
    status === 'draft' || status === 'active' || status === 'inactive' || status === 'archived'
      ? status
      : 'draft';

  const mode =
    collection.mode === 'manual' || collection.mode === 'dynamic' || collection.mode === 'hybrid'
      ? collection.mode
      : collection.collection_type === 'manual'
        ? 'manual'
        : 'dynamic';

  const conditions = collection.rules?.conditions ?? [];
  const readCondition = (field: string) => conditions.find((item) => item.field === field)?.value;
  const ruleCategoryId = parseOptionalNumber(String(readCondition('category_id') ?? ''));
  const ruleBrandId = parseOptionalNumber(String(readCondition('brand_id') ?? ''));

  return {
    eyebrow: collection.eyebrow ?? '',
    title: collection.title ?? '',
    subtitle: collection.subtitle ?? '',
    slug: collection.slug ?? '',
    description: collection.description ?? '',
    href: collection.href ?? '',
    image_url: collection.image_url ?? '',
    cta_label: collection.cta_label ?? 'Shop collection',
    sort_order: collection.sort_order ?? 0,
    theme: collection.theme ?? '',
    status: validStatus,
    mode,
    starts_at: fromScheduleISO(collection.starts_at),
    ends_at: fromScheduleISO(collection.ends_at),
    product_ids: (collection.product_ids ?? []).map(String),
    sort_key: (collection.sort_key as CollectionFormValues['sort_key']) ?? 'newest',
    rule_operator: collection.rules?.operator === 'and' ? 'and' : 'and',
    rule_category_id: ruleCategoryId ? String(ruleCategoryId) : COLLECTION_CATEGORY_NONE,
    rule_brand_id: ruleBrandId ? String(ruleBrandId) : COLLECTION_CATEGORY_NONE,
    rule_search: String(readCondition('search') ?? ''),
    rule_min_price: Number(readCondition('min_price') ?? 0),
    rule_max_price: Number(readCondition('max_price') ?? 0),
    rule_min_rating: Number(readCondition('min_rating') ?? 0),
    rule_is_new: Boolean(readCondition('is_new') ?? collection.preview_is_new ?? false),
    rule_in_stock: Boolean(readCondition('in_stock') ?? true),
    rule_on_sale: Boolean(readCondition('on_sale') ?? false),
    seo_title: collection.seo_title ?? '',
    seo_description: collection.seo_description ?? '',
    meta_keywords: collection.meta_keywords ?? '',
    og_title: collection.og_title ?? '',
    og_description: collection.og_description ?? '',
    og_image_url: collection.og_image_url ?? '',
    twitter_title: collection.twitter_title ?? '',
    twitter_description: collection.twitter_description ?? '',
    twitter_image_url: collection.twitter_image_url ?? '',
    canonical_url: collection.canonical_url ?? '',
    robots_directives: collection.robots_directives ?? '',
    is_indexable: collection.is_indexable ?? true,
    hero_title: collection.hero_title ?? '',
    hero_description: collection.hero_description ?? '',
    desktop_image_url: collection.desktop_image_url ?? '',
    tablet_image_url: collection.tablet_image_url ?? '',
    mobile_image_url: collection.mobile_image_url ?? '',
    overlay_opacity: collection.overlay_opacity ?? 0.25,
    theme_variant: collection.theme_variant ?? ''
  };
}
