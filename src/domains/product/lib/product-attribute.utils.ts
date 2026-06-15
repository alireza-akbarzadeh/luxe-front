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

/** Attributes shown in the details tab (exclude video and variant pickers). */
export function getDetailTabAttributes(attributes: DtoProductAttributeResponse[] = []) {
  return attributes.filter((attribute) => {
    const kind = resolveProductAttributeKind(attribute);
    return kind !== 'video' && kind !== 'color' && kind !== 'size';
  });
}

export function formatAttributeLabel(name?: string) {
  if (!name) return 'Attribute';
  return name.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

/** Merge product_attributes with legacy colors/sizes columns when variant rows are missing. */
export function getVariantPickerAttributes(
  attributes: DtoProductAttributeResponse[] = [],
  legacy?: { colors?: string[]; sizes?: string[] }
): DtoProductAttributeResponse[] {
  const merged = [...attributes];
  const hasColor = merged.some((attribute) => resolveProductAttributeKind(attribute) === 'color');
  const hasSize = merged.some((attribute) => resolveProductAttributeKind(attribute) === 'size');

  if (!hasColor && legacy?.colors?.length) {
    merged.unshift({ name: 'color', values: legacy.colors });
  }
  if (!hasSize && legacy?.sizes?.length) {
    merged.unshift({ name: 'size', values: legacy.sizes });
  }

  return merged;
}

export function formatAttributeValue(value: string) {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true') return 'Yes';
  if (normalized === 'false') return 'No';
  return value;
}

/** Single-line display for feature highlight cards. */
export function formatAttributeValues(values: string[] = [], maxLength = 72) {
  const text = values.map(formatAttributeValue).filter(Boolean).join(', ');
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}…`;
}
