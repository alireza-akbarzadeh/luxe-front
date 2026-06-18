import { z } from 'zod';

/** Sentinel for Radix Select — empty string is not allowed as SelectItem value. */
export const MENU_ITEM_NO_PARENT = '__none__';

export const menuGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(80),
  display_order: z.coerce.number().int().min(0).default(0)
});

export const menuItemSchema = z.object({
  parent_id: z.string().optional(),
  label: z.string().min(1, 'Label is required').max(120),
  href: z.string().max(500).default(''),
  icon: z.string().min(1, 'Icon is required'),
  permission: z.string().max(120).default(''),
  display_order: z.coerce.number().int().min(0).default(0)
});

export type MenuGroupFormValues = z.infer<typeof menuGroupSchema>;
export type MenuItemFormValues = z.infer<typeof menuItemSchema>;

export const menuGroupDefaults: MenuGroupFormValues = {
  name: '',
  display_order: 0
};

export const menuItemDefaults: MenuItemFormValues = {
  parent_id: MENU_ITEM_NO_PARENT,
  label: '',
  href: '',
  icon: 'LayoutDashboard',
  permission: '',
  display_order: 0
};
