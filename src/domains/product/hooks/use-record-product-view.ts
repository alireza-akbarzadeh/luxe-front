'use client';

import { useEffect, useRef } from 'react';

import { useAuth } from '@/components/providers/auth-provider';
import { usePostProductsIdView } from '@/services/-products-{id}-view-post';

/**
 * Records a PDP view for signed-in shoppers (powers homepage recently-viewed rail).
 * Fires once per mount when the product id is valid.
 */
export function useRecordProductView(productId: number) {
  const { isAuthenticated } = useAuth();
  const recordedRef = useRef(false);
  const { mutate } = usePostProductsIdView();

  useEffect(() => {
    if (!isAuthenticated || productId <= 0 || recordedRef.current) {
      return;
    }

    recordedRef.current = true;
    mutate({ id: productId });
  }, [isAuthenticated, mutate, productId]);
}
