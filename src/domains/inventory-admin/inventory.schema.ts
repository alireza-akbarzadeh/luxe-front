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

export const INVENTORY_SORT_OPTIONS = [
  { label: 'Stock (low → high)', value: 'stock_asc' },
  { label: 'Stock (high → low)', value: 'stock_desc' },
  { label: 'Name (A → Z)', value: 'name_asc' },
  { label: 'Waitlist (high → low)', value: 'waitlist_desc' },
  { label: 'Velocity (30d sales)', value: 'velocity_desc' }
] as const;

export const bulkReceiveSchema = z.object({
  reason: z.enum(['receive', 'correction', 'damage', 'shrinkage', 'cycle_count', 'other']),
  lines: z
    .string()
    .min(1, 'Paste at least one SKU and quantity')
    .max(20000, 'Input is too large')
});

export type BulkReceiveFormValues = z.infer<typeof bulkReceiveSchema>;

export const bulkReceiveDefaultValues: BulkReceiveFormValues = {
  reason: 'receive',
  lines: ''
};

export interface ParsedBulkReceiveRow {
  sku: string;
  delta: number;
  line: number;
  error?: string;
}

/** Parses pasted bulk-receive lines (`SKU,qty` or `SKU qty` per line). */
export function parseBulkReceiveLines(input: string): ParsedBulkReceiveRow[] {
  const rows: ParsedBulkReceiveRow[] = [];
  const lines = input.split(/\r?\n/);

  for (let index = 0; index < lines.length; index++) {
    const raw = lines[index]?.trim();
    if (!raw || raw.startsWith('#')) continue;

    const lineNo = index + 1;
    const parts = raw.split(/[,\t ]+/).filter(Boolean);
    if (parts.length < 2) {
      rows.push({ sku: raw, delta: 0, line: lineNo, error: 'Expected SKU and quantity' });
      continue;
    }

    const sku = parts[0]?.trim() ?? '';
    const delta = Number(parts[1]);
    if (!sku) {
      rows.push({ sku: raw, delta: 0, line: lineNo, error: 'SKU is required' });
      continue;
    }
    if (!Number.isFinite(delta) || delta === 0 || !Number.isInteger(delta)) {
      rows.push({ sku, delta: 0, line: lineNo, error: 'Quantity must be a non-zero integer' });
      continue;
    }

    rows.push({ sku, delta, line: lineNo });
  }

  return rows;
}
