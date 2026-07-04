'use client';

import { useRecordProductView } from '@/domains/product/hooks/use-record-product-view';

type ProductViewTrackerProps = {
  productId: number;
};

/** Client island — records authenticated PDP views without rendering UI. */
export function ProductViewTracker({ productId }: ProductViewTrackerProps) {
  useRecordProductView(productId);
  return null;
}
