import type { ProductFormValues } from '@/domains/product-dashboard/product-schema';
import type { DtoProductResponse } from '@/services/-products-{id}-get.schemas';
import type { DtoUpdateProductRequest } from '@/services/-products-{id}-put.schemas';
import type {
  DtoCreateProductRequest,
  DtoCreateProductRequestStatus
} from '@/services/-products-post.schemas';

function parseOptionalNumber(value: string | undefined): number | undefined {
  if (!value?.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function mapAttributes(values: ProductFormValues) {
  return values.attributes
    .filter((attr) => attr.name.trim() && attr.values.length > 0)
    .map((attr) => ({
      name: attr.name.trim(),
      values: attr.values.map((v) => v.trim()).filter(Boolean)
    }));
}

/** Maps admin form values to the JSON create payload expected by the API. */
export function mapFormToCreateRequest(
  values: ProductFormValues,
  imageUrls: string[]
): DtoCreateProductRequest {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    price: values.price,
    compare_at_price: values.compareAtPrice ?? undefined,
    cost: values.costPerItem ?? undefined,
    sku: values.sku.trim(),
    barcode: values.barcode?.trim() || undefined,
    stock: values.quantity,
    low_stock_threshold: values.lowStockThreshold,
    category_id: parseOptionalNumber(values.categoryId),
    brand_id: parseOptionalNumber(values.brandId),
    images: imageUrls,
    status: values.status as DtoCreateProductRequestStatus,
    meta_title: values.seoTitle?.trim() || undefined,
    meta_description: values.seoDescription?.trim() || undefined,
    attributes: mapAttributes(values),
    track_inventory: values.trackInventory,
    warehouse_location: values.warehouseLocation?.trim() || undefined,
    allow_backorder: values.allowBackorder,
    visibility: values.visibility,
    tags: values.tags,
    channels: values.channels,
    published_at: values.publishedAt ? new Date(values.publishedAt).toISOString() : undefined,
    weight: values.weight ?? undefined,
    is_digital: values.isDigital,
    is_new: values.isNew,
    sizes: values.sizes.length ? values.sizes : undefined,
    colors: values.colors.length ? values.colors : undefined
  };
}

/** Maps admin form values to the JSON update payload expected by the API. */
export function mapFormToUpdateRequest(
  values: ProductFormValues,
  imageUrls: string[]
): DtoUpdateProductRequest {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    price: values.price,
    compare_at_price: values.compareAtPrice ?? undefined,
    cost: values.costPerItem ?? undefined,
    sku: values.sku.trim(),
    barcode: values.barcode?.trim() || undefined,
    stock: values.quantity,
    low_stock_threshold: values.lowStockThreshold,
    category_id: parseOptionalNumber(values.categoryId),
    brand_id: parseOptionalNumber(values.brandId),
    images: imageUrls,
    status: values.status,
    meta_title: values.seoTitle?.trim() || undefined,
    meta_description: values.seoDescription?.trim() || undefined,
    attributes: mapAttributes(values),
    track_inventory: values.trackInventory,
    warehouse_location: values.warehouseLocation?.trim() || undefined,
    allow_backorder: values.allowBackorder,
    visibility: values.visibility,
    tags: values.tags,
    channels: values.channels,
    published_at: values.publishedAt ? new Date(values.publishedAt).toISOString() : undefined,
    weight: values.weight ?? undefined,
    is_digital: values.isDigital,
    is_new: values.isNew,
    sizes: values.sizes.length ? values.sizes : undefined,
    colors: values.colors.length ? values.colors : undefined
  };
}

/** Maps an API product into admin form default values for edit mode. */
export function mapProductToFormValues(product: DtoProductResponse): Partial<ProductFormValues> {
  const visibility =
    product.visibility === 'private' ? 'private' : ('public' as ProductFormValues['visibility']);

  return {
    name: product.name ?? '',
    slug: product.slug ?? '',
    description: product.description ?? '',
    brandId: product.brand_id?.toString() ?? '',
    categoryId: product.category_id?.toString() ?? '',
    price: product.price ?? 0,
    compareAtPrice: product.compare_at_price ?? null,
    costPerItem: product.cost ?? null,
    attributes:
      product.attributes?.map((attr) => ({
        name: attr.name ?? '',
        values: attr.values ?? []
      })) ?? [],
    sku: product.sku ?? '',
    barcode: product.barcode ?? '',
    trackInventory: product.track_inventory ?? true,
    quantity: product.stock ?? 0,
    lowStockThreshold: product.low_stock_threshold ?? 5,
    warehouseLocation: product.warehouse_location ?? '',
    allowBackorder: product.allow_backorder ?? false,
    weight: product.weight ?? null,
    isDigital: product.is_digital ?? false,
    isNew: product.is_new ?? false,
    sizes: product.sizes ?? [],
    colors: product.colors ?? [],
    images:
      product.images?.map((url, index) => ({
        id: `existing-${index}`,
        previewUrl: url,
        alt: product.name ?? '',
        isThumbnail: index === 0
      })) ?? [],
    status: (product.status as ProductFormValues['status']) ?? 'draft',
    visibility,
    tags: product.tags ?? [],
    seoTitle: product.meta_title ?? '',
    seoDescription: product.meta_description ?? '',
    channels: (product.channels?.length
      ? product.channels
      : ['online_store']) as ProductFormValues['channels'],
    publishedAt: product.published_at ?? ''
  };
}
