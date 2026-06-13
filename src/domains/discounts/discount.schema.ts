import { z } from 'zod';

export const couponFormSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').max(50),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_value: z.number().positive('Must be positive').max(100, 'Percentage cannot exceed 100'),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  minimum_order_amount: z.number().min(0).optional(),
  max_discount_amount: z.number().positive().optional(),
  usage_limit: z.number().int().positive().optional(),
  is_active: z.boolean()
});

export const couponDefaultValues = {
  code: '',
  discount_type: 'percentage' as const,
  discount_value: 0,
  description: '',
  start_date: '',
  end_date: '',
  minimum_order_amount: 0,
  max_discount_amount: undefined,
  usage_limit: undefined,
  is_active: true
};
