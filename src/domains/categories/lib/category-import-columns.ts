import type { ExcelImportColumn } from '@/components/excel-import';

/** Exact Excel columns expected by POST /admin/import/categories. */
export const CATEGORY_IMPORT_COLUMNS: ExcelImportColumn[] = [
  {
    key: 'name',
    required: true,
    description: 'Category display name',
    example: 'Clothing'
  },
  {
    key: 'slug',
    required: false,
    description: 'URL slug (optional; can be generated)',
    example: 'clothing'
  },
  {
    key: 'description',
    required: false,
    description: 'Short description',
    example: 'All clothing items'
  },
  {
    key: 'parent_id',
    required: false,
    description: 'Existing parent category ID',
    example: '1'
  },
  {
    key: 'is_active',
    required: false,
    description: 'true | false (default: true)',
    example: 'true'
  }
];
