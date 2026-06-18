import { z } from 'zod';

export const INVENTORY_ADJUST_REASONS = [
  { label: 'Receive shipment', value: 'receive' },
  { label: 'Cycle count correction', value: 'cycle_count' },
  { label: 'Damage / write-off', value: 'damage' },
  { label: 'Shrinkage', value: 'shrinkage' },
  { label: 'Manual correction', value: 'correction' },
  { label: 'Other', value: 'other' }
] as const;

export const inventoryAdjustSchema = z.object({
  delta: z.number().int().refine((value) => value !== 0, 'Enter a non-zero adjustment'),
  reason: z.enum(['receive', 'correction', 'damage', 'shrinkage', 'cycle_count', 'other']),
  note: z.string().max(500).optional()
});

export type InventoryAdjustFormValues = z.infer<typeof inventoryAdjustSchema>;

export const inventoryAdjustDefaultValues: InventoryAdjustFormValues = {
  delta: 0,
  reason: 'receive',
  note: ''
};

export const INVENTORY_STOCK_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Low stock', value: 'low' },
  { label: 'Out of stock', value: 'out' },
  { label: 'Healthy', value: 'healthy' },
  { label: 'Not tracked', value: 'not_tracked' }
] as const;
