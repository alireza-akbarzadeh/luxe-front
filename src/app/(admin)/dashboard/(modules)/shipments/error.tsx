'use client';

import { AdminModuleError } from '@/components/error-state/admin-module-error';

export default function ShipmentsError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AdminModuleError module='shipments' error={error} reset={reset} />;
}
