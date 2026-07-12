'use client';

import dynamic from 'next/dynamic';

import type { OrderTrackingMapInnerProps } from './order-tracking-map-inner';

/** Client-only Leaflet tracking map (avoids SSR `window` errors). */
export const OrderTrackingMap = dynamic(
  () => import('./order-tracking-map-inner').then((mod) => mod.OrderTrackingMapInner),
  {
    ssr: false,
    loading: () => (
      <div className='bg-muted border-border h-[280px] animate-pulse rounded-2xl border sm:h-[320px]' />
    )
  }
);

export type { OrderTrackingMapInnerProps as OrderTrackingMapProps };
