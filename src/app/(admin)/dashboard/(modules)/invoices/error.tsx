'use client';

import { AdminModuleError } from '@/components/error-state/admin-module-error';

export default function InvoicesError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AdminModuleError module='invoices' error={error} reset={reset} />;
}
