'use client';

import { AdminModuleError } from '@/components/error-state/admin-module-error';

export default function RevenueReportError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AdminModuleError module='revenue' error={error} reset={reset} variant='revenue' />;
}
