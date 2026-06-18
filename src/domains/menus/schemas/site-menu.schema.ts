import { z } from 'zod';

const linkSchema = z.object({
  title: z.string().min(1),
  href: z.string().min(1)
});

const columnSchema = z.object({
  title: z.string().min(1),
  links: z.array(linkSchema).default([])
});

const featuredSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  href: z.string().min(1),
  image: z.string().optional(),
  badge: z.string().optional()
});

export const siteMenuSchema = z
  .object({
    label: z.string().min(1, 'Label is required'),
    type: z.enum(['link', 'mega']),
    href: z.string().optional(),
    badge: z.string().optional(),
    order: z.coerce.number().int().min(0).default(0),
    viewAllLabel: z.string().optional(),
    viewAllHref: z.string().optional(),
    columns: z.array(columnSchema).default([]),
    featured: z.array(featuredSchema).default([])
  })
  .superRefine((value, ctx) => {
    if (value.type === 'link' && !value.href?.trim()) {
      ctx.addIssue({ code: 'custom', message: 'Href is required for link items', path: ['href'] });
    }
    if (value.type === 'mega' && value.columns.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Add at least one column for mega menus',
        path: ['columns']
      });
    }
  });

export type SiteMenuFormValues = z.infer<typeof siteMenuSchema>;

export const siteMenuDefaults: SiteMenuFormValues = {
  label: '',
  type: 'link',
  href: '',
  badge: '',
  order: 0,
  viewAllLabel: '',
  viewAllHref: '',
  columns: [],
  featured: []
};
