/** Shared mobile PDP shell — info card + commerce sheet use the same curve and elevation. */
export const PDP_MOBILE_SHEET_RADIUS_CLASS = 'rounded-t-[1.75rem]';

export const PDP_MOBILE_SHEET_SHADOW_CLASS =
  'shadow-[0_-12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_-16px_48px_rgba(0,0,0,0.45)]';

export const PDP_MOBILE_INFO_OVERLAP_CLASS = 'max-lg:-mt-10';

/** Mobile gallery image height — aligns info card overlap with commerce sheet. */
export const PDP_MOBILE_GALLERY_IMAGE_CLASS =
  'aspect-[3/4] max-h-[min(52svh,520px)] w-full lg:aspect-[4/5] lg:max-h-[min(620px,68vh)]';

export const PDP_MOBILE_TAB_BAR_OFFSET = 'calc(4rem + env(safe-area-inset-bottom))';

export { MOBILE_PAGE_COMMERCE_PADDING_CLASS as PDP_MOBILE_PAGE_PADDING_CLASS } from '@/lib/mobile-commerce-drawer';
