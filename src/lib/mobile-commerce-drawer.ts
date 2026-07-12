/** Mobile storefront bottom tab bar — cart/checkout action bars sit above this. */
export const MOBILE_TAB_BAR_BOTTOM_CLASS = 'bottom-[calc(4rem+env(safe-area-inset-bottom))]';

/** Tab bar height inset — footer/main when only the bottom nav is fixed. */
export const MOBILE_TAB_BAR_BOTTOM_INSET = 'calc(4rem + env(safe-area-inset-bottom))';

/** Tab bar + collapsed sticky commerce action bar — page/footer scroll clearance on mobile. */
export const MOBILE_COMMERCE_STACK_BOTTOM_INSET = 'calc(13rem + env(safe-area-inset-bottom))';

export const MOBILE_FOOTER_TAB_BAR_PADDING_CLASS =
  'pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0';

export const MOBILE_FOOTER_COMMERCE_PADDING_CLASS =
  'pb-[calc(13rem+env(safe-area-inset-bottom))] lg:pb-0';

export const MOBILE_PAGE_COMMERCE_PADDING_CLASS =
  'pb-[calc(13rem+env(safe-area-inset-bottom))] lg:pb-16';

/** Routes with a fixed commerce action bar above the mobile tab nav. */
export function pathHasMobileCommerceActionBar(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, '') || '/';

  return (
    normalized.startsWith('/product/') ||
    normalized === '/cart' ||
    normalized.startsWith('/checkout')
  );
}

/** Order-summary drawer — anchors above the sticky commerce action bar + tab bar. */
export const MOBILE_COMMERCE_SUMMARY_DRAWER_BOTTOM_CLASS =
  'bottom-[calc(13rem+env(safe-area-inset-bottom))]';

/** Max height for summary drawer content area (viewport minus tab bar + action bar). */
export const MOBILE_COMMERCE_SUMMARY_DRAWER_MAX_HEIGHT_CLASS =
  'max-h-[calc(100dvh-13rem-env(safe-area-inset-bottom))]';

/** Dim overlay stops above the sticky commerce action bar + tab bar. */
export const MOBILE_COMMERCE_OVERLAY_BOTTOM_CLASS =
  'bottom-[calc(13rem+env(safe-area-inset-bottom))]';

/** Scrollable summary body — drawer chrome (handle, title, padding) subtracted. */
export const MOBILE_COMMERCE_SUMMARY_SCROLL_MAX_HEIGHT_CLASS =
  'max-h-[calc(100dvh-13rem-env(safe-area-inset-bottom)-6.5rem)]';

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
