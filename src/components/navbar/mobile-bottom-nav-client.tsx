'use client';

import dynamic from 'next/dynamic';

const MobileBottomNav = dynamic(() =>
  import('@/components/navbar/mobile-bottom-nav').then((m) => m.MobileBottomNav)
);

/** Lazy-loaded mobile nav — separate chunk from the site layout shell. */
export function MobileBottomNavClient() {
  return <MobileBottomNav />;
}
