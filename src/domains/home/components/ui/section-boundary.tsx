import { type ReactNode, Suspense } from 'react';

/** Per-section RSC streaming — must be a Server Component (not client Suspense). */
export function SectionBoundary({
  children,
  fallback
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
