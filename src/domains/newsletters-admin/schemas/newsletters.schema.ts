import { z } from 'zod';

export const SEGMENT_OPTIONS = [
  { label: 'All subscribers', value: 'all' },
  { label: 'Checkout opt-in', value: 'checkout' },
  { label: 'Homepage signup', value: 'home' },
  { label: 'Footer signup', value: 'footer' },
  { label: 'Registration', value: 'register' },
  { label: 'VIP customers', value: 'vip' },
  { label: 'Loyal customers', value: 'loyal' },
  { label: 'New customers', value: 'new' },
  { label: 'At-risk customers', value: 'at_risk' }
] as const;

export const templateFormSchema = z.object({
  name: z.string().min(2, 'Name is required').max(255),
  slug: z.string().min(2, 'Slug is required').max(128),
  subject: z.string().min(2, 'Subject is required').max(512),
  body_html: z.string().min(1, 'HTML body is required'),
  status: z.enum(['draft', 'active', 'archived'])
});

export type TemplateFormValues = z.infer<typeof templateFormSchema>;

export const templateDefaultValues: TemplateFormValues = {
  name: '',
  slug: '',
  subject: '',
  body_html: '<p>Hello {{name}},</p>',
  status: 'draft'
};

export const emailCampaignFormSchema = z.object({
  name: z.string().min(2, 'Name is required').max(255),
  subject: z.string().min(2, 'Subject is required').max(512),
  body_html: z.string().optional(),
  template_id: z.number().int().positive().optional().nullable(),
  segment: z.enum([
    'all',
    'checkout',
    'footer',
    'home',
    'register',
    'vip',
    'loyal',
    'new',
    'at_risk'
  ]),
  status: z.enum(['draft', 'scheduled']),
  scheduled_at: z.string().optional()
});

export type EmailCampaignFormValues = z.infer<typeof emailCampaignFormSchema>;

export const emailCampaignDefaultValues: EmailCampaignFormValues = {
  name: '',
  subject: '',
  body_html: '',
  template_id: null,
  segment: 'all',
  status: 'draft',
  scheduled_at: ''
};
