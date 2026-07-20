'use client';

import { AdminModuleError } from '@/components/error-state/admin-module-error';

export default function TransactionsError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AdminModuleError module='transactions' error={error} reset={reset} />;
}
