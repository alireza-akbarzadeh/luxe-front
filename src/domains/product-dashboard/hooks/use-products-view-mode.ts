import { parseAsStringLiteral, useQueryState } from 'nuqs';

export const productsViewModes = ['list', 'grid'] as const;
export type ProductsViewMode = (typeof productsViewModes)[number];

/** URL-synced list/grid toggle for the admin products page. */
export function useProductsViewMode() {
  return useQueryState('view', parseAsStringLiteral(productsViewModes).withDefault('list'));
}
