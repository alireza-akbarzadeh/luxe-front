import { z } from 'zod';

export const COLLECTION_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Archived', value: 'archived' }
] as const;

export const COLLECTION_TYPE_OPTIONS = [
  { label: 'Dynamic collection', value: 'dynamic' },
  { label: 'Manual collection', value: 'manual' },
  { label: 'Hybrid collection', value: 'hybrid' }
] as const;

export const COLLECTION_PREVIEW_SORT_NONE = 'none' as const;

export const COLLECTION_PREVIEW_SORT_OPTIONS = [
  { label: 'None', value: COLLECTION_PREVIEW_SORT_NONE },
  { label: 'Newest', value: 'newest' },
  { label: 'Top rated', value: 'rating_desc' },
  { label: 'Most reviews', value: 'reviews_desc' },
  { label: 'Price: low to high', value: 'price_asc' },
  { label: 'Price: high to low', value: 'price_desc' }
] as const;

export const COLLECTION_THEME_OPTIONS = [
  { label: 'Default', value: '' },
  { label: 'Lifestyle', value: 'lifestyle' },
  { label: 'Editorial', value: 'editorial' },
  { label: 'Sale', value: 'sale' },
  { label: 'Seasonal', value: 'seasonal' },
  { label: 'Minimal', value: 'minimal' }
] as const;

export const COLLECTION_RULE_FIELD_OPTIONS = [
  { label: 'Category', value: 'category_id' },
  { label: 'Brand', value: 'brand_id' },
  { label: 'Min price', value: 'min_price' },
  { label: 'Max price', value: 'max_price' },
  { label: 'Min rating', value: 'min_rating' },
  { label: 'Is new', value: 'is_new' },
  { label: 'In stock', value: 'in_stock' },
  { label: 'On sale', value: 'on_sale' },
  { label: 'Search', value: 'search' }
] as const;

export const COLLECTION_RULE_OPERATOR_OPTIONS = [
  { label: 'Equals', value: 'eq' },
  { label: 'Not equals', value: 'neq' },
  { label: 'Greater or equal', value: 'gte' },
  { label: 'Less or equal', value: 'lte' },
  { label: 'Contains', value: 'contains' },
  { label: 'In list', value: 'in' }
] as const;

export const collectionStatusSchema = z.enum([
  'draft',
  'scheduled',
  'active',
  'inactive',
  'archived'
]);
export const collectionTypeSchema = z.enum(['manual', 'dynamic', 'hybrid']);
export const collectionSortKeySchema = z.enum([
  'newest',
  'rating_desc',
  'reviews_desc',
  'price_asc',
  'price_desc'
]);

export const COLLECTION_SORT_KEY_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Top rated', value: 'rating_desc' },
  { label: 'Most reviewed', value: 'reviews_desc' },
  { label: 'Price: low to high', value: 'price_asc' },
  { label: 'Price: high to low', value: 'price_desc' }
] as const;

export const collectionRuleConditionSchema = z.object({
  field: z.enum([
    'category_id',
    'brand_id',
    'min_price',
    'max_price',
    'min_rating',
    'is_new',
    'in_stock',
    'on_sale',
    'search'
  ]),
  operator: z.enum(['eq', 'neq', 'gte', 'lte', 'contains', 'in']),
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.number())])
});

export const collectionRuleGroupSchema = z.object({
  operator: z.enum(['and', 'or']),
  conditions: z.array(collectionRuleConditionSchema).min(1, 'Add at least one condition')
});

export const collectionRulesSchema = z.object({
  operator: z.enum(['and', 'or']),
  conditions: z.array(collectionRuleConditionSchema),
  groups: z.array(collectionRuleGroupSchema)
});

export type CollectionRuleConditionForm = z.infer<typeof collectionRuleConditionSchema>;
export type CollectionRuleGroupForm = z.infer<typeof collectionRuleGroupSchema>;
export type CollectionRulesForm = z.infer<typeof collectionRulesSchema>;

export function emptyRuleCondition(): CollectionRuleConditionForm {
  return { field: 'in_stock', operator: 'eq', value: true };
}

export function emptyRuleGroup(): CollectionRuleGroupForm {
  return { operator: 'or', conditions: [emptyRuleCondition()] };
}

export function emptyCollectionRules(): CollectionRulesForm {
  return { operator: 'and', conditions: [emptyRuleCondition()], groups: [] };
}

function countRuleConditions(rules: CollectionRulesForm): number {
  return (
    rules.conditions.length + rules.groups.reduce((sum, group) => sum + group.conditions.length, 0)
  );
}

export const collectionFormSchema = z
  .object({
    eyebrow: z.string().max(128, 'Eyebrow must be at most 128 characters').optional(),
    title: z
      .string()
      .min(2, 'Title must be at least 2 characters')
      .max(255, 'Title must be at most 255 characters'),
    subtitle: z.string().max(255, 'Subtitle must be at most 255 characters').optional(),
    slug: z
      .string()
      .min(2, 'Slug must be at least 2 characters')
      .max(128, 'Slug must be at most 128 characters')
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug must be lowercase letters, numbers, and hyphens only'
      ),
    description: z.string().max(2000, 'Description must be at most 2000 characters').optional(),
    href: z
      .string()
      .max(512)
      .refine((value) => value === '' || value.startsWith('/'), 'Href must start with /')
      .optional(),
    image_url: z
      .string()
      .max(2048)
      .refine((value) => value === '' || /^https?:\/\//.test(value), 'Enter a valid image URL')
      .optional(),
    cta_label: z.string().max(128).optional(),
    sort_order: z.number().int().min(0).max(9999),
    theme: z.string().max(64).optional(),
    status: collectionStatusSchema,
    mode: collectionTypeSchema,
    starts_at: z.string().optional(),
    ends_at: z.string().optional(),
    product_ids: z.array(z.string()),
    sort_key: collectionSortKeySchema,
    rules: collectionRulesSchema,
    seo_title: z.string().max(255).optional(),
    seo_description: z.string().max(500).optional(),
    meta_keywords: z.string().max(500).optional(),
    og_title: z.string().max(255).optional(),
    og_description: z.string().max(500).optional(),
    og_image_url: z
      .string()
      .max(2048)
      .refine((value) => value === '' || /^https?:\/\//.test(value), 'Enter a valid image URL')
      .optional(),
    twitter_title: z.string().max(255).optional(),
    twitter_description: z.string().max(500).optional(),
    twitter_image_url: z
      .string()
      .max(2048)
      .refine((value) => value === '' || /^https?:\/\//.test(value), 'Enter a valid image URL')
      .optional(),
    canonical_url: z.string().max(2048).optional(),
    robots_directives: z.string().max(255).optional(),
    is_indexable: z.boolean(),
    hero_title: z.string().max(255).optional(),
    hero_description: z.string().max(2000).optional(),
    desktop_image_url: z
      .string()
      .max(2048)
      .refine((value) => value === '' || /^https?:\/\//.test(value), 'Enter a valid image URL')
      .optional(),
    tablet_image_url: z
      .string()
      .max(2048)
      .refine((value) => value === '' || /^https?:\/\//.test(value), 'Enter a valid image URL')
      .optional(),
    mobile_image_url: z
      .string()
      .max(2048)
      .refine((value) => value === '' || /^https?:\/\//.test(value), 'Enter a valid image URL')
      .optional(),
    overlay_opacity: z.number().min(0).max(1),
    theme_variant: z.string().max(64).optional()
  })
  .superRefine((values, ctx) => {
    if (values.starts_at && values.ends_at) {
      const start = new Date(values.starts_at);
      const end = new Date(values.ends_at);
      if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end <= start) {
        ctx.addIssue({
          code: 'custom',
          message: 'End date must be after start date',
          path: ['ends_at']
        });
      }
    }
    if (
      (values.mode === 'dynamic' || values.mode === 'hybrid') &&
      countRuleConditions(values.rules) === 0
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'Add at least one rule condition for dynamic or hybrid collections',
        path: ['rules']
      });
    }
  });

export type CollectionFormValues = z.infer<typeof collectionFormSchema>;

export const COLLECTION_CATEGORY_NONE = 'none' as const;

export const collectionDefaultValues: CollectionFormValues = {
  eyebrow: '',
  title: '',
  subtitle: '',
  slug: '',
  description: '',
  href: '/shop',
  image_url: '',
  cta_label: 'Shop collection',
  sort_order: 0,
  theme: '',
  status: 'draft',
  mode: 'dynamic',
  starts_at: '',
  ends_at: '',
  product_ids: [],
  sort_key: 'newest',
  rules: emptyCollectionRules(),
  seo_title: '',
  seo_description: '',
  meta_keywords: '',
  og_title: '',
  og_description: '',
  og_image_url: '',
  twitter_title: '',
  twitter_description: '',
  twitter_image_url: '',
  canonical_url: '',
  robots_directives: '',
  is_indexable: true,
  hero_title: '',
  hero_description: '',
  desktop_image_url: '',
  tablet_image_url: '',
  mobile_image_url: '',
  overlay_opacity: 0.25,
  theme_variant: ''
};
