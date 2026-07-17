import type {
  CollectionFormValues,
  CollectionRulesForm
} from '@/domains/collections-admin/collection.schema';
import {
  emptyCollectionRules,
  emptyRuleCondition
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

function mapScheduleField(value: string | undefined, endOfDay = false): string | undefined {
  return toScheduleISO(value, endOfDay);
}

function coerceConditionValue(field: string, value: unknown): string | number | boolean | number[] {
  if (field === 'is_new' || field === 'in_stock' || field === 'on_sale') {
    return Boolean(value);
  }
  if (
    field === 'category_id' ||
    field === 'brand_id' ||
    field === 'min_price' ||
    field === 'max_price' ||
    field === 'min_rating'
  ) {
    return Number(value) || 0;
  }
  if (Array.isArray(value)) {
    return value.map((item) => Number(item)).filter((item) => Number.isFinite(item));
  }
  return String(value ?? '');
}

/** Maps form rules tree to API DtoCollectionRules. */
export function mapFormRulesToDto(rules: CollectionRulesForm): DtoCollectionRules | undefined {
  const conditions: DtoCollectionRuleCondition[] = rules.conditions.map((condition) => ({
    field: condition.field,
    operator: condition.operator,
    value: condition.value
  }));
  const groups = rules.groups
    .filter((group) => group.conditions.length > 0)
    .map((group) => ({
      operator: group.operator,
      conditions: group.conditions.map((condition) => ({
        field: condition.field,
        operator: condition.operator,
        value: condition.value
      }))
    }));

  if (conditions.length === 0 && groups.length === 0) return undefined;
  return {
    operator: rules.operator,
    conditions,
    groups: groups.length > 0 ? groups : undefined
  };
}

function mapDtoRulesToForm(rules: DtoCollectionRules | undefined): CollectionRulesForm {
  if (!rules) return emptyCollectionRules();

  const conditions = (rules.conditions ?? [])
    .filter((item) => item.field && item.field !== 'sort' && item.field !== 'ids')
    .map((item) => ({
      field: (item.field ?? 'in_stock') as CollectionRulesForm['conditions'][number]['field'],
      operator: (item.operator || 'eq') as CollectionRulesForm['conditions'][number]['operator'],
      value: coerceConditionValue(item.field ?? 'in_stock', item.value)
    }));

  const groups = (rules.groups ?? []).map((group) => ({
    operator: (group.operator === 'or' ? 'or' : 'and') as CollectionRulesForm['operator'],
    conditions:
      (group.conditions ?? []).length > 0
        ? (group.conditions ?? []).map((item) => ({
            field: (item.field ?? 'in_stock') as CollectionRulesForm['conditions'][number]['field'],
            operator: (item.operator ||
              'eq') as CollectionRulesForm['conditions'][number]['operator'],
            value: coerceConditionValue(item.field ?? 'in_stock', item.value)
          }))
        : [emptyRuleCondition()]
  }));

  if (conditions.length === 0 && groups.length === 0) {
    return emptyCollectionRules();
  }

  return {
    operator: rules.operator === 'or' ? 'or' : 'and',
    conditions: conditions.length > 0 ? conditions : [],
    groups
  };
}

function previewFromRules(rules: CollectionRulesForm): {
  preview_is_new?: boolean;
  preview_category_id?: number;
} {
  const all = [...rules.conditions, ...rules.groups.flatMap((group) => group.conditions)];
  const isNew = all.find((item) => item.field === 'is_new' && item.value === true);
  const category = all.find((item) => item.field === 'category_id');
  return {
    preview_is_new: isNew ? true : undefined,
    preview_category_id:
      category && typeof category.value === 'number' && category.value > 0
        ? category.value
        : undefined
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
  const rules = mapFormRulesToDto(values.rules);
  const preview = previewFromRules(values.rules);

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
    ends_at: mapScheduleField(values.ends_at, true),
    product_ids: productIds,
    product_overrides: productOverrides,
    preview_sort: values.sort_key,
    preview_is_new: preview.preview_is_new,
    preview_category_id: preview.preview_category_id,
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
  const rules = mapFormRulesToDto(values.rules);
  const preview = previewFromRules(values.rules);

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
    starts_at: mapScheduleField(values.starts_at) ?? '',
    ends_at: mapScheduleField(values.ends_at, true) ?? '',
    product_ids: productIds,
    product_overrides: productOverrides,
    preview_sort: values.sort_key,
    preview_is_new: preview.preview_is_new,
    preview_category_id: preview.preview_category_id,
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
    status === 'draft' ||
    status === 'scheduled' ||
    status === 'active' ||
    status === 'inactive' ||
    status === 'archived'
      ? status
      : 'draft';

  const mode =
    collection.mode === 'manual' || collection.mode === 'dynamic' || collection.mode === 'hybrid'
      ? collection.mode
      : collection.collection_type === 'manual'
        ? 'manual'
        : 'dynamic';

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
    rules: mapDtoRulesToForm(collection.rules),
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
