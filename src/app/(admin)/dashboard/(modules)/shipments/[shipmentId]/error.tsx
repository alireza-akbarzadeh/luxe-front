'use client';

import { AdminModuleError } from '@/components/error-state/admin-module-error';

export default function ShipmentError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AdminModuleError module='shipment' error={error} reset={reset} />;
}
