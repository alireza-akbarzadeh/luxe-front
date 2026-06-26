'use client';

import { AdminModuleError } from '@/components/error-state/admin-module-error';

export default function OrdersError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AdminModuleError module='orders' error={error} reset={reset} />;
}
