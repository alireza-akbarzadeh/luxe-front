import type { ExcelImportColumn } from '@/components/excel-import';

/** Exact Excel columns expected by POST /admin/import/products (order matters). */
export type ProductImportColumn = ExcelImportColumn;

export const PRODUCT_IMPORT_COLUMNS: ProductImportColumn[] = [
  {
    key: 'name',
    required: true,
    description: 'Product display name (min 3 chars)',
    example: 'Relaxed Linen Button-Up'
  },
  {
    key: 'sku',
    required: true,
    description: 'Unique SKU (3–50 chars)',
    example: 'LUX-W-TOP-003'
  },
  {
    key: 'price',
    required: true,
    description: 'Sell price (number ≥ 0)',
    example: '185'
  },
  {
    key: 'stock',
    required: false,
    description: 'On-hand quantity (integer ≥ 0)',
    example: '40'
  },
  {
    key: 'description',
    required: false,
    description: 'Short product description',
    example: 'Oversized linen button-up with curved hem'
  },
  {
    key: 'status',
    required: false,
    description: 'draft | active | inactive | archived (default: active)',
    example: 'active'
  },
  {
    key: 'category_id',
    required: false,
    description: 'Existing category ID',
    example: '12'
  },
  {
    key: 'brand_id',
    required: false,
    description: 'Existing brand ID',
    example: '3'
  },
  {
    key: 'store_id',
    required: false,
    description: 'Existing store ID (or use query store_id)',
    example: '1'
  },
  {
    key: 'compare_at_price',
    required: false,
    description: 'Compare-at / MSRP price',
    example: '210'
  },
  {
    key: 'barcode',
    required: false,
    description: 'Barcode / UPC',
    example: '8901234567890'
  },
  {
    key: 'low_stock_threshold',
    required: false,
    description: 'Low-stock alert threshold',
    example: '5'
  },
  {
    key: 'weight',
    required: false,
    description: 'Weight in kg',
    example: '0.35'
  }
];

export const PRODUCT_IMPORT_HEADER = PRODUCT_IMPORT_COLUMNS.map((column) => column.key).join(', ');
