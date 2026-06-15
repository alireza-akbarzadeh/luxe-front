import type { DtoProductAttributeResponse } from '@/services/-products-{id}-get.schemas';

export type ProductAttributeKind =
  | 'video'
  | 'color'
  | 'size'
  | 'boolean'
  | 'measurement'
  | 'list'
  | 'text';

const VIDEO_NAMES = new Set(['video', 'video_url', 'product_video']);
const COLOR_NAMES = new Set(['color', 'colors', 'colour', 'colours']);
const SIZE_NAMES = new Set(['size', 'sizes']);
const BOOLEAN_NAMES = new Set([
  'is_digital',
  'digital',
  'track_inventory',
  'allow_backorder',
  'handmade',
  'organic'
]);
const MEASUREMENT_NAMES = new Set([
  'weight',
  'dimension',
  'dimensions',
  'length',
  'width',
  'height',
  'depth',
  'volume'
]);

/** Infer render component from attribute name and values. */
export function resolveProductAttributeKind(
  attribute: DtoProductAttributeResponse
): ProductAttributeKind {
  const name = attribute.name?.toLowerCase().trim() ?? '';
  const values = attribute.values ?? [];

  if (VIDEO_NAMES.has(name)) return 'video';
  if (COLOR_NAMES.has(name)) return 'color';
  if (SIZE_NAMES.has(name)) return 'size';
  if (BOOLEAN_NAMES.has(name)) return 'boolean';
  if (MEASUREMENT_NAMES.has(name)) return 'measurement';
  if (values.length > 1) return 'list';
  return 'text';
}

/** Attributes shown in the details tab (exclude video — has its own tab). */
export function getDetailTabAttributes(attributes: DtoProductAttributeResponse[] = []) {
  return attributes.filter((attribute) => {
    const kind = resolveProductAttributeKind(attribute);
    return kind !== 'video';
  });
}

export function formatAttributeLabel(name?: string) {
  if (!name) return 'Attribute';
  return name.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatAttributeValue(value: string) {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true') return 'Yes';
  if (normalized === 'false') return 'No';
  return value;
}
