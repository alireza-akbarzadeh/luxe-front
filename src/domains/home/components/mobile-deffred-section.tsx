import type { ReactNode } from 'react';

/** Wraps below-fold blocks — `content-visibility: auto` applies on mobile only (see globals.css). */
export function MobileDeferredSection({ children }: { children: ReactNode }) {
  return <div className='home-defer-mobile'>{children}</div>;
}
