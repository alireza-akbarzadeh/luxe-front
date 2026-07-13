'use client';

import dynamic from 'next/dynamic';

import type { OrderTrackingMapInnerProps } from './order-tracking-map-inner';

/** Client-only Leaflet tracking map (avoids SSR `window` errors). */
export const OrderTrackingMap = dynamic(
  () => import('./order-tracking-map-inner').then((mod) => mod.OrderTrackingMapInner),
  {
    ssr: false,
    loading: () => (
      <div className='bg-muted border-border min-h-[min(52vh,420px)] animate-pulse rounded-2xl border sm:min-h-[480px] lg:min-h-[560px]' />
    )
  }
);

export type { OrderTrackingMapInnerProps as OrderTrackingMapProps };
