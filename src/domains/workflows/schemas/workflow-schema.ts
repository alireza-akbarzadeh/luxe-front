import { z } from 'zod';

export const createWorkflowSchema = z.object({
  key: z
    .string()
    .min(2, 'Key must be at least 2 characters')
    .max(64)
    .regex(/^[a-z][a-z0-9_]*$/, 'Use lowercase letters, numbers, and underscores'),
  name: z.string().min(2, 'Name is required').max(128),
  entity_type: z.string().min(2, 'Entity type is required').max(64),
  description: z.string().max(512).default('')
});

export const workflowStateSchema = z.object({
  code: z
    .string()
    .min(1, 'Code is required')
    .max(64)
    .regex(/^[a-z][a-z0-9_]*$/, 'Use lowercase snake_case'),
  name: z.string().min(1, 'Name is required').max(128),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Pick a valid hex color'),
  text_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Pick a valid hex color'),
  description: z.string().max(512).default(''),
  is_initial: z.boolean(),
  is_final: z.boolean(),
  sort_order: z.number().int().min(0).max(999)
});

export const workflowTransitionSchema = z.object({
  event: z
    .string()
    .min(1, 'Event is required')
    .max(64)
    .regex(/^[a-z][a-z0-9_]*$/, 'Use lowercase snake_case'),
  name: z.string().min(1, 'Label is required').max(128),
  required_role: z.string().max(32).default(''),
  guard_key: z.string().max(64).default(''),
  hook_key: z.string().max(64).default(''),
  sort_order: z.number().int().min(0).max(999).default(0)
});

export const KNOWN_GUARD_KEYS = [
  'product_has_price',
  'order_payment_succeeded',
  'order_cancellable'
] as const;

export const KNOWN_HOOK_KEYS = [
  'product_published',
  'order_paid',
  'order_shipped',
  'order_refunded',
  'order_cancelled',
  'shipment_delivered',
  'return_refunded'
] as const;

export const ENTITY_TYPE_SUGGESTIONS = ['product', 'order', 'shipment', 'return', 'user'] as const;

/** TanStack Form adapter for Zod schemas (matches discount-form pattern). */
export { zodFormValidator, zodFormValidators } from '@/domains/menus/schemas/form-validator';
