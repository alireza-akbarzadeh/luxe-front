import type { ProductsStatusFilter } from '@/domains/product-dashboard/hooks/use-products-query';
import type { GetAdminProductsExportParams } from '@/services/-admin-products-export-get.schemas';

interface BuildProductExportParamsInput {
  status: ProductsStatusFilter;
  minPrice: number | null;
  maxPrice: number | null;
  categoryId: number | null;
  isDigital: 'all' | 'yes' | 'no';
  search?: string;
}

/** Maps URL/table filters to GET /admin/products/export query params. */
export function buildProductExportParams(
  input: BuildProductExportParamsInput
): GetAdminProductsExportParams {
  return {
    status: input.status === 'all' ? undefined : input.status,
    name: input.search?.trim() || undefined,
    min_price: input.minPrice ?? undefined,
    max_price: input.maxPrice ?? undefined,
    category_id: input.categoryId ?? undefined,
    is_digital: input.isDigital === 'all' ? undefined : input.isDigital === 'yes',
    format: 'csv'
  };
}
