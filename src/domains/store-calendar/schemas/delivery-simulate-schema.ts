import { z } from 'zod';

export const SHIPPING_METHOD_OPTIONS = [
  { label: 'Standard', value: 'standard' },
  { label: 'Express', value: 'express' },
  { label: 'Pickup', value: 'pickup' }
] as const;

export const deliverySimulateFormSchema = z.object({
  store_id: z.string().min(1, 'Store is required'),
  vendor_id: z.string().optional(),
  city: z.string().max(100).optional(),
  region: z.string().max(100).optional(),
  order_date: z.string().min(1, 'Order date is required'),
  shipping_method: z.enum(['standard', 'express', 'pickup']),
  shipping_days: z.number().nullable().optional()
});

export type DeliverySimulateFormValues = z.infer<typeof deliverySimulateFormSchema>;

export const deliverySimulateDefaultValues: DeliverySimulateFormValues = {
  store_id: '',
  vendor_id: '',
  city: '',
  region: '',
  order_date: '',
  shipping_method: 'standard',
  shipping_days: null
};
