import type { CategoryFormValues } from '@/domains/categories/category.schema';
import type { ModelsCategory } from '@/services/-admin-categories-{id}-get.schemas';
import type { DtoUpdateCategoryRequest } from '@/services/-admin-categories-{id}-put.schemas';
import type { DtoCreateCategoryRequest } from '@/services/-admin-categories-post.schemas';

function parseParentId(value: string | null | undefined): number | undefined {
  if (!value?.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function optionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** Maps admin form values to the JSON create payload expected by the API. */
export function mapFormToCreateCategoryRequest(
  values: CategoryFormValues
): DtoCreateCategoryRequest {
  return {
    name: values.name.trim(),
    slug: values.slug.trim() || undefined,
    description: values.description?.trim() || undefined,
    parent_id: parseParentId(values.parent_id),
    is_active: values.is_active,
    icon: optionalText(values.icon),
    image_url: optionalText(values.image_url),
    meta_title: optionalText(values.meta_title),
    meta_description: optionalText(values.meta_description)
  };
}

/** Maps admin form values to the JSON update payload expected by the API. */
export function mapFormToUpdateCategoryRequest(
  values: CategoryFormValues
): DtoUpdateCategoryRequest {
  return {
    name: values.name.trim(),
    slug: values.slug.trim() || undefined,
    description: values.description?.trim() || undefined,
    parent_id: parseParentId(values.parent_id),
    icon: optionalText(values.icon),
    image_url: optionalText(values.image_url),
    meta_title: optionalText(values.meta_title),
    meta_description: optionalText(values.meta_description)
  };
}

/** Maps an API category into admin form values for edit mode. */
export function mapCategoryToFormValues(category: ModelsCategory): CategoryFormValues {
  return {
    name: category.name ?? '',
    slug: category.slug ?? '',
    description: category.description ?? '',
    parent_id: category.parent_id ? String(category.parent_id) : null,
    is_active: category.is_active ?? true,
    icon: category.icon ?? '',
    image_url: category.image_url ?? '',
    meta_title: category.meta_title ?? '',
    meta_description: category.meta_description ?? ''
  };
}
