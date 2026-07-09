import type { DtoProductResponse } from '@/services/-products-{id}-get.schemas';
import type { DtoCreateProductRequest } from '@/services/-products-post.schemas';

/** Builds a draft clone payload from an existing product for POST /products. */
export function buildDuplicateProductRequest(product: DtoProductResponse): DtoCreateProductRequest {
  const suffix = Date.now().toString(36);
  const baseSku = (product.sku ?? 'SKU').slice(0, 40);

  return {
    name: `${product.name ?? 'Product'} (Copy)`,
    description: product.description ?? '',
    price: product.price ?? 0,
    compare_at_price: product.compare_at_price,
    cost: product.cost,
    sku: `${baseSku}-${suffix}`,
    barcode: product.barcode,
    stock: product.stock ?? 0,
    low_stock_threshold: product.low_stock_threshold,
    category_id: product.category_id,
    brand_id: product.brand_id,
    images: product.images ?? [],
    status: 'draft',
    meta_title: product.meta_title,
    meta_description: product.meta_description,
    attributes:
      product.attributes
        ?.filter((attr) => attr.name && attr.values?.length)
        .map((attr) => ({
          name: attr.name ?? '',
          values: attr.values ?? []
        })) ?? [],
    track_inventory: product.track_inventory,
    warehouse_location: product.warehouse_location,
    allow_backorder: product.allow_backorder,
    visibility: product.visibility,
    tags: product.tags,
    channels: product.channels?.length ? product.channels : ['online_store'],
    is_digital: product.is_digital,
    is_new: false,
    store_id: product.store_id
  };
}
