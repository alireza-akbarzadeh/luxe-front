import { z } from 'zod';

import { money, slug } from '@/lib/base-schema';

// ─── Basic Info ───────────────────────────────────────────────────────────────

export const basicInfoSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255),
  slug: slug,
  description: z.string().min(1, 'Description is required'),
  brandId: z.string().min(1, 'Brand is required'),
  categoryId: z.string().min(1, 'Category is required')
});

// ─── Variants & Pricing ───────────────────────────────────────────────────────

export const variantAttributeSchema = z.object({
  name: z.string().min(1, 'Attribute name is required'),
  values: z.array(z.string().min(1)).min(1, 'Add at least one value')
});

export const variantsPricingSchema = z.object({
  price: money,
  compareAtPrice: money.nullable().optional(),
  costPerItem: money.nullable().optional(),
  taxable: z.boolean().default(true),
  attributes: z.array(variantAttributeSchema).default([])
});
// ─── Inventory ────────────────────────────────────────────────────────────────

export const inventorySchema = z.object({
  sku: z.string().min(3, 'SKU must be at least 3 characters').max(50),
  barcode: z.string().optional(),
  trackInventory: z.boolean().default(true),
  quantity: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  warehouseLocation: z.string().optional(),
  allowBackorder: z.boolean().default(false)
});

// ─── Media ────────────────────────────────────────────────────────────────────

export const mediaFileSchema = z.object({
  id: z.string(),
  file: z.instanceof(File).optional(),
  previewUrl: z.string(),
  alt: z.string(),
  isThumbnail: z.boolean()
});
export type MediaFile = z.infer<typeof mediaFileSchema>;

export const mediaSchema = z.object({
  images: z.array(mediaFileSchema).min(1, 'Add at least one image')
});

// ─── Publishing ───────────────────────────────────────────────────────────────

export const publishingSchema = z.object({
  status: z.enum(['draft', 'active', 'archived']),
  visibility: z.enum(['public', 'private']),
  tags: z.array(z.string()),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  channels: z.array(z.enum(['online_store', 'pos', 'wholesale'])),
  publishedAt: z.string().optional()
});

// ─── Full product schema ──────────────────────────────────────────────────────

export const productSchema = basicInfoSchema
  .extend(variantsPricingSchema.shape)
  .extend(inventorySchema.shape)
  .extend(mediaSchema.shape)
  .extend(publishingSchema.shape);

export type ProductFormValues = z.infer<typeof productSchema>;

export const productDefaultValues: ProductFormValues = {
  // basic
  name: '',
  slug: '',
  description: '',
  brandId: '',
  categoryId: '',
  // pricing
  price: 0,
  compareAtPrice: null,
  costPerItem: null,
  taxable: true,
  attributes: [],
  // inventory
  sku: '',
  barcode: '',
  trackInventory: true,
  quantity: 0,
  lowStockThreshold: 5,
  warehouseLocation: '',
  allowBackorder: false,
  // media
  images: [],
  // publishing
  status: 'draft',
  visibility: 'public',
  tags: [],
  seoTitle: '',
  seoDescription: '',
  channels: ['online_store'],
  publishedAt: ''
};

// ─── Step field maps (for per-step validation) ────────────────────────────────

export const stepFields = {
  'basic-info': ['name', 'slug', 'description', 'brandId', 'categoryId'],
  'variants-pricing': ['price', 'compareAtPrice', 'costPerItem', 'taxable', 'attributes'],
  inventory: [
    'sku',
    'barcode',
    'trackInventory',
    'quantity',
    'lowStockThreshold',
    'warehouseLocation',
    'allowBackorder'
  ],
  media: ['images'],
  publishing: [
    'status',
    'visibility',
    'tags',
    'seoTitle',
    'seoDescription',
    'channels',
    'publishedAt'
  ]
} as const;

export type StepId = keyof typeof stepFields;
