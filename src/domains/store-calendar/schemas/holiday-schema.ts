import { z } from 'zod';

export const HOLIDAY_TYPE_OPTIONS = [
  { label: 'National', value: 'national' },
  { label: 'Regional', value: 'regional' },
  { label: 'Store', value: 'store' },
  { label: 'Vendor', value: 'vendor' }
] as const;

export const HOLIDAY_APPLY_TO_OPTIONS = [
  { label: 'All stores', value: 'all' },
  { label: 'Specific stores', value: 'stores' },
  { label: 'Vendor', value: 'vendor' },
  { label: 'Region', value: 'region' }
] as const;

export const HOLIDAY_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' }
] as const;

export const holidayTypeSchema = z.enum(['national', 'regional', 'store', 'vendor']);
export const holidayApplyToSchema = z.enum(['all', 'stores', 'vendor', 'region']);
export const holidayStatusSchema = z.enum(['draft', 'published']);

export const holidayFormSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(255),
    description: z.string().max(1000).optional(),
    holiday_type: holidayTypeSchema,
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
    is_recurring: z.boolean().optional(),
    recurrence_rule: z.string().max(50).optional(),
    apply_to: holidayApplyToSchema,
    store_ids: z.array(z.string()).optional(),
    vendor_id: z.string().optional(),
    region: z.string().max(100).optional(),
    priority: z.number().nullable().optional(),
    notes: z.string().max(1000).optional(),
    status: holidayStatusSchema
  })
  .refine((values) => values.end_date >= values.start_date, {
    message: 'End date must be on or after the start date',
    path: ['end_date']
  })
  .refine((values) => values.apply_to !== 'vendor' || Boolean(values.vendor_id?.trim()), {
    message: 'Select a vendor',
    path: ['vendor_id']
  });

export type HolidayFormValues = z.infer<typeof holidayFormSchema>;

export const holidayDefaultValues: HolidayFormValues = {
  name: '',
  description: '',
  holiday_type: 'national',
  start_date: '',
  end_date: '',
  is_recurring: false,
  recurrence_rule: '',
  apply_to: 'all',
  store_ids: [],
  vendor_id: '',
  region: '',
  priority: null,
  notes: '',
  status: 'draft'
};
