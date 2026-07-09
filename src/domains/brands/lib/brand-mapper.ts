import type { BrandFormValues } from '@/domains/brands/brand.schema';
import type { DtoUpdateBrandRequest } from '@/services/-brands-{id}-put.schemas';
import type { DtoBrandResponse } from '@/services/-brands-get.schemas';
import type { DtoCreateBrandRequest } from '@/services/-brands-post.schemas';

function optionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** Maps admin form values to the JSON create payload expected by the API. */
export function mapFormToCreateBrandRequest(values: BrandFormValues): DtoCreateBrandRequest {
  return {
    name: values.name.trim(),
    slug: values.slug.trim(),
    description: optionalText(values.description),
    logo_url: optionalText(values.logo_url),
    status: values.status,
    is_featured: values.is_featured,
    featured_sort_order: values.is_featured ? (values.featured_sort_order ?? 0) : 0,
    meta_title: optionalText(values.meta_title),
    meta_description: optionalText(values.meta_description)
  };
}

/** Maps admin form values to the JSON update payload expected by the API. */
export function mapFormToUpdateBrandRequest(values: BrandFormValues): DtoUpdateBrandRequest {
  return {
    name: values.name.trim(),
    slug: values.slug.trim(),
    description: optionalText(values.description),
    logo_url: optionalText(values.logo_url),
    is_featured: values.is_featured,
    featured_sort_order: values.is_featured ? (values.featured_sort_order ?? 0) : 0,
    meta_title: optionalText(values.meta_title),
    meta_description: optionalText(values.meta_description)
  };
}

/** Maps an API brand into admin form values for edit mode. */
export function mapBrandToFormValues(brand: DtoBrandResponse): BrandFormValues {
  const status = brand.status;
  const validStatus =
    status === 'draft' || status === 'active' || status === 'inactive' || status === 'archived'
      ? status
      : 'draft';

  return {
    name: brand.name ?? '',
    slug: brand.slug ?? '',
    description: brand.description ?? '',
    logo_url: brand.logo_url ?? '',
    status: validStatus,
    is_featured: brand.is_featured ?? false,
    featured_sort_order: brand.featured_sort_order ?? 0,
    meta_title: brand.meta_title ?? '',
    meta_description: brand.meta_description ?? ''
  };
}
