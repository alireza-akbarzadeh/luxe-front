import { z } from 'zod';

export const flashDealFormSchema = z.object({
  product_id: z.number().int().positive('Product ID is required'),
  title: z.string().optional(),
  starts_at: z.string().optional(),
  ends_at: z.string().min(1, 'End date is required'),
  quantity_limit: z.number().int().positive().optional(),
  sort_order: z.number().int().min(0),
  status: z.enum(['active', 'draft', 'ended'])
});

export type FlashDealFormValues = z.infer<typeof flashDealFormSchema>;

export const flashDealDefaultValues: FlashDealFormValues = {
  product_id: 0,
  title: '',
  starts_at: '',
  ends_at: '',
  quantity_limit: undefined,
  sort_order: 0,
  status: 'draft'
};

export const bannerFormSchema = z.object({
  section_key: z.string().min(2, 'Key must be at least 2 characters').max(64),
  title: z.string().min(2, 'Title is required').max(255),
  href: z.string().min(1, 'Link is required').max(512),
  image_url: z.string().optional(),
  sort_order: z.number().int().min(0),
  status: z.enum(['draft', 'published', 'archived']),
  eyebrow: z.string().optional(),
  description: z.string().optional(),
  badge: z.string().optional(),
  cta_label: z.string().optional(),
  ends_at: z.string().optional()
});

export type BannerFormValues = z.infer<typeof bannerFormSchema>;

export const bannerDefaultValues: BannerFormValues = {
  section_key: '',
  title: '',
  href: '/shop',
  image_url: '',
  sort_order: 0,
  status: 'draft',
  eyebrow: '',
  description: '',
  badge: '',
  cta_label: '',
  ends_at: ''
};

export const campaignFormSchema = z.object({
  name: z.string().min(2, 'Name is required').max(255),
  slug: z.string().max(128).optional(),
  description: z.string().optional(),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
  status: z.enum(['draft', 'scheduled', 'active', 'ended', 'archived']),
  flash_deal_ids: z.string().optional(),
  section_ids: z.string().optional(),
  collection_ids: z.string().optional()
});

export type CampaignFormValues = z.infer<typeof campaignFormSchema>;

export const campaignDefaultValues: CampaignFormValues = {
  name: '',
  slug: '',
  description: '',
  starts_at: '',
  ends_at: '',
  status: 'draft',
  flash_deal_ids: '',
  section_ids: '',
  collection_ids: ''
};
