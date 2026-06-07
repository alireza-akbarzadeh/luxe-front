import { z } from 'zod';

// ─── Basic Info ───────────────────────────────────────────────────────────────

export const basicInfoSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
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
  price: z
    .number({
      error: 'Price is required'
    })
    .positive('Price must be greater than 0')
    .multipleOf(0.01, 'Max 2 decimal places'),

  compareAtPrice: z
    .number({ error: 'Compare-at price must be a number' })
    .positive('Compare-at price must be positive')
    .multipleOf(0.01, 'Max 2 decimal places')
    .nullable()
    .optional(),

  costPerItem: z
    .number({
      error: 'Cost per item must be a number'
    })
    .positive('Cost per item must be positive')
    .multipleOf(0.01, 'Max 2 decimal places')
    .nullable()
    .optional(),

  taxable: z.boolean().default(true),
  attributes: z.array(variantAttributeSchema).default([])
});
// ─── Inventory ────────────────────────────────────────────────────────────────

export const inventorySchema = z.object({
  sku: z.string().optional(),
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
  visibility: z.enum(['public', 'private', 'password']),
  tags: z.array(z.string()),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  channels: z.array(z.enum(['online_store', 'pos', 'wholesale'])),
  publishedAt: z.date().nullable().optional()
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
  price: 0.0,
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
  publishedAt: null
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

// ─── Mock data ────────────────────────────────────────────────────────────────

export const mockBrands = [
  { value: 'brand-1', label: 'Nike' },
  { value: 'brand-2', label: 'Adidas' },
  { value: 'brand-3', label: 'Puma' },
  { value: 'brand-4', label: 'New Balance' },
  { value: 'brand-5', label: 'Under Armour' }
];

export const mockCategories = [
  { value: 'cat-1', label: 'Footwear' },
  { value: 'cat-2', label: 'Apparel' },
  { value: 'cat-3', label: 'Accessories' },
  { value: 'cat-4', label: 'Equipment' },
  { value: 'cat-5', label: 'Electronics' }
];
