import { z } from 'zod';

export const couponApplicationTypes = ['code', 'automatic', 'bogo'] as const;
export const couponDiscountTypes = ['percentage', 'fixed'] as const;
export const couponCustomerSegments = ['vip', 'plus', 'new'] as const;

export const couponConditionsSchema = z.object({
  first_order_only: z.boolean(),
  min_item_quantity: z.number().int().min(1).optional(),
  customer_segment: z.union([z.enum(couponCustomerSegments), z.literal('')]).optional(),
  category_ids: z.string().optional(),
  product_ids: z.string().optional()
});

export const couponFormSchema = z
  .object({
    code: z.string().max(50),
    application_type: z.enum(couponApplicationTypes),
    discount_type: z.enum(couponDiscountTypes),
    discount_value: z.number().positive('Must be positive'),
    description: z.string().optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    minimum_order_amount: z.number().min(0).optional(),
    max_discount_amount: z.number().positive().optional(),
    usage_limit: z.number().int().positive().optional(),
    is_active: z.boolean(),
    conditions: couponConditionsSchema,
    bogo_buy_quantity: z.number().int().min(1).optional(),
    bogo_get_quantity: z.number().int().min(1).optional(),
    bogo_get_discount_percent: z.number().min(0).max(100).optional()
  })
  .superRefine((data, ctx) => {
    if (data.discount_type === 'percentage' && data.discount_value > 100) {
      ctx.addIssue({
        code: 'custom',
        message: 'Percentage cannot exceed 100',
        path: ['discount_value']
      });
    }

    if (data.application_type === 'code' && data.code.trim().length < 3) {
      ctx.addIssue({
        code: 'custom',
        message: 'Code must be at least 3 characters',
        path: ['code']
      });
    }

    if (data.application_type === 'bogo') {
      if (!data.bogo_buy_quantity || data.bogo_buy_quantity < 1) {
        ctx.addIssue({
          code: 'custom',
          message: 'Buy quantity is required for BOGO',
          path: ['bogo_buy_quantity']
        });
      }
      if (!data.bogo_get_quantity || data.bogo_get_quantity < 1) {
        ctx.addIssue({
          code: 'custom',
          message: 'Get quantity is required for BOGO',
          path: ['bogo_get_quantity']
        });
      }
    }
  });

export type CouponFormValues = z.infer<typeof couponFormSchema>;
export type CouponConditionsFormValues = z.infer<typeof couponConditionsSchema>;

export const couponDefaultValues: CouponFormValues = {
  code: '',
  application_type: 'code',
  discount_type: 'percentage',
  discount_value: 0,
  description: '',
  start_date: '',
  end_date: '',
  minimum_order_amount: 0,
  max_discount_amount: undefined,
  usage_limit: undefined,
  is_active: false,
  conditions: {
    first_order_only: false,
    min_item_quantity: undefined,
    customer_segment: undefined,
    category_ids: '',
    product_ids: ''
  },
  bogo_buy_quantity: 1,
  bogo_get_quantity: 1,
  bogo_get_discount_percent: 100
};
