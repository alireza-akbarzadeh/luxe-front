import { z } from 'zod';

export const BLOG_SECTION_TYPE_OPTIONS = [
  { label: 'Article', value: 'article' },
  { label: 'Buying guide', value: 'buying_guide' },
  { label: 'Product review', value: 'product_review' },
  { label: 'Comparison', value: 'comparison' },
  { label: 'Tutorial', value: 'tutorial' },
  { label: 'Industry news', value: 'industry_news' },
  { label: 'Gift guide', value: 'gift_guide' },
  { label: 'Seasonal', value: 'seasonal' },
  { label: 'New technology', value: 'new_technology' }
] as const;

export const BLOG_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'In review', value: 'in_review' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' }
] as const;

/** Radix Select forbids empty-string item values — use this for “no category”. */
export const BLOG_CATEGORY_NONE = '__none__' as const;

export const blogPostStatusSchema = z.enum([
  'draft',
  'in_review',
  'scheduled',
  'published',
  'archived'
]);

const contentBlockSchema = z.record(z.string(), z.unknown());

export const blogPostFormSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be at most 200 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(200, 'Slug must be at most 200 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase letters, numbers, and hyphens only'
    ),
  excerpt: z.string().max(500, 'Excerpt must be at most 500 characters').optional(),
  hero_image_url: z
    .string()
    .max(2048)
    .refine((value) => value === '' || /^https?:\/\//.test(value), 'Enter a valid image URL')
    .optional(),
  hero_image_alt: z.string().max(200).optional(),
  section_type: z.string().min(1, 'Section type is required'),
  status: blogPostStatusSchema,
  category_id: z.string().optional(),
  content_blocks: z.array(contentBlockSchema),
  is_featured: z.boolean(),
  is_editor_pick: z.boolean(),
  is_trending: z.boolean(),
  reading_time_minutes: z.number().int().min(1).max(120),
  meta_title: z.string().max(70, 'Meta title must be at most 70 characters').optional(),
  meta_description: z
    .string()
    .max(160, 'Meta description must be at most 160 characters')
    .optional(),
  canonical_url: z.string().max(2048).optional()
});

export type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;

export const blogPostDefaultValues: BlogPostFormValues = {
  title: '',
  slug: '',
  excerpt: '',
  hero_image_url: '',
  hero_image_alt: '',
  section_type: 'article',
  status: 'draft',
  category_id: BLOG_CATEGORY_NONE,
  content_blocks: [],
  is_featured: false,
  is_editor_pick: false,
  is_trending: false,
  reading_time_minutes: 5,
  meta_title: '',
  meta_description: '',
  canonical_url: ''
};
