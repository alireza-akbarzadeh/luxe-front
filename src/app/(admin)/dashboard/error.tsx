'use client';

import { useEffect } from 'react';

import { DashboardErrorState } from '@/domains/dashboard/components/dashboard-error-state';

export default function DashboardError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <DashboardErrorState message={error.message} onRetry={reset} />;
}
