'use client';

import { AdminModuleError } from '@/components/error-state/admin-module-error';

export default function OrderError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AdminModuleError module='order' error={error} reset={reset} />;
}
