// components/section-boundary.tsx
'use client';

import { type ReactNode, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export function SectionBoundary({
  children,
  fallback
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  return (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
