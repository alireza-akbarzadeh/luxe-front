'use client';

import { AdminModuleError } from '@/components/error-state/admin-module-error';

export default function InvoiceError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AdminModuleError module='invoice' error={error} reset={reset} />;
}
