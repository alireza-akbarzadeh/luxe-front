'use client';

import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/footer/footer').then((m) => m.Footer));

/** Below-the-fold footer — separate chunk to shrink the initial route bundle. */
export function FooterClient() {
  return <Footer />;
}
