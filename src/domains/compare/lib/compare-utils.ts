import { formatPrice } from '@/domains/home/lib/home-utils';
import {
  formatAttributeLabel,
  formatAttributeValues,
  getDetailTabAttributes
} from '@/domains/product/lib/product-attribute.utils';
import type { DtoCompareProductResponse } from '@/services/-compare-post.schemas';

export type CompareValueType = 'currency' | 'number' | 'percent' | 'text';

export interface CompareRowDefinition {
  key: string;
  label: string;
  section: string;
  type: CompareValueType;
  higherIsBetter: boolean;
  getValue: (product: DtoCompareProductResponse) => string | number | null | undefined;
}

const CORE_ROWS: CompareRowDefinition[] = [
  {
    key: 'price',
    label: 'Price',
    section: 'Pricing',
    type: 'currency',
    higherIsBetter: false,
    getValue: (product) => product.price ?? null
  },
  {
    key: 'compare_at_price',
    label: 'Original price',
    section: 'Pricing',
    type: 'currency',
    higherIsBetter: false,
    getValue: (product) => product.compare_at_price ?? product.price ?? null
  },
  {
    key: 'discount',
    label: 'Discount',
    section: 'Pricing',
    type: 'percent',
    higherIsBetter: true,
    getValue: (product) => product.discount_percent ?? 0
  },
  {
    key: 'rating',
    label: 'Rating',
    section: 'Reviews',
    type: 'number',
    higherIsBetter: true,
    getValue: (product) => product.rating ?? 0
  },
  {
    key: 'reviews',
    label: 'Review count',
    section: 'Reviews',
    type: 'number',
    higherIsBetter: true,
    getValue: (product) => product.reviews_count ?? 0
  },
  {
    key: 'category',
    label: 'Category',
    section: 'Product',
    type: 'text',
    higherIsBetter: false,
    getValue: (product) => product.category?.name ?? '—'
  },
  {
    key: 'brand',
    label: 'Brand',
    section: 'Product',
    type: 'text',
    higherIsBetter: false,
    getValue: (product) => product.brand?.name ?? '—'
  },
  {
    key: 'is_new',
    label: 'New arrival',
    section: 'Product',
    type: 'text',
    higherIsBetter: false,
    getValue: (product) => (product.is_new ? 'Yes' : 'No')
  },
  {
    key: 'is_digital',
    label: 'Product type',
    section: 'Product',
    type: 'text',
    higherIsBetter: false,
    getValue: (product) => (product.is_digital ? 'Digital' : 'Physical')
  },
  {
    key: 'stock',
    label: 'In stock',
    section: 'Product',
    type: 'number',
    higherIsBetter: true,
    getValue: (product) => product.stock ?? 0
  },
  {
    key: 'store',
    label: 'Seller',
    section: 'Seller & delivery',
    type: 'text',
    higherIsBetter: false,
    getValue: (product) => product.store_name ?? '—'
  },
  {
    key: 'shipping',
    label: 'Shipping',
    section: 'Seller & delivery',
    type: 'text',
    higherIsBetter: false,
    getValue: (product) => product.shipping_info ?? '—'
  },
  {
    key: 'returns',
    label: 'Returns',
    section: 'Seller & delivery',
    type: 'text',
    higherIsBetter: false,
    getValue: (product) => product.return_policy ?? '—'
  }
];

/** Build dynamic spec rows from product attributes (excluding variant pickers). */
export function buildAttributeRows(products: DtoCompareProductResponse[]): CompareRowDefinition[] {
  const attributeNames = new Set<string>();

  for (const product of products) {
    for (const attribute of getDetailTabAttributes(product.attributes)) {
      if (attribute.name) attributeNames.add(attribute.name);
    }
  }

  return [...attributeNames].map((name) => ({
    key: `attr:${name}`,
    label: formatAttributeLabel(name),
    section: 'Specifications',
    type: 'text' as const,
    higherIsBetter: false,
    getValue: (product: DtoCompareProductResponse) => {
      const attribute = getDetailTabAttributes(product.attributes).find((item) => item.name === name);
      const values = attribute?.values?.filter(Boolean) ?? [];
      return values.length ? formatAttributeValues(values, 120) : '—';
    }
  }));
}

export function buildCompareRows(products: DtoCompareProductResponse[]): CompareRowDefinition[] {
  return [...CORE_ROWS, ...buildAttributeRows(products)];
}

export function groupCompareRows(rows: CompareRowDefinition[]) {
  const sections = new Map<string, CompareRowDefinition[]>();

  for (const row of rows) {
    const existing = sections.get(row.section) ?? [];
    existing.push(row);
    sections.set(row.section, existing);
  }

  return sections;
}

export function formatCompareValue(row: CompareRowDefinition, value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') return '—';

  switch (row.type) {
    case 'currency':
      return formatPrice(typeof value === 'number' ? value : Number(value));
    case 'percent':
      return `${Math.round(Number(value))}%`;
    case 'number':
      return String(value);
    default:
      return String(value);
  }
}

export function getRowNumericValues(products: DtoCompareProductResponse[], row: CompareRowDefinition) {
  if (row.type === 'text') return [];

  return products
    .map((product) => {
      const value = row.getValue(product);
      return typeof value === 'number' && !Number.isNaN(value) ? value : null;
    })
    .filter((value): value is number => value !== null);
}

export function getBestNumericValue(values: number[], higherIsBetter: boolean) {
  if (values.length < 2) return null;
  const unique = new Set(values);
  if (unique.size <= 1) return null;
  return higherIsBetter ? Math.max(...values) : Math.min(...values);
}

export function isBestCell(
  products: DtoCompareProductResponse[],
  row: CompareRowDefinition,
  product: DtoCompareProductResponse,
  highlightDiffs: boolean
) {
  if (!highlightDiffs || products.length < 2 || row.type === 'text') return false;

  const value = row.getValue(product);
  if (typeof value !== 'number' || Number.isNaN(value)) return false;

  const best = getBestNumericValue(getRowNumericValues(products, row), row.higherIsBetter);
  return best !== null && value === best;
}

export function getCompareWinners(products: DtoCompareProductResponse[]) {
  const prices = products.map((product) => product.price ?? 0);
  const ratings = products.map((product) => product.rating ?? 0);
  const discounts = products.map((product) => product.discount_percent ?? 0);

  const lowestPrice = Math.min(...prices);
  const highestRating = Math.max(...ratings);
  const highestDiscount = Math.max(...discounts);

  return {
    bestPriceProduct: products.find((product) => (product.price ?? 0) === lowestPrice),
    bestRatingProduct: products.find((product) => (product.rating ?? 0) === highestRating),
    bestDiscountProduct:
      highestDiscount > 0
        ? products.find((product) => (product.discount_percent ?? 0) === highestDiscount)
        : null
  };
}
