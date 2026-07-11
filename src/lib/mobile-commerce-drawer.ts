/** Mobile storefront bottom tab bar — cart/checkout action bars sit above this. */
export const MOBILE_TAB_BAR_BOTTOM_CLASS = 'bottom-[calc(4rem+env(safe-area-inset-bottom))]';

/** Order-summary drawer — anchors above the sticky commerce action bar + tab bar. */
export const MOBILE_COMMERCE_SUMMARY_DRAWER_BOTTOM_CLASS =
  'bottom-[calc(13rem+env(safe-area-inset-bottom))]';

/** Max height for summary drawer content area (viewport minus tab bar + action bar). */
export const MOBILE_COMMERCE_SUMMARY_DRAWER_MAX_HEIGHT_CLASS =
  'max-h-[calc(100dvh-13rem-env(safe-area-inset-bottom))]';

/** Collapsed commerce bar — total row + primary CTA. */
export const COMMERCE_SNAP_COLLAPSED = '168px';

/** Mid snap — order totals without line items. */
export const COMMERCE_SNAP_MID = 0.5;

/** Full snap — line items + totals. */
export const COMMERCE_SNAP_FULL = 0.92;

export const COMMERCE_SNAP_POINTS = [
  COMMERCE_SNAP_COLLAPSED,
  COMMERCE_SNAP_MID,
  COMMERCE_SNAP_FULL
] as const;

export type CommerceSnapPoint = (typeof COMMERCE_SNAP_POINTS)[number];

export function nextCommerceSnapPoint(current: number | string | null): number | string {
  const point = current ?? COMMERCE_SNAP_COLLAPSED;
  const index = COMMERCE_SNAP_POINTS.findIndex((snap) => snap === point);
  if (index < 0 || index >= COMMERCE_SNAP_POINTS.length - 1) {
    return COMMERCE_SNAP_FULL;
  }
  return COMMERCE_SNAP_POINTS[index + 1]!;
}
