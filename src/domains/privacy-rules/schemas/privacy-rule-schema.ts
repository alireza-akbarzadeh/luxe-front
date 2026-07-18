import { z } from 'zod';

export const PRIVACY_RULE_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Archived', value: 'archived' }
] as const;

export const PRIVACY_RULE_PROVIDER_OPTIONS = [
  { label: 'Platform (Luxe)', value: 'platform' },
  { label: 'Stripe', value: 'stripe' },
  { label: 'PayPal', value: 'paypal' },
  { label: 'Wallet', value: 'wallet' },
  { label: 'Gift card', value: 'gift_card' },
  { label: 'Shipping', value: 'shipping' },
  { label: 'AI', value: 'ai' },
  { label: 'All providers', value: 'all' }
] as const;

export const privacyRuleStatusSchema = z.enum(['draft', 'active', 'inactive', 'archived']);

export const privacyRuleProviderSchema = z.enum([
  'platform',
  'stripe',
  'paypal',
  'wallet',
  'gift_card',
  'shipping',
  'ai',
  'all'
]);

export const privacyRuleFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must be at most 255 characters'),
  key: z
    .string()
    .min(2, 'Key must be at least 2 characters')
    .max(100, 'Key must be at most 100 characters')
    .regex(
      /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/,
      'Key must be lowercase letters, numbers, dots, and hyphens (e.g. stripe.checkout)'
    ),
  provider: privacyRuleProviderSchema,
  content_markdown: z.string().min(1, 'Markdown content is required'),
  summary: z.string().max(2000, 'Summary must be at most 2000 characters').optional(),
  locale: z
    .string()
    .min(2, 'Locale is required')
    .max(10, 'Locale must be at most 10 characters')
    .regex(/^[a-z]{2}(?:-[A-Z]{2})?$/, 'Use a locale like en or fa'),
  status: privacyRuleStatusSchema,
  bump_version: z.boolean().optional()
});

export type PrivacyRuleFormValues = z.infer<typeof privacyRuleFormSchema>;

export const privacyRuleDefaultValues: PrivacyRuleFormValues = {
  name: '',
  key: '',
  provider: 'platform',
  content_markdown: '',
  summary: '',
  locale: 'en',
  status: 'draft',
  bump_version: false
};
